import { Component } from "react";
import defaultImage from "../../assets/default-image.jpg";

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
      <div>
        {this.renderImage()}
        <label>{this.props.spaceId}</label>
        <label>{this.props.name}</label>
        <label>{this.props.location}</label>
        <button onClick={() => this.props.reserveSpace(this.props.spaceId)}>
          Reserve
        </button>
      </div>
    );
  }
}
