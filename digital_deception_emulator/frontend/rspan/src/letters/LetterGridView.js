import React from "react";
import {GridConfirmedEvent} from "../events/LetterEvents";


export default class LetterGridView extends React.Component {
    constructor(props) {
        super(props);

        this.onLetterClicked = this.onLetterClicked.bind(this);
        this.onGridCleared = this.onGridCleared.bind(this);
        this.onGridConfirmed = this.onGridConfirmed.bind(this);
        this.onBlankClicked = this.onBlankClicked.bind(this);

        this.grid = [
            ["F", "H", "J"],
            ["K", "L", "N"],
            ["P", "Q", "R"],
            ["S", "T", "Y"],
        ]

        this.state = {
            selectedLetterOrder: [],
        }
    }

    render() {
        let gridLetters = [];
        let letterOrderDisplay = [];

        for (let i=0; i < this.grid.length; i++) {
            let letterRow = this.grid[i];
            let row = [];

            for (let j=0; j < letterRow.length; j++) {
                let letter = letterRow[j];
                let letterIndex = this.state.selectedLetterOrder.indexOf(letter);
                let letterSelected = letterIndex !== -1;

                row.push(
                  <div id={"letter-grid-cell-" + j}
                      className={"letter-grid-cell"}
                      key={j}>
                      <LetterButton letter={letter}
                                    onClick={() => this.onLetterClicked(letter)}
                                    orderIndex={letterIndex}
                                    selected={letterSelected}/>
                  </div>
                );
            }

            gridLetters.push(
              <div className={"letter-grid-row"} key={i} id={"letter-grid-row-" + i}>
                  {row}
              </div>
            );
        }

        for (let i=0; i < this.state.selectedLetterOrder.length; i++) {
            if (i >= this.state.selectedLetterOrder.length) {
                letterOrderDisplay.push(
                    <div className={"grid-letter-order-slot"} key={i}>
                        ?
                    </div>
                )
            } else {
                let letter = this.state.selectedLetterOrder[i];
                letterOrderDisplay.push(
                    <div className={"grid-letter-order-slot"} key={i}>
                        {letter}
                    </div>
                )
            }

        }

        return (
            <div className={"letter-grid-container fullscreen-centered-container"}>
                <div className={"letter-grid-title"}>Select the letters in the order presented. Use the blank button to fill in forgotten letters.</div>
                <div id={"letter-grid-view"}>
                    {gridLetters}
                </div>
                <div id={"grid-letter-order-display"}>
                    {letterOrderDisplay}
                </div>
                <div id={"grid-button-row"}>
                    <button className={"btn primary"} onClick={this.onGridCleared}>
                        CLEAR
                    </button>
                    <button className={"btn primary"} onClick={this.onBlankClicked}>
                        BLANK
                    </button>
                    <button className={"btn primary"} onClick={this.onGridConfirmed}>
                        SUBMIT
                    </button>
                </div>

            </div>
        );
    }

    onBlankClicked() {
        this.onLetterClicked("?");
    }

    onLetterClicked(letter) {
        let letterOrder = this.state.selectedLetterOrder;
        letterOrder.push(letter);
        console.debug("Letter selected: " + letter);
        console.debug("New Letter Order: " + letterOrder);

        this.setState({
            selectedLetterOrder: letterOrder,
        })
    }

    onGridCleared() {
        this.setState({
            selectedLetterOrder: [],
        });
    }

    onGridConfirmed() {
        this.props.bloc.add(new GridConfirmedEvent(this.state.selectedLetterOrder));
    }
}

function LetterButton(props) {
    let className = "letter-grid-button btn primary";
    let text = props.letter;
    // let text = "[ ]" + props.letter;
    //
    // if (props.selected) {
    //     className = "letter-grid-button btn primary selected";
    //     text = "[" + (props.orderIndex + 1) + "] " + props.letter;
    // }

    return (<button className={className}
                    onClick={props.onClick}>{text}</button> )
}
