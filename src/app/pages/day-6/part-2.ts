type Room = string[][];
type Position = { x: number, y: number };

const START_CELL = "^";
const OBSTACLE_CELL = "#";
const EMPTY_CELL = ".";

enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT,
};

const cloneDeep = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

const getDirection = (direction: Direction) => {
  return {
    [Direction.UP]: { x: -1, y: 0 },
    [Direction.RIGHT]: { x: 0, y: 1 },
    [Direction.DOWN]: { x: 1, y: 0 },
    [Direction.LEFT]: { x: 0, y: -1 },
  }[direction];
};

const findPosition = (matrix: Room): Position => {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      const cell = matrix[i][j];
      if (cell !== START_CELL) {
        continue;
      }

      return { x: i, y: j };
    }
  }
  throw new Error("No position found");
};

const nextDirection = (direction: Direction) => {
  const directionArr = [
    Direction.UP,
    Direction.RIGHT,
    Direction.DOWN,
    Direction.LEFT,
  ];

  const index = directionArr.indexOf(direction);
  return directionArr[(index + 1) % directionArr.length];
};

const step = (matrix: Room, visitedMatrix: boolean[][], currentDirection: Direction) => {
  let { x, y } = findPosition(matrix);
  const currentVelocity = getDirection(currentDirection);

  let nextCell = matrix[x][y];

  while (true) {
    const prevX = x;
    const prevY = y;
    x += currentVelocity.x;
    y += currentVelocity.y;
    nextCell = matrix[x]?.[y];

    if (nextCell === OBSTACLE_CELL) {
      return {
        isOutOfBounds: false,
        currentDirection: nextDirection(currentDirection),
      };
    }
    if (!nextCell) {
      return {
        isOutOfBounds: true,
        currentDirection: nextDirection(currentDirection),
      };
    }
    visitedMatrix[x][y] = true;
    matrix[x][y] = START_CELL;
    matrix[prevX][prevY] = EMPTY_CELL;
  }
};

function getGuardsTrace(_matrix: Room): Position[] {
  const matrix = cloneDeep(_matrix);

  let startCoords = { x: 0, y: 0 };
  const visitedMatrix = matrix.map((line, i) =>
    line.map((cell, j) => {
      const isStart = cell === START_CELL;

      if (isStart) {
        startCoords = { x: i, y: j };
      }
      return isStart;
    }),
  );

  let isOutOfBounds = false;
  let currentDirection = Direction.UP;
  while (!isOutOfBounds) {
    const stepResult = step(matrix, visitedMatrix, currentDirection);
    isOutOfBounds = stepResult.isOutOfBounds;
    currentDirection = stepResult.currentDirection;
  }

  const coordinates = [];
  for (let i = 0; i < visitedMatrix.length; i++) {
    for (let j = 0; j < visitedMatrix[0].length; j++) {
      if (!visitedMatrix[i][j]) continue;
      if (startCoords.x === i && startCoords.y === j) {
        continue;
      }
      coordinates.push({ x: i, y: j });
    }
  }
  return coordinates;
}

const checkLoop = (_matrix: Room, obstacleX: number, obstacleY: number): boolean => {
  const matrix = cloneDeep(_matrix);
  matrix[obstacleX][obstacleY] = OBSTACLE_CELL;

  const visitedMatrix = matrix.map((line) =>
    line.map((cell) => cell === START_CELL),
  );

  const startPosition = findPosition(matrix);

  let currentDirection = Direction.UP;

  const sequence: (Position & { direction: Direction })[] = [
    { x: startPosition.x, y: startPosition.y, direction: currentDirection },
  ];

  while (true) {
    const stepResult = step(matrix, visitedMatrix, currentDirection);
    if (stepResult.isOutOfBounds) {
      return false;
    }
    currentDirection = stepResult.currentDirection;
    const { x, y } = findPosition(matrix);
    const currentSequence = { x, y, direction: currentDirection };

    if (
      sequence.some(
        (seq) =>
          seq.x === currentSequence.x &&
          seq.y === currentSequence.y &&
          seq.direction === currentSequence.direction,
      )
    ) {
      return true;
    }
    sequence.push(currentSequence);
  }
};

export const getTotalObstructions = (matrix: Room): number => {
  const coordinates = getGuardsTrace(matrix);

  let sum = 0;
  for (const { x, y } of coordinates) {
    const haveLoop = checkLoop(matrix, x, y);
    if (haveLoop) {
      sum++;
    }
  }
  return sum;
};
