import { Component } from "react";
import { Space, User } from "../../model/Model";
import { DataService } from "../../services/DataService";
import SpaceComponent from "./SpaceComponent";
import ConfirmModalComponent from "./ConfirmModalComponent";
import { Link } from "react-router-dom";

interface SpacesProps {
  dataService: DataService;
  user: User | undefined;

}

interface SpacesState {
  spaces: Space[];
  showModal: boolean;
  modalContent: string;
}

export default class Spaces extends Component<SpacesProps, SpacesState> {
  constructor(props: SpacesProps) {
    super(props);
    this.state = {
      spaces: [],
      showModal: false,
      modalContent: "",
    };

    this.reserveSpace = this.reserveSpace.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  async componentDidMount() {
    const spaces = await this.props.dataService.getSpaces();
    this.setState({ spaces });
  }

  private async reserveSpace(spaceId: string) {
    const reservationResult = await this.props.dataService.reserveSpace(
      spaceId
    );
    if (reservationResult) {
      this.setState({
        showModal: true,
        modalContent: `Your reservation has been confirmed with reservation Id: ${reservationResult}`,
      });
    } else {
      this.setState({
        showModal: true,
        modalContent: "Sorry this space cannot be reserved.",
      });
    }
  }

  private renderSpaces() {
    const rows: any[] = [];
    for (const space of this.state.spaces) {
      rows.push(
        <SpaceComponent
          key={space.spaceId}
          spaceId={space.spaceId}
          location={space.location}
          photoURL={space.photoURL}
          name={space.name}
          reserveSpace={this.reserveSpace}
        />
      );
    }

    return rows;
  }

  private closeModal() {
    this.setState({ showModal: false, modalContent: "" });
  }

  render() {
    let loggedIn = this.props.user !== undefined;

    return (
      <div>
        <h2>Welcome to the page </h2>
        {loggedIn && (
          <Link to="/create-space">Create Space</Link>
        )}
        {!loggedIn && (
          <Link to="/login">
            Login to create new spaces
          </Link>
        )}
   
        <br />
        {this.renderSpaces()}
        <ConfirmModalComponent
          show={this.state.showModal}
          closeModal={this.closeModal}
          content={this.state.modalContent}
        />
      </div>
    );
  }
}
