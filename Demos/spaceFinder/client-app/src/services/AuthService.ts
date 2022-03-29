import { User } from "../model/Model";

export class AuthService {
  public async login(
    userName: string,
    password: string
  ): Promise<User | undefined> {
    if (userName === "user" && password === "123") {
      return {
        userName: userName,
        email: "person@email.com",
      };
    } else return undefined;
  }
}
