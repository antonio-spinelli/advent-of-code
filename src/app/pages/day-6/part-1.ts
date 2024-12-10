const GUARD = '^';
const OBSTACLE = '#';
export const PATROL_PATH = 'X';

const drawPathInRoom = (roomMap: string[][], [x, y]: number[]): void => {
  const directions = [
    [-1, 0], // up
    [0, 1],  // right
    [1, 0],  // down
    [0, -1]  // left
  ];
  let currentDirection = 0;

  while (true) {
    const [dx, dy] = directions[currentDirection];
    const newX = x + dx;
    const newY = y + dy;

    if (
      newX < 0 || newX >= roomMap.length ||
      newY < 0 || newY >= roomMap[0].length
    ) {
      roomMap[x][y] = PATROL_PATH;
      break;
    }

    if (
      roomMap[newX][newY] === OBSTACLE
    ) {
      currentDirection = (currentDirection + 1) % 4;
    } else {
      roomMap[x][y] = PATROL_PATH;
      x = newX;
      y = newY;
    }
  }
}

export const mapPathInRoom = (roomMap: string[][]): string[][] => {
  const mappedRoom = roomMap.slice().map(row => row.slice());
  const startX = roomMap.findIndex(row => row.includes(GUARD));
  const startY = roomMap[startX].indexOf(GUARD);
  drawPathInRoom(mappedRoom, [startX, startY]);
  return mappedRoom;
}
