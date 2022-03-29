import { Component } from "react";
import { Space } from "../../model/Model";
import { DataService } from "../../services/DataService";
import SpaceComponent from "./SpaceComponent";

interface SpacesProps {
  dataService: DataService;
}

interface SpacesState {
  spaces: Space[];
}

export default class Spaces extends Component<SpacesProps, SpacesState> {
  constructor(props: SpacesProps) {
    super(props);
    this.state = {
      spaces: [],
    };

    this.reserveSpace = this.reserveSpace.bind(this);
  }

  async componentDidMount() {
    const spaces = await this.props.dataService.getSpaces();
    this.setState({ spaces });
  }

  private async reserveSpace(spaceId: string) {}

  private renderSpaces() {
    const rows: any[] = [];
    for (const space of this.state.spaces) {
      rows.push(
        <SpaceComponent
          key={space.spaceId}
          spaceId={space.spaceId}
          location={space.location}
          name={space.name}
          reserveSpace={this.reserveSpace}
        />
      );
    }
  }

  render() {
    return (
      <div>
        <h2>Welcome to the page </h2>
        {this.renderSpaces()}
      </div>
    );
  }
}
