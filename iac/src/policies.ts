import * as aws from '@pulumi/aws';
import {PulumiUtil} from "./pulumi-provider";

export const lambdaExecPolicy = new aws.iam.Policy(
    'lambdaExecPolicy',
    {
        path: '/',
        description: 'IAM policy for lambda to execute',
        policy: {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Action: [
                        'ec2:DescribeNetworkInterfaces',
                        'ec2:CreateNetworkInterface',
                        'ec2:DeleteNetworkInterface',
                        'ec2:DescribeInstances',
                        'ec2:AttachNetworkInterface'
                    ],
                    Resource: '*'
                }
            ]
        },
    },
    {provider: PulumiUtil.awsProvider}
);

export const lambdaLoggingPolicy = new aws.iam.Policy(
    'lambdaLoggingPolicy',
    {
        path: '/',
        description: 'IAM policy for logging from a lambda',
        policy: {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Action: [
                        'logs:CreateLogGroup',
                        'logs:CreateLogStream',
                        'logs:PutLogEvents'
                    ],
                    Resource: 'arn:aws:logs:*:*:*'
                }
            ]
        },
    },
    {provider: PulumiUtil.awsProvider}
);