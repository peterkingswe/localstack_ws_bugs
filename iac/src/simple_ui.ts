// // Copyright 2016-2021, Pulumi Corporation.  All rights reserved.
//
// import * as aws from "@pulumi/aws";
// import * as pulumi from "@pulumi/pulumi";
// import * as fs from "fs";
// import * as mime from "mime";
// import {PulumiUtil} from "./pulumi-provider";
//
// // Create a bucket and expose a website index document
// // bucket to store static site, cf logs, reports and file uploads
// export const siteBucket = new aws.s3.Bucket(
//   "frontend-bucket",
//   {
//     bucketPrefix: "frontend-bucket", // use prefix instead of name so bucket an be swapped out
//     forceDestroy: true,
//     versioning: {
//       enabled: false,
//     },
//     // acl: "private", // bucket is private
//     // lifecycleRules: [
//     //   // auto delete reports after 1 day
//     //   {
//     //     enabled: true,
//     //     expiration: {
//     //       days: 1,
//     //     },
//     //     noncurrentVersionExpiration: { days: 1 },
//     //     id: "report-cleanup",
//     //     prefix: reportsOutputPrefix,
//     //     transitions: [],
//     //   },
//     //   // auto delete cloudfront logs after 3 days
//     //   {
//     //     enabled: true,
//     //     expiration: {
//     //       days: 3,
//     //     },
//     //     noncurrentVersionExpiration: { days: 3 },
//     //     id: "cf-log-cleanup",
//     //     prefix: cfLogOutputPrefix,
//     //     transitions: [],
//     //   },
//     //   // auto delete uploaded files after 1 days
//     //   {
//     //     enabled: true,
//     //     expiration: {
//     //       days: 1,
//     //     },
//     //     noncurrentVersionExpiration: { days: 1 },
//     //     id: "upload-file-cleanup",
//     //     prefix: fuelPriceUploadPrefix,
//     //     transitions: [],
//     //   },
//     // ],
//     // allow browser upload with signed url
//     // corsRules: [
//     //   {
//     //     allowedHeaders: ["*"],
//     //     allowedMethods: ["PUT", "POST"],
//     //     // allowedOrigins: [`https://${siteDomainName}`, "http://localhost:4200"],
//     //     exposeHeaders: ["ETag"],
//     //     maxAgeSeconds: 3000,
//     //   },
//     // ],
//     // tags: mkTagsWithName("frontend-bucket"),
//   },
//   { provider: PulumiUtil.awsProvider }
// );
//
//
// const publicAccessBlock = new aws.s3.BucketPublicAccessBlock("public-access-block", {
//     bucket: siteBucket.id,
//     blockPublicAcls: false,
// },{ provider: PulumiUtil.awsProvider });
// //
// // // TODO modify this
// const siteDir = "../ui/src"; // directory for content files
//
// // For each file in the directory, create an S3 object stored in `siteBucket`
// for (const item of fs.readdirSync(siteDir)) {
//     const filePath = require("path").join(siteDir, item);
//     const siteObject = new aws.s3.BucketObject(item, {
//         bucket: siteBucket,                               // reference the s3.Bucket object
//         source: new pulumi.asset.FileAsset(filePath),     // use FileAsset to point to a file
//         contentType: mime.getType(filePath) || undefined, // set the MIME type of the file
//     },{ provider: PulumiUtil.awsProvider });
// }
//
// // // Set the access policy for the bucket so all objects are readable
// const bucketPolicy = new aws.s3.BucketPolicy("bucketPolicy", {
//     bucket: siteBucket.id, // refer to the bucket created earlier
//     policy: pulumi.jsonStringify({
//         Version: "2012-10-17",
//         Statement: [{
//             Effect: "Allow",
//             Principal: "*",
//             Action: [
//                 "s3:GetObject",
//             ],
//             Resource: [
//                 pulumi.interpolate `${siteBucket.arn}/*`,
//             ],
//         }],
//     }),
// }, { provider: PulumiUtil.awsProvider,dependsOn: publicAccessBlock });
