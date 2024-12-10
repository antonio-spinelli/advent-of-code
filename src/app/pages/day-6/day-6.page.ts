import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const EXAMPLE_DATA = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

const GUARD = '^';
const OBSTACLE = '#';
const PATROL_PATH = 'X';

const mapPathInRoom = (roomMap: string[][]): string[][] => {
  const mappedRoom = roomMap.slice()
  const startX = roomMap.findIndex(row => row.includes(GUARD));
  const startY = roomMap[startX].indexOf(GUARD);
  drawPathInRoom(mappedRoom, [startX, startY]);
  return mappedRoom;
}

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

@Component({
  selector: 'app-day-6',
  template: `
    <h2>Day 6</h2>
    <textarea name="input" [(ngModel)]="dataInput" rows="25" cols="50"></textarea>
    <p>Total: {{ total() }}</p>
  `,
  imports: [FormsModule]
})
export default class Day6Page {
  readonly dataInput = signal<string>(EXAMPLE_DATA);
  private readonly roomMap = computed(() => this.dataInput().split('\n').map(row => row.split('')));
  private readonly mappedRoom = computed(() => mapPathInRoom(this.roomMap()));
  readonly total = computed(() => this.mappedRoom().reduce((acc, row) => acc + row.filter(cell => cell === PATROL_PATH).length, 0));
}
