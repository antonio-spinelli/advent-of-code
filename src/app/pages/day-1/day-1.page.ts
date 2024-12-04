import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const EXAMPLE_DATA = `3   4
4   3
2   5
1   3
3   9
3   3`

@Component({
  selector: 'app-day-1',
  template: `
    <h2>Day 1</h2>
    <textarea name="input" [(ngModel)]="dataInput" rows="25" cols="50"></textarea>
    <p>Total Distance: {{ totalDistance() }}</p>
    <p>Similarity Score: {{ similarityScore() }}</p>
  `,
  imports: [FormsModule]
})
export default class Day1Page {
  readonly dataInput = signal<string>(EXAMPLE_DATA);
  private readonly data = computed(() => {
    const list1: number[] = [];
    const list2: number[] = [];
    const lines = this.dataInput().split('\n');
    lines.forEach((line) => {
      const values = line.split('   ');
      list1.push(parseInt(values[0] || '0', 10));
      list2.push(parseInt(values[1] || '0', 10));
    });
    return { list1, list2 };
  });
  private readonly list1 = computed(() => this.data().list1.sort((a, b) => a - b));
  private readonly list2 = computed(() => this.data().list2.sort((a, b) => a - b));
  readonly totalDistance = computed(() => {
    const list1 = this.list1();
    const list2 = this.list2();
    const distances: number[] = [];
    for (let i = 0; i < list1.length; i++) {
      distances.push(Math.abs(list1[i] - list2[i]));
    }
    return distances.reduce((acc, distance) => acc + distance, 0);
  });
  readonly similarityScore = computed(() => {
    const list1 = this.list1();
    const list2 = this.list2();
    let score = 0;
    list1.forEach((value) => {
      const count = list2.filter((v) => v === value).length
      score += value * count;
    });
    return score;
  });
}
