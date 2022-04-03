import { Space } from "../model/Model";
import {
  CreateSpace,
  ICreateSpaceState,
} from "../components/spaces/CreateSpace";

export class DataService {
  public async createSpace(iCreateSpace: ICreateSpaceState) {
    return "123";
  }

  public async getSpaces(): Promise<Space[]> {
    const result: Space[] = [];

    result.push({
      spaceId: "space1",
      name: "Space 1",
      location: "New York",
      imageUrl: "https://picsum.photos/200/300",
    });
    result.push({
      spaceId: "space2",
      name: "Space 2",
      location: "Paris",
      imageUrl: "https://picsum.photos/200/300",
    });

    return result;
  }

  public async reserveSpace(spaceId: string): Promise<string | undefined> {
    if (spaceId === "space1") {
      return "99999";
    } else {
      return undefined;
    }
  }
}
