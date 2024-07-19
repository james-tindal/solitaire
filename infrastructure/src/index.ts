
/**
 * Create an S3 bucket for Github Actions to sync to
 * Put it behind a Cloudfront distribution
 * Served at solitaire.jamestindal.co.uk
 * 
 * Create an aws user with permission to update the bucket
 * Send to Github Actions: aws user keys, bucket identifier, aws region
 */

import './s3-website'
import './github-actions'
