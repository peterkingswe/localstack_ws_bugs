import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";
import {PulumiUtil} from "./pulumi-provider"
import {wsLambda, wsLambdaRole} from "./ws_api_route_handler_lambda"

export const wsApiGwLogGroup = new aws.cloudwatch.LogGroup(
  "wsApiGwLogGroup",
  {
    retentionInDays: 3,
  },
  { provider: PulumiUtil.awsProvider }
);

export const wsApiGw = new aws.apigatewayv2.Api(
  "wsApiGw",
  {
    protocolType: "WEBSOCKET",
    routeSelectionExpression: "$request.body.action",
  },
  { provider: PulumiUtil.awsProvider }
);

// export const chatApiUrl = wsApiGw.apiEndpoint;
export const wsApiGwStage = new aws.apigatewayv2.Stage(
  "wsApiGwStage",
  {
    apiId: wsApiGw.id,
    name: "ws",
    autoDeploy: true,
    defaultRouteSettings: {
      throttlingRateLimit: 100,
      throttlingBurstLimit: 50,
      dataTraceEnabled: false,
      loggingLevel: "ERROR",
    },
    accessLogSettings: {
      destinationArn: wsApiGwLogGroup.arn,
      format: JSON.stringify({
        requestId: "$context.requestId",
        ip: "$context.identity.sourceIp",
        caller: "$context.identity.caller",
        user: "$context.identity.user",
        requestTime: "$context.requestTime",
        httpMethod: "$context.httpMethod",
        resourcePath: "$context.resourcePath",
        status: "$context.status",
        protocol: "$context.protocol",
        responseLength: "$context.responseLength",
      }),
    },
  },
  { provider: PulumiUtil.awsProvider }
);

const allowApiGwInvokeWsLambda = new aws.lambda.Permission(
  "allowApiGwInvokeWsLambda",
  {
    action: "lambda:InvokeFunction",
    function: wsLambda.name,
    principal: "apigateway.amazonaws.com",
    sourceArn: pulumi.interpolate`${wsApiGw.executionArn}/*`,
  },
  { provider: PulumiUtil.awsProvider }
);

// export const wsChatUrl = wsApiGwStage.invokeUrl;
// wsChatUrl.apply(u => console.log('**** wsurl=', u));

export const wsIntegration = new aws.apigatewayv2.Integration(
  "wsIntegration",
  {
    apiId: wsApiGw.id,
    integrationType: "AWS_PROXY",
    contentHandlingStrategy: "CONVERT_TO_TEXT",
    description: "websocket integration",
    integrationMethod: "POST", // proxy method must be POST
    integrationUri: wsLambda.invokeArn,
    passthroughBehavior: "WHEN_NO_MATCH",
  },
  {
    provider: PulumiUtil.awsProvider,
    dependsOn: [
      allowApiGwInvokeWsLambda,
    ],
  }
);

// allow lambda invoke api-gw so it can interact with other websockets
export const wsLambdaInvokeApiGwPolicy = new aws.iam.Policy(
  "lambdaInvokeApiGwPolicy",
  {
    path: "/",
    description: "IAM policy for allowing Lambda to execute api-gw calls.",
    policy: {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: ["execute-api:*"],
          Resource: wsApiGwStage.executionArn.apply((arn) => arn + "/*"),
        },
      ],
    },
  },
  { provider: PulumiUtil.awsProvider }
);

const wsLambdaInvokeApiGwPolicyAttachment =
  new aws.iam.RolePolicyAttachment(
    "wsLambdaInvokeApiGwPolicyAttachment",
    {
      role: wsLambdaRole.name,
      policyArn: wsLambdaInvokeApiGwPolicy.arn,
    },
    { provider: PulumiUtil.awsProvider }
  );

export const wsDefaultRoute = new aws.apigatewayv2.Route(
  "wsDefaultRoute",
  {
    apiId: wsApiGw.id,
    routeKey: `$default`,
    target: wsIntegration.id.apply((id) => "integrations/" + id),
  },
  { provider: PulumiUtil.awsProvider }
);

export const wsConnectRoute = new aws.apigatewayv2.Route(
  "wsConnectRoute",
  {
    apiId: wsApiGw.id,
    routeKey: `$connect`,
    target: wsIntegration.id.apply((id) => "integrations/" + id),
  },
  { provider: PulumiUtil.awsProvider }
);

export const wsDisconnectRoute = new aws.apigatewayv2.Route(
  "wsDisconnectRoute",
  {
    apiId: wsApiGw.id,
    routeKey: `$disconnect`,
    target: wsIntegration.id.apply((id) => "integrations/" + id),
  },
  { provider: PulumiUtil.awsProvider }
);

export const wsPingRoute = new aws.apigatewayv2.Route(
  "wsPingRoute",
  {
    apiId: wsApiGw.id,
    routeKey: `ping`,
    target: wsIntegration.id.apply((id) => "integrations/" + id),
  },
  { provider: PulumiUtil.awsProvider }
);
