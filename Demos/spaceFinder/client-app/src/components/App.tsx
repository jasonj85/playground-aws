import React from "react";
import { User } from "../model/Model";
import { AuthService } from "../services/AuthService";
import { Login } from "./Login";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";
import NavBar from "./NavBar";
import Spaces from "./spaces/Spaces";
import { DataService } from "../services/DataService";

interface AppState {
  user: User | undefined;
}

export class App extends React.Component<{}, AppState> {
  private authService: AuthService = new AuthService();
  private dataService: DataService = new DataService();

  constructor(props: any) {
    super(props);

    this.state = { user: undefined };
    this.setUser = this.setUser.bind(this);
  }

  private setUser(user: User) {
    this.setState({ user });

    console.log("User set to: ", user);
  }

  render() {
    return (
      <div className="wrapper">
        <NavBar user={this.state.user} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/profile"
            element={
              <Profile authService={this.authService} user={this.state.user} />
            }
          />
          <Route
            path="/spaces"
            element={<Spaces dataService={this.dataService} />}
          />
          <Route
            path="/login"
            element={
              <Login authService={this.authService} setUser={this.setUser} />
            }
          />
          <Route
            path="/logout"
            element={
              <Login authService={this.authService} setUser={this.setUser} />
            }
          />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    );
  }
}

export default App;
