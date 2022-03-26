import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { getEventBody } from "../Shared/Utils";

const TABLE_NAME = process.env.TABLE_NAME as string;
const PRIMARY_KEY = process.env.PRIMARY_KEY as string;
const dbClient = new DynamoDB.DocumentClient();

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify("Hello from DynamoDB!"),
  };

  try {
    const requestBody = getEventBody(event);
    const spaceId = event.queryStringParameters?.[PRIMARY_KEY];

    if (requestBody && spaceId) {
      const requestBodyKey = Object.keys(requestBody)[0];
      const requestBodyValue = requestBody[requestBodyKey];

      const updateResult = await dbClient
        .update({
          TableName: TABLE_NAME,
          Key: {
            [PRIMARY_KEY]: spaceId,
          },
          UpdateExpression: `set #xxNew = :newValue`,
          ExpressionAttributeValues: {
            ":newValue": requestBodyValue,
          },
          ExpressionAttributeNames: {
            "#xxNew": requestBodyKey,
          },
          ReturnValues: "UPDATED_NEW",
        })
        .promise();

      result.body = JSON.stringify(updateResult);
    }
  } catch (error: any) {
    result.statusCode = 500;
    result.body = JSON.stringify(error.message);
  }

  return result;
}

export { handler };
