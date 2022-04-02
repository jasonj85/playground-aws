import { Component } from "react";
import "./ConfirmModalComponent.css";

interface ConfirmModalComponentProps {
  show: boolean;
  content: string;
  closeModal: () => void;
}

export default class ConfirmModalComponent extends Component<ConfirmModalComponentProps> {
  render() {
    if (!this.props.show) {
      return null;
    } else {
      return (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={this.props.closeModal}>
              &times;
            </span>
            <p>{this.props.content}</p>
          </div>
        </div>
      );
    }
  }
}
