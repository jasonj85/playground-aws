import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
export function generateRandomId() {
  return Math.random().toString(36).slice(2);
}

export function getEventBody(event: APIGatewayProxyEvent) {
  return typeof event.body === "object" ? event.body : JSON.parse(event.body);
}

export function getDefaultResult(): APIGatewayProxyResult {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify("Hello from DynamoDB!"),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
    },
  };
  return result;
}
