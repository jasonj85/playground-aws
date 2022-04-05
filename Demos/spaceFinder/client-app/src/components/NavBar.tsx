import { Component } from "react";
import { User } from "../model/Model";
import { Link } from "react-router-dom";

export default class NavBar extends Component<{ user: User | undefined }> {
  render() {
    let loggedIn = this.props.user !== undefined;

    return (
      <div className="navbar">
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/spaces">Spaces</Link>
        {loggedIn && (
          <Link to="/logout" style={{ float: "right" }}>
            Logout ({this.props.user?.userName})
          </Link>
        )}
        {!loggedIn && (
          <Link to="/login" style={{ float: "right" }}>
            Login
          </Link>
        )}
      </div>
    );
  }
}
