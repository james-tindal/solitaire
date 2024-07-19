import * as pulumi from '@pulumi/pulumi'
import * as github from '@pulumi/github'
import * as aws from '@pulumi/aws'

import tags from './tags.json' with { type: 'json' }
import { bucket } from './s3-website'


const repo = new pulumi.Config('config').require('github-repo')
const awsRegion = new pulumi.Config('aws').require('region')

// User
const awsUser = new aws.iam.User('solitaire.github-actions-user', { tags })

// UserPolicy
new aws.iam.UserPolicy('solitaire.github-actions-user.policy', {
  user: awsUser.name,
  policy: {
    Version: '2012-10-17',
    Statement: [{
      Effect: 'Allow',
      Action: [
        's3:PutObject',
        's3:PutObjectAcl',
        's3:DeleteObject',
        's3:GetObject'
      ],
      Resource: [pulumi.interpolate`${bucket.arn}/*`]
    }]
  }
})

// Access Key
const accessKey = new aws.iam.AccessKey('solitaire.github-actions-user.access-key', {
  user: awsUser.name
})

// GitHub Actions variables
new github.ActionsSecret('awsAccessKeyId', {
  repository: repo,
  secretName: 'AWS_ACCESS_KEY_ID',
  plaintextValue: accessKey.id,
})

new github.ActionsSecret('awsSecretAccessKey', {
  repository: repo,
  secretName: 'AWS_SECRET_ACCESS_KEY',
  plaintextValue: accessKey.secret,
})

new github.ActionsVariable('s3Uri', {
  repository: repo,
  variableName: 'S3_URI',
  value: pulumi.interpolate`s3://${bucket.bucket}`,
})

new github.ActionsVariable('awsRegion', {
  repository: repo,
  variableName: 'AWS_REGION',
  value: awsRegion,
})
