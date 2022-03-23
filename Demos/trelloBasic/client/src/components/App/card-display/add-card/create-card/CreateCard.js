import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import './CreateCard.css';

class CreateCard extends React.Component {
    constructor(props){
        super();
        this.state = {};
        this.state.addCard=props.addCard;
        this.state.table= props.table;
        this.state.inputValue = '';
        this.closeNewCard = props.onClose;
    }

    render() {
        return (
            <div>
                <input className="input-button" value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)}  type="text" id="title" name="title" placeholder="Enter a title for this card" />
                <div>
                    <button className="add-card-success" onClick={this.createCard.bind(this)}>Add Card </button>
                    <span className="close-add-card-button" onClick={this.closeNewCard}> X </span>
                </div>
            </div>
        )
    }

    createCard () {
        this.state.addCard({id: uuidv4(), 
                            title: this.state.inputValue}, this.state.table, 2);

        this.setState({inputValue: ''});
    }

    updateInputValue(evt) {
        this.setState({inputValue: evt.target.value});
    }
}

export default CreateCard;
