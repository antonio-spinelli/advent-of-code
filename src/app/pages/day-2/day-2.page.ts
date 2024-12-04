import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const EXAMPLE_DATA = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

const isSafeDifference = (mode: 'increase' | 'decrease', currentValue: number, nextValue: number): boolean => {
  if (currentValue === nextValue) return false;
  if (mode === 'increase' && currentValue > nextValue) return false;
  let difference = currentValue - nextValue;
  if (difference < 0) {
    if (mode === 'decrease') return false;
    difference *= -1;
  }
  return difference < 4;
}

const checkReport = (report: number[], problemDampener = false): boolean => {
  let success = true;
  const mode = report[0] > report[1] ? 'decrease' : 'increase';
  for (let i = 0; i < report.length; i++) {
    if (i === report.length - 1) break;
    const currentValue = report[i];
    const nextValue = report[i + 1];
    const isSafe = isSafeDifference(mode, currentValue, nextValue);
    if (!isSafe) {
      console.log('unsafe', mode, currentValue, nextValue);
      success = false;
      break;
    }
  }
  if (!success && problemDampener) {
    console.log('problemDampener', report);
    for (let i = 0; i < report.length; i++) {
      const filteredReport = report.filter((_, index) => index !== i);
      console.log('try problemDampener', filteredReport);
      const isSafe = checkReport(filteredReport);
      if (isSafe) {
        success = true;
        break;
      }
    }
  }
  return success
}

@Component({
  selector: 'app-day-2',
  template: `
    <h2>Day 2</h2>
    <textarea name="input" [(ngModel)]="dataInput" rows="25" cols="50"></textarea>
    <div>
      <label for="part2">Enable Problem Dampener (Part 2)</label>
      <input name="part2" type="checkbox" [(ngModel)]="isPart2">
    </div>
    <p>Total Reports: {{ totalReports() }}</p>
    <p>Total Safe Reports: {{ totalSafeReports() }}</p>
  `,
  imports: [FormsModule]
})
export default class Day2Page {
  readonly dataInput = signal<string>(EXAMPLE_DATA);
  readonly isPart2 = signal<boolean>(false);
  private readonly reports = computed(() => this.dataInput().split('\n').map(line => line.split(' ').map(Number)).filter(line => line.length > 1));
  private readonly reportResults = computed(() => this.reports().map(report => checkReport(report, this.isPart2())));
  readonly totalReports = computed(() => this.reports().length);
  readonly totalSafeReports = computed(() => this.reportResults().filter(result => !!result).length);
}
