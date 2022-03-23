import React from 'react';

import './CardDisplay.css';

import AddCard from './add-card/AddCard';
import { Draggable } from 'react-beautiful-dnd';
import deletesvg from "../../../common/delete.svg";

class CardDisplay extends React.Component {
    constructor(props) {
        super();
        this.state = {};
        this.state.addCard = props.addCard;
        this.state.table = props.table;
        this.state.deleteCard = props.deleteCard;
    }

    render() {
        const cardList = this.props.cardList;

        return (
            <div className="card-container">
                <div className="card-header">
                    <span className="card-header">{this.props.title}</span>
                </div>
                {cardList.map((el, index) => {
                    return (
                        <Draggable key={el.id} draggableId={'' + el.id} index={index} >
                            {(provided) => (
                                <div ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="card-body">
                                    <div className="card-thumbnail">
                                        <span>{el.title} </span>
                                        <div >
                                            <img style={{ "cursor": "default" }} src={deletesvg} onClick={(event) => this.deleteCard(event, el.id)}/>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Draggable>
                    )
                })
                }
                <AddCard table={this.state.table} addCard={this.state.addCard.bind(this)}></AddCard>
            </div>
        );
    }

    deleteCard(event, cardId) {
        this.state.deleteCard(cardId);
    }
}

export default CardDisplay;