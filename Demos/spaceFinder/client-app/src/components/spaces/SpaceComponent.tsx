import { Component } from "react";
import "./SpaceComponent.css";
var defaultImage = require("../../assets/default-image.jpg");

interface SpaceComponentProps {
  spaceId: string;
  name: string;
  location: string;
  imageUrl?: string;
  reserveSpace: (spaceId: string) => void;
}

export default class SpaceComponent extends Component<SpaceComponentProps> {
  private renderImage() {
    if (this.props.imageUrl) {
      return <img src={this.props.imageUrl} alt={this.props.name} />;
    } else {
      return <img src={defaultImage} alt="Default Image" />;
    }
  }

  render() {
    return (
      <div className="spaceComponent">
        {this.renderImage()}
        <label className="name">{this.props.name}</label>
        <label className="spaceId">{this.props.spaceId}</label>
        <label className="location">{this.props.location}</label>
        <button onClick={() => this.props.reserveSpace(this.props.spaceId)}>
          Reserve
        </button>
      </div>
    );
  }
}
