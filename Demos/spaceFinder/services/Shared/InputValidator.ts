import { Space } from "./Model";

export class MissingFieldError extends Error {}

export function validateAsSpace(arg: any) {
  if (!(arg as Space).name) {
    throw new MissingFieldError("Field missing: name");
  }
  if (!(arg as Space).location) {
    throw new MissingFieldError("Field missing: location");
  }
  if (!(arg as Space).spaceId) {
    throw new MissingFieldError("Field missing: spaceId");
  }
}
