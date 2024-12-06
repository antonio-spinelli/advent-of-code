import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const EXAMPLE_DATA = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

const getOperations = (data: string): string[] => {
  const regex = /mul\(\d+,\d+\)/g;
  return data.match(regex) || [];
}

const getOperationsWithConditionalStatements = (data: string): string[] => {
  const regex = /(mul\(\d+,\d+\))|(don\'t\(\))|(do\(\))/g;
  const matches = data.match(regex) || [];
  const operations: string[] = []
  let allowed = true;
  for (const match of matches) {
    if (match === "don't()") {
      allowed = false;
    } else if (match === "do()") {
      allowed = true;
    } else if (allowed) {
      operations.push(match);
    }
  }
  return operations
}

const calculateOperation = (operation: string): number => {
  const [a, b] = operation.match(/\d+/g)!.map(Number);
  return a * b;
}

const getTotalOperations = (operations: string[]): number => {
  return operations.reduce((acc, op) => acc + calculateOperation(op), 0);
}

@Component({
  selector: 'app-day-3',
  template: `
    <h2>Day 3</h2>
    <textarea name="input" [(ngModel)]="dataInput" rows="25" cols="50"></textarea>
    <p>Total: {{ total() }}</p>
    <p>Total with Conditional Statements: {{ totalConditionalStatements() }}</p>
  `,
  imports: [FormsModule]
})
export default class Day3Page {
  readonly dataInput = signal<string>(EXAMPLE_DATA);
  private readonly operations = computed(() => getOperations(this.dataInput()));
  readonly total = computed(() => getTotalOperations(this.operations()));
  private readonly operationsWithConditionalStatements = computed(() => getOperationsWithConditionalStatements(this.dataInput()));
  readonly totalConditionalStatements = computed(() => getTotalOperations(this.operationsWithConditionalStatements()));
}
