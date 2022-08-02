import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import {
    lambdaExecPolicy,
    lambdaLoggingPolicy,
} from "./policies";
import {PulumiUtil} from "./pulumi-provider"

export const wsLambdaRole = new aws.iam.Role(
    "wsLambdaRole",
    {
        assumeRolePolicy: {
            Version: "2012-10-17",
            Statement: [
                {
                    Action: "sts:AssumeRole",
                    Principal: {
                        Service: [
                            "lambda.amazonaws.com",
                            "apigateway.amazonaws.com",
                            "edgelambda.amazonaws.com",
                        ],
                    },
                    Effect: "Allow",
                    Sid: "",
                },
            ],
        },
    },
    {provider: PulumiUtil.awsProvider}
);


const wsLambdaLoggingRoleAttachment = new aws.iam.RolePolicyAttachment(
    "wsLambdaLoggingRoleAttachment",
    {
        role: wsLambdaRole.name,
        policyArn: lambdaLoggingPolicy.arn,
    },
    {provider: PulumiUtil.awsProvider}
);

const wsLambdaExecPolicyRoleAttachment = new aws.iam.RolePolicyAttachment(
    "wsLambdaExecPolicyRoleAttachment",
    {
        role: wsLambdaRole.name,
        policyArn: lambdaExecPolicy.arn,
    },
    {provider: PulumiUtil.awsProvider}
);

export const wsLambda = new aws.lambda.Function(
    "wsLambda",
    {
        code: new pulumi.asset.AssetArchive({
            "lambda_function.py": new pulumi.asset.FileAsset(
                "../ws_api_route_handler_lambda/lambda_function.py"
            ),
        }),
        role: wsLambdaRole.arn,
        handler: "lambda_function.lambda_handler",
        runtime: "python3.7",
        memorySize: 128,
        timeout: 5,
    },
    {
        provider: PulumiUtil.awsProvider,
        dependsOn: [
            wsLambdaLoggingRoleAttachment,
            wsLambdaExecPolicyRoleAttachment,
        ],
    }
);

export const wsLambdaLogGroup = new aws.cloudwatch.LogGroup(
    "wsLambdaLogGroup",
    {
        name: pulumi.interpolate`/aws/lambda/${wsLambda.name}`,
        retentionInDays: 3,
    },
    {provider: PulumiUtil.awsProvider}
);
