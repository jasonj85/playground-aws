import { Space } from "../model/Model";
import { ICreateSpaceState } from "../components/spaces/CreateSpace";
import { S3, config } from "aws-sdk";
import { config as appConfig } from "./config";
import { generateRandomId } from "../utils/Utils";

config.update({ region: appConfig.REGION });

export class DataService {
  public async createSpace(iCreateSpace: ICreateSpaceState) {
    if (iCreateSpace.photo) {
      const photoUrl = await this.uploadPublicFile(
        iCreateSpace.photo,
        appConfig.SPACES_PHOTOS_BUCKET_NAME
      );

      iCreateSpace.photoURL = photoUrl;
      iCreateSpace.photo = undefined;
    }

    const requestUrl = appConfig.api.spacesUrl;
    const requestOptions: RequestInit = {
      method: "POST",
      body: JSON.stringify(iCreateSpace),
    };

    const result = await fetch(requestUrl, requestOptions);
    const json = await result.json();
    return JSON.stringify(json.spaceId);
  }

  private async uploadPublicFile(file: File, bucket: string): Promise<string> {
    const fileName = generateRandomId() + file.name;
    const uploadResult = await new S3({ region: appConfig.REGION })
      .upload({
        Bucket: bucket,
        Key: fileName,
        Body: file,
        ACL: "public-read",
      })
      .promise();

    return uploadResult.Location;
  }

  public async getSpaces(): Promise<Space[]> {
    const requestUrl = appConfig.api.spacesUrl;
    const requestOptions: RequestInit = {
      method: "GET",
    };

    const result = await fetch(requestUrl, requestOptions);
    const json = await result.json();
    return json;
  }

  public async reserveSpace(spaceId: string): Promise<string | undefined> {
    if (spaceId === "space1") {
      return "99999";
    } else {
      return undefined;
    }
  }
}
