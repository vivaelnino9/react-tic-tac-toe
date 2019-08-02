export function getSpot(row, col) {
  if (row === 0 && col === 0) {
    return 'Top-Left';
  }
  else if (row === 0 && col === 1) {
    return 'Top-Middle';
  }
  else if (row === 0 && col === 2) {
    return 'Top-Right';
  }
  else if (row === 1 && col === 0) {
    return 'Middle-Left';
  }
  else if (row === 1 && col === 1) {
    return 'Center';
  }
  else if (row === 1 && col === 2) {
    return 'Middle-Right';
  }
  else if (row === 2 && col === 0) {
    return 'Bottom-Left';
  }
  else if (row === 2 && col === 1) {
    return 'Bottom-Middle';
  }
  else{
    return 'Bottom-Right';
  }
}

export function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {side: squares[a], winningSquares: lines[i]};
    }
  }
  return null;
}

export function checkGameOver(squares){
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]){
      return false;
    }
  }
  return true;
}
