import React, { Component } from "react";
import { Link } from "react-router-dom";
import { User, UserAttribute } from "../model/Model";
import { AuthService } from "../services/AuthService";

interface ProfileProps {
  user: User | undefined;
  authService: AuthService;
}
interface ProfileState {
  userAttributes: UserAttribute[];
}

export default class Profile extends Component<ProfileProps, ProfileState> {
  state: ProfileState = {
    userAttributes: [],
  };

  async componentDidMount() {
    if (this.props.user) {
      const userAttributes = await this.props.authService.getUserAttributes(
        this.props.user
      );
      this.setState({ userAttributes });
    }
  }

  private renderUserAttributes() {
    const rows: any = [];

    this.state.userAttributes.map((userAttribute) => {
      rows.push(
        <tr key={userAttribute.Name}>
          <td>{userAttribute.Name}</td>
          <td>{userAttribute.Value}</td>
        </tr>
      );
    });

    return (
      <table>
        <tbody>{rows}</tbody>
      </table>
    );
  }

  render() {
    let profileSpace;

    if (this.props.user) {
      profileSpace = (
        <div>
          <h3>Hello {this.props.user?.userName}</h3>
          {this.renderUserAttributes()}
        </div>
      );
    } else {
      profileSpace = (
        <div>
          <Link to="/login">Login</Link>
        </div>
      );
    }

    return <div>{profileSpace}</div>;
  }
}
