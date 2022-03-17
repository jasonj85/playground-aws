import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import validator from "@middy/validator";
import createError from "http-errors";
import { setAuctionImageUrl } from "../lib/setAuctionImageUrl";
import { uploadImageToS3 } from "../lib/uploadImageToS3";
import { getAuctionById } from "./getAuction";
import uploadAuctionImageSchema from "../lib/schemas/uploadAuctionImageSchema";

export async function uploadAuctionImage(event) {
  const { id } = event.pathParameters;
  const { email } = event.requestContext.authorizer;
  const auction = await getAuctionById(id);

  // check uploader is same as auction seller
  if (auction.seller !== email) {
    throw new createError.Forbidden(
      `Only the auction seller can upload an image!`
    );
  }

  const base64 = event.body.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  let updatedAuction;

  try {
    const uploadImageLocation = await uploadImageToS3(
      auction.id + ".jpg",
      buffer
    );
    console.log(uploadImageLocation);

    updatedAuction = await setAuctionImageUrl(auction.id, uploadImageLocation);
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = middy(uploadAuctionImage)
  .use(httpErrorHandler())
  .use(validator({ inputSchema: uploadAuctionImageSchema }));
