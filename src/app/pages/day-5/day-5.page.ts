import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const EXAMPLE_DATA = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

const checkValidUpdates = (update: number[][], orderRules: number[][]): { data: number[], isValid: boolean }[] => {
  return update.map(data => {
    return {
      data,
      isValid: isValidUpdate(data, orderRules)
    }
  });
}

const isValidUpdate = (update: number[], orderRules: number[][]): boolean => {
  let isValid = true
  for (let i = 0; i < update.length; i++) {
    if (i + 1 === update.length) break;
    const pageNumber = update[i];
    const previousRules = orderRules.filter(rule => rule[1] === pageNumber).map(rule => rule[0]);
    const nextRules = orderRules.filter(rule => rule[0] === pageNumber).map(rule => rule[1]);
    const previousPageNumbers = update.slice(0, i);
    const nextPageNumbers = update.slice(i + 1);
    const isPreviousValid = !nextPageNumbers.some(pageNumber => previousRules.includes(pageNumber));
    const isNextValid = !previousPageNumbers.some(pageNumber => nextRules.includes(pageNumber));
    if (!isPreviousValid || !isNextValid) {
      isValid = false;
      break;
    }
  }
  return isValid
}

const getMiddlePageNumber = (update: number[]): number => {
  const middleIndex = Math.floor(update.length / 2);
  return update[middleIndex];
}

const fixUpdate = (update: number[], orderRules: number[][]): number[] => {
  const updateOrderRules = orderRules.filter(rule => update.includes(rule[1]) && update.includes(rule[0]));
  const sortedUpdate = update.slice().sort((a, b) => {
    return updateOrderRules.some(rule => rule[0] === a && rule[1] === b) ? -1 : 1;
  });
  return sortedUpdate;
}

@Component({
  selector: 'app-day-5',
  template: `
    <h2>Day 5</h2>
    <textarea name="input" [(ngModel)]="dataInput" rows="25" cols="50"></textarea>
    <p>Total: {{ total() }}</p>
    <p>Total fixed: {{ totalFixed() }}</p>
  `,
  imports: [FormsModule]
})
export default class Day5Page {
  readonly dataInput = signal<string>(EXAMPLE_DATA);
  private readonly inputs = computed(() => this.dataInput().split('\n\n'));
  private readonly orderRules = computed(() => this.inputs()[0].split('\n').map(order => order.split('|').map(val => parseInt(val.trim()))));
  private readonly updates = computed(() => this.inputs()[1].split('\n').map(update => update.split(',').map(val => parseInt(val.trim()))));
  private readonly validatedUpdates = computed(() => checkValidUpdates(this.updates(), this.orderRules()));
  private readonly validUpdates = computed(() => this.validatedUpdates().filter(val => val.isValid));
  private readonly validMiddlePageNumbers = computed(() => this.validUpdates().map(val => getMiddlePageNumber(val.data)));
  private readonly invalidUpdates = computed(() => this.validatedUpdates().filter(val => !val.isValid));
  private readonly fixedUpdates = computed(() => this.invalidUpdates().map(update => fixUpdate(update.data, this.orderRules())));
  private readonly fixedMiddlePageNumbers = computed(() => this.fixedUpdates().map(val => getMiddlePageNumber(val)));
  readonly total = computed(() => this.validMiddlePageNumbers().reduce((acc, val) => acc + val, 0));
  readonly totalFixed = computed(() => this.fixedMiddlePageNumbers().reduce((acc, val) => acc + val, 0));
}
