import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getTotalObstructions } from './part-2';
import { mapPathInRoom, PATROL_PATH } from './part-1';

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

@Component({
  selector: 'app-day-6',
  template: `
    <h2>Day 6</h2>
    <textarea name="input" [(ngModel)]="dataInput" rows="25" cols="50"></textarea>
    <p>Total: {{ total() }}</p>
    <p>Total Obstruction Positions: {{ totalObstructionPositions() }}</p>
  `,
  imports: [FormsModule]
})
export default class Day6Page {
  readonly dataInput = signal<string>(EXAMPLE_DATA);
  private readonly roomMap = computed(() => this.dataInput().split('\n').map(row => row.split('')));
  private readonly mappedRoom = computed(() => mapPathInRoom(this.roomMap()));
  readonly total = computed(() => this.mappedRoom().reduce((acc, row) => acc + row.filter(cell => cell === PATROL_PATH).length, 0));
  readonly totalObstructionPositions = computed(() => getTotalObstructions(this.roomMap()));
}
