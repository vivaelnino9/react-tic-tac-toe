import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as utils from './utilities.js'


function Square(props) {
  let squareID, display;
  if (props.value) {
      squareID = props.value === 'X' ? "x-square" : "o-square"
      display = <span>{props.value}</span>
  }
  else {
    display = <span
      className="squareDisplay"
      id={props.xIsNext ? 'display-x-square': 'display-o-square'}
    >
      {props.xIsNext ? 'X': 'O'}
    </span>
  }

  return (
    <button
      className={props.winningSquare ? "square winningSquare" : "square"}
      id={squareID}
      onClick={props.onClick}
    >
      {display}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return(
      <Square
        key={i}
        value={this.props.squares[i]}
        winningSquare={this.props.winningSquares.includes(i)}
        onClick={() => this.props.onClick(i)}
        xIsNext={this.props.xIsNext}
      />
    );
  }

  createSquares() {
    let rows = [];
    for(var i = 0; i < 3; i++){
      let squares = [];
      for(var j = 0; j < 3; j++){
        squares.push(this.renderSquare(3*i+j));
      }
      rows.push(<div key={i} className="board-row">{squares}</div>);
    }
    return rows;
  }

  render() {
    return (
      this.createSquares()
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        move: null,
        stepNumber: 0,
      }],
      stepNumber: 0,
      xIsNext: true,
      width: window.innerWidth,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (utils.calculateWinner(squares) || squares[i]) {
      return;
    }

    const row = Math.floor(i/3);
    const col = i - (row*3)

    const stepNumber = history.length
    const playerTurn = this.state.xIsNext ? 'X' : 'O';

    squares[i] = playerTurn
    this.setState({
      history: history.concat([{
        squares: squares,
        move: {row: row, col: col, player: playerTurn},
        stepNumber: stepNumber,
      }]),
      stepNumber: stepNumber,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const { width } = this.state;
    const isMobile = width <= 500;

    // List of moves already made in game
    const history = this.state.history;
    // Current move based off which step the state is in
    // this is how you are able to change to different moves in history
    const current = history[this.state.stepNumber];

    // Next player based of Game state
    const playerTurn = this.state.xIsNext ? 'X' : 'O'
    // Check for winner, obviously
    const winner = utils.calculateWinner(current.squares)
    // If winner, list of squares that won (for highlighting)
    const winningSquares = winner ? winner.winningSquares : [];
    // All squares filled
    const gameOver = utils.checkGameOver(current.squares);


    // Logic for creating moves history
    const moves = history.map((step, move) => {
      let desc, moveID;
      if (move){
        const row = step.move.row;
        const col = step.move.col;
        const spot = utils.getSpot(row, col);
        const player = step.move.player;
        desc = `Move# ${move} (${spot})`
        moveID = player === "X" ? "x-move" : "o-move"
      }
      else
        desc = 'Game start';


      const currentStep = this.state.stepNumber === step.stepNumber;
      const buttonClass = 'moveButton';

      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={currentStep ? buttonClass + ' current' :  buttonClass}
            id={moveID}
          >
          {desc}
          </button>
        </li>
      );
    });

    function getStatus(){
      let playerID = playerTurn === "X" ? "x-square" : "o-square"
      // playerID at this point is the player whose turn is next
      if (winner || gameOver){
        // Winner or Draw
        if (winner){
          playerID = winner.side === "X" ? "x-square" : "o-square"
          // playerID now changes to winning side
          return (
            <span>
              <span className="small-square" id={playerID}>
                {winner.side}</span> Wins!
            </span>
          );
        }
        else {
          // Draw
          return (<span>Draw</span>);
        }
      }

      else {
        // Next turn
        return (
          <span>
            <span className="small-square" id={playerID}>
            {playerTurn}</span> 's Turn!
          </span>
        );
      }
    }

    const status = getStatus();


    if (isMobile){
      return (
        <div>
          <h1>Hello!</h1>
          <h3>Seems like you are viewing this on mobile,
          unfortunately I got lazy and did not make it mobile responsive!</h3>
          <h5>Just do what you just did, but on a desktop!</h5>
          <h6>Sorry!</h6>
        </div>
      );
    }
    else{
      return (
        <div className="row">
          <div className="game">
            <div className="game-header">
              <h1>Tic-tac-toe</h1>
            </div>
            <div className="game-board">
              <Board
                squares={current.squares}
                winningSquares={winningSquares}
                onClick={(i) => this.handleClick(i)}
                xIsNext={this.state.xIsNext}
              />
            </div>
          </div>
          <div className="info">
            <div className="statusHeader">{status}</div>
            <ul className="history" start="0">{moves}</ul>
          </div>
          <footer className="signature">
            created by Lucas McBride -- based off
            <a className="tutorial-link"
              target="_blank"
              href="https://reactjs.org/tutorial/tutorial.html">
              React</a>
            tutorial
          </footer>
        </div>
      );
    }
  }
}



// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
