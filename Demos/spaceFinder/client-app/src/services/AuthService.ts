import { User, UserAttribute } from "../model/Model";

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

  public async logout(): Promise<void> {}

  public async getUserAttributes(user: User): Promise<UserAttribute[]> {
    const result: UserAttribute[] = [];

    result.push({
      Name: "email",
      Value: user.email,
    });
    result.push({
      Name: "jobTitle",
      Value: "Engineer",
    });
    result.push({
      Name: "age",
      Value: "20",
    });

    return result;
  }
}
