import React from "react";
import axios from "axios";

import { v4 as uuidv4 } from "uuid";

import "./App.css";

import { DragDropContext, Droppable } from "react-beautiful-dnd";
import CardDisplay from "./card-display/CardDisplay";

const API_URL = process.env.API_URL
  ? process.env.API_URL
  : "http://127.0.0.1:3000";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.displayRefresh = false;
    this.state.columnList = [];
  }

  async componentDidMount() {
    try {
      const cardList = await this.getCards();
      this.setState({ columnList: cardList });
    } catch (exception) {
      console.log("exception", exception);
    }
  }

  render() {
    return (
      <div className="App">
        <div className="row">
          <DragDropContext onDragEnd={this.updateCards.bind(this)}>
            {this.state.columnList.map((el) => (
              <Droppable key={"" + el.id} droppableId={"" + el.id}>
                {(provided) => (
                  <div ref={provided.innerRef} className="card-column">
                    <CardDisplay
                      {...provided.droppableProps}
                      {...provided.placeholder}
                      className="characters"
                      title={el.title}
                      cardList={el.cardList}
                      addCard={this.addCardToTable.bind(this)}
                      table={el}
                      deleteCard={this.deleteCard.bind(this)}
                      refresh={!this.state.displayRefresh}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </DragDropContext>
        </div>
      </div>
    );
  }

  getCards = async () => {
    const cardList = (await axios.get(API_URL + "/cards")).data;
    let toReturn = [
      {
        id: uuidv4(),
        title: "TODO",
        cardList: [],
      },
      {
        id: uuidv4(),
        title: "DOING",
        cardList: [],
      },
      {
        id: uuidv4(),
        title: "DONE",
        cardList: [],
      },
    ];

    cardList.forEach((el) => {
      let tableObj = toReturn.filter((filter) => filter.title == el.tablename);

      if (tableObj && tableObj.length > 0) {
        tableObj[0].cardList.push(el);
      } else {
        tableObj = {};
        tableObj.id = uuidv4();
        tableObj.title = el.tablename;
        tableObj.cardList = [];
        tableObj.cardList.push(el);
        toReturn.push(tableObj);
      }
    });

    return toReturn;
  };

  addCardToTable = async (card, table, order) => {
    card.tablename = table.title;

    for (let column of this.state.columnList) {
      if (column.id === table.id) {
        column.cardList.splice(order, 0, card);
        this.setState({ displayRefresh: !this.state.displayRefresh });
        break;
      }
    }

    let res = await axios.post(API_URL + "/cards", card);
    card.id = res.id;
  };

  updateCards = async (result) => {
    const card = this.findCardById(result.draggableId);

    if (
      card &&
      result &&
      result.destination &&
      result.destination.droppableId
    ) {
      this.removeCardFromCardList(card.id);
      this.setState({ displayRefresh: !this.state.displayRefresh });
      await this.putCard(card, result.destination.droppableId);
    }
  };

  deleteCard = async (cardId) => {
    this.removeCardFromCardList(cardId);
    this.setState({ displayRefresh: !this.state.displayRefresh });
    await axios.delete(API_URL + "/cards/" + cardId);
  };

  putCard = async (card, destinationTableId) => {
    for (let column of this.state.columnList) {
      if (column.id === destinationTableId) {
        card.tablename = column.title;
        column.cardList.push(card);
        this.setState({ displayRefresh: !this.state.displayRefresh });
        await axios.put(API_URL + "/cards/" + card.id, card);
        return;
      }
    }
  };

  removeCardFromCardList(cardId) {
    this.state.columnList.forEach((el) => {
      el.cardList.forEach((cards, index) => {
        if (cards.id === cardId) {
          el.cardList.splice(index, 1);
          return;
        }
      });
    });
  }

  findCardById(cardId) {
    for (let column of this.state.columnList) {
      for (let card of column.cardList) {
        if ("" + card.id === "" + cardId) {
          return card;
        }
      }
    }

    return;
  }
}

export default App;
