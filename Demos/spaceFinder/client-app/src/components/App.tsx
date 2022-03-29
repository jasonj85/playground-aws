import React from "react";
import { User } from "../model/Model";
import { AuthService } from "../services/AuthService";
import { Login } from "./Login";

interface AppState {
  user: User | undefined;
}

export class App extends React.Component<{}, AppState> {
  private authService: AuthService = new AuthService();

  constructor(props: any) {
    super(props);

    this.setUser = this.setUser.bind(this);
  }

  private setUser(user: User) {
    this.setState({ user });

    console.log("User set to: ", user);
  }

  render() {
    return (
      <div>
        <Login authService={this.authService} setUser={this.setUser} />
        <h1>App!</h1>
      </div>
    );
  }
}

export default App;
