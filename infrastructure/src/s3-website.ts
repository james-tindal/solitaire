import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'

import tags from './tags.json' with { type: 'json' }


const config = new pulumi.Config('config')
const domain    = config.require('domain')
const subdomain = config.require('subdomain')
const fullDomain = `${subdomain}.${domain}`

// S3 bucket to host website
export const bucket = new aws.s3.Bucket('solitaire.website-bucket', {
  bucketPrefix: 'solitaire.',
  tags
})

// Cloudfront Origin Access Control
const originAccessControl = new aws.cloudfront.OriginAccessControl('solitaire.oac', {
  name: 'Solitaire OAC',
  description: 'Solitaire OAC',
  originAccessControlOriginType: 's3',
  signingBehavior: 'always',
  signingProtocol: 'sigv4',
})

// Grant the OAC read access to the S3 bucket
new aws.s3.BucketPolicy('solitaire.bucket-policy', {
  bucket: bucket.id,
  policy: {
    Version: '2012-10-17',
    Statement: [{
      Effect: 'Allow',
      Principal: { Service: 'cloudfront.amazonaws.com' },
      Action: 's3:GetObject',
      Resource: pulumi.interpolate`${bucket.arn}/*`,
    }]
  }
})

const certificate = aws.acm.getCertificateOutput({
  domain: '*.jamestindal.co.uk',
  mostRecent: true,
  statuses: ['ISSUED'],
})

// CloudFront distribution
const cloudfrontDistribution = new aws.cloudfront.Distribution('solitaire.cloudfrontDistribution', {
  enabled: true,
  origins: [{
    domainName: bucket.bucketDomainName,
    originId: bucket.arn,
    originAccessControlId: originAccessControl.id
  }],
  aliases: [fullDomain],
  defaultCacheBehavior: {
    targetOriginId: bucket.arn,
    viewerProtocolPolicy: 'redirect-to-https',
    allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
    cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
    forwardedValues: {
      queryString: false,
      cookies: { forward: 'none' },
    },
    minTtl: 0,
    defaultTtl: 3600,
    maxTtl: 86400,
  },
  priceClass: 'PriceClass_100',
  restrictions: {
    geoRestriction: {
      restrictionType: 'none',
    },
  },
  viewerCertificate: {
    acmCertificateArn: certificate.arn,
    sslSupportMethod: 'sni-only',
    minimumProtocolVersion: 'TLSv1.2_2021',
  },
  tags
})

// DNS A Record
const zone = aws.route53.getZoneOutput({ name: 'jamestindal.co.uk' })

new aws.route53.Record('solitaire.cloudfrontAliasRecord', {
  zoneId: zone.zoneId,
  name: fullDomain,
  type: 'A',
  aliases: [{
    name: cloudfrontDistribution.domainName,
    zoneId: cloudfrontDistribution.hostedZoneId,
    evaluateTargetHealth: false,
  }]
})
