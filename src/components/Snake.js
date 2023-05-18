import React, { useState, useEffect, useRef } from 'react';
import Keycode from 'keycode';

const Cell = ({ fill }) => {
  let cellClass = '';
  if (fill === '0') {
    cellClass = 'Cell';
  } else {
    cellClass = 'Cell CellFill';
  }
  return <div className={cellClass} />;
};

const initialSnake = [
  { x: 0, y: 0 },
  { x: 0, y: 1 }
];

const initialFoodPosition = { x: 0, y: 5 };

const containsCell = (arr, cellObj) => {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].x === cellObj.x && arr[i].y === cellObj.y) {
      return true;
    }
  }
  return false;
};

const cellsMatch = (cell1, cell2) => {
  return cell1.x === cell2.x && cell1.y === cell2.y;
};

const getRandomFoodPosition = (m, n) => {
  let x = Math.floor(Math.random() * (m - 1));
  let y = Math.floor(Math.random() * (n - 1));
  return {
    x: x,
    y: y
  };
};

const Snake = ({ rows, columns }) => {
  const [arr, setArr] = useState(initialSnake); // first element is tail.. last element is head
  const [direction, _setDirection] = useState('right');
  const directionRef = React.useRef(direction);

  const setDirection = (dir) => {
    directionRef.current = dir
    _setDirection(dir)
  }

  const [foodPosition, setFoodPosition] = useState(initialFoodPosition);
  console.log('dir: ', direction)

  const gameOver = () => {
    const headPosition = arr[arr.length - 1];
    // console.log(headPosition);
    // console.log(direction);

    const x = headPosition.x;
    const y = headPosition.y;
    if (x < 0 || x > rows - 1 || y < 0 || y > columns - 1) {
      return true;
    }
    return false;
  };

  const isGameOver = gameOver();

  const moveSnake = () => {
    const headPosition = arr[arr.length - 1];
    if (!isGameOver) {
      let newHead;
      if (direction === 'right') {
        newHead = { x: headPosition.x, y: headPosition.y + 1 };
      } else if (direction === 'left') {
        newHead = { x: headPosition.x, y: headPosition.y - 1 };
      } else if (direction === 'up') {
        newHead = { x: headPosition.x - 1, y: headPosition.y };
      } else {
        newHead = { x: headPosition.x + 1, y: headPosition.y };
      }
      arr.push(newHead);
      if (cellsMatch(foodPosition, headPosition)) {
        console.log('eating food');
        setFoodPosition(getRandomFoodPosition(rows, columns));
      } else {
        arr.shift();
      }
      setArr([...arr]);
    }
  };

  // cannot use state value directly in event listener handler, instead create a useRef value pointing to the state
  // value thats needed
  let handleKeyEvents = (event) => {
    event.preventDefault()
    if (
      Keycode.isEventKey(event, 'up') &&
      (directionRef.current === 'right' || directionRef.current === 'left')
    ) {
      console.log('switching up')
      setDirection('up');
    } else if (
      Keycode.isEventKey(event, 'down') &&
      (directionRef.current === 'right' || directionRef.current === 'left')
    ) {
      console.log('switching down')
      setDirection('down');
    } else if (
      Keycode.isEventKey(event, 'right') &&
      (directionRef.current === 'up' || directionRef.current === 'down')
    ) {
      console.log('switching right')
      setDirection('right');
    } else if (
      Keycode.isEventKey(event, 'left') &&
      (directionRef.current === 'up' || directionRef.current === 'down')
    ) {
      console.log('switching left')
      setDirection('left');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', (event) => handleKeyEvents(event));
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (!isGameOver) {
        moveSnake();
      }
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [arr]);

  let grid = [];

  for (var i = 0; i < rows; i++) {
    var entryRow = [];
    for (var j = 0; j < columns; j++) {
      if (
        containsCell(arr, { x: i, y: j }) ||
        cellsMatch({ x: i, y: j }, foodPosition)
      ) {
        entryRow.push(<Cell fill='1' />);
      } else {
        entryRow.push(<Cell fill='0' />);
      }
    }
    grid.push(<div className='Row'>{entryRow}</div>);
  }

  const resetGame = () => {
    setDirection('right');
    setFoodPosition(initialFoodPosition);
    setArr(initialSnake);
  };

  if (isGameOver) {
    window.removeEventListener('keydown', handleKeyEvents);
  }

  return (
    <div>{isGameOver ? <button onClick={resetGame}> Reset</button> : grid}</div>
  );
};

export default Snake;
