import React from "react";
import { Navigate } from "react-router-dom";
import { User } from "../model/Model";
import { AuthService } from "../services/AuthService";

interface LoginProps {
  authService: AuthService;
  setUser: (user: User) => void;
}

interface LoginState {
  userName: string;
  password: string;
  loginAttempted: boolean;
  loginSuccessful: boolean;
}

export class Login extends React.Component<LoginProps, LoginState> {
  state: LoginState = {
    userName: "",
    password: "",
    loginAttempted: false,
    loginSuccessful: false,
  };

  private handleUserNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ userName: event.target.value });
  };

  private handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ password: event.target.value });
  };

  private handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.setState({ loginAttempted: true });

    const result = await this.props.authService.login(
      this.state.userName,
      this.state.password
    );

    if (result) {
      this.setState({ loginSuccessful: true });
      this.props.setUser(result);
      <Navigate to="/some_route" replace={true} />;
    } else {
      console.log("wrong login");
      this.setState({ loginSuccessful: false });
    }
  };

  render() {
    let loginMessage: any;

    if (this.state.loginAttempted) {
      if (this.state.loginSuccessful) {
        loginMessage = <label>Login successful!</label>;
      } else {
        loginMessage = <label>Login failed!</label>;
      }
    }

    return (
      <div>
        <h2>Please login</h2>
        <form onSubmit={this.handleSubmit}>
          <input
            value={this.state.userName}
            onChange={this.handleUserNameChange}
          />
          <br />
          <input
            value={this.state.password}
            onChange={this.handlePasswordChange}
            type="password"
          />
          <br />
          <button type="submit">Login</button>
          <br />
          {loginMessage}
        </form>
      </div>
    );
  }
}
