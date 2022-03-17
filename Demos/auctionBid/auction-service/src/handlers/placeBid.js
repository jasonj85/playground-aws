import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";
import { getAuctionById } from "./getAuction";
import validator from "@middy/validator";
import getPlaceBidSchema from "../lib/schemas/placeBidSchema";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;
  const { email } = event.requestContext.authorizer;
  const auction = await getAuctionById(id);

  // auction status invalid
  if (auction.status.toLowerCase() !== "open") {
    throw new createError.Forbidden(`You cannot bid on a closed auction!`);
  }

  // bid identity validation
  if (email === auction.seller) {
    throw new createError.Forbidden(`Buyer cannot be the same as the seller`);
  }

  // avoid double bidding
  if (email === auction.highestBid.bidder) {
    throw new createError.Forbidden(
      `You already have the highest bid and cannot double bid`
    );
  }

  // check bid amount is higher than previous
  if (amount <= auction.highestBid.amount) {
    throw new createError.Forbidden(
      `Your bid must be higher than ${auction.highestBid.amount}`
    );
  }

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression:
      "set highestBid.amount = :amount, highestBid.bidder = :bidder",
    ExpressionAttributeValues: {
      ":amount": amount,
      ":bidder": email,
    },
    ReturnValues: "ALL_NEW",
  };

  let updatedAuction;

  try {
    const result = await dynamodb.update(params).promise();
    console.log(result);
    updatedAuction = result.Attributes;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = commonMiddleware(placeBid).use(
  validator({ inputSchema: getPlaceBidSchema })
);
