import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const EXAMPLE_DATA = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;

const getWords = (rows: string[][]): string[] => {
  const words: string[] = [];
  const numRows = rows.length;
  const numCols = rows[0].length;
  const targetWord = 'XMAS';
  const targetLength = targetWord.length;

  const isValidWord = (word: string): boolean => {
    return word === targetWord || word.split('').reverse().join('') === targetWord
  }

  // Check horizontally and backwards
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col <= numCols - targetLength; col++) {
      const word = rows[row].slice(col, col + targetLength).join('');
      if (isValidWord(word)) {
        words.push(word);
      }
    }
  }

  // Check vertically and backwards
  for (let col = 0; col < numCols; col++) {
    for (let row = 0; row <= numRows - targetLength; row++) {
      let word = '';
      for (let k = 0; k < targetLength; k++) {
        word += rows[row + k][col];
      }
      if (isValidWord(word)) {
        words.push(word);
      }
    }
  }

  // Check diagonally (top-left to bottom-right) and backwards
  for (let row = 0; row <= numRows - targetLength; row++) {
    for (let col = 0; col <= numCols - targetLength; col++) {
      let word = '';
      for (let k = 0; k < targetLength; k++) {
        word += rows[row + k][col + k];
      }
      if (isValidWord(word)) {
        words.push(word);
      }
    }
  }

  // Check diagonally (top-right to bottom-left) and backwards
  for (let row = 0; row <= numRows - targetLength; row++) {
    for (let col = targetLength - 1; col < numCols; col++) {
      let word = '';
      for (let k = 0; k < targetLength; k++) {
        word += rows[row + k][col - k];
      }
      if (isValidWord(word)) {
        words.push(word);
      }
    }
  }
  return words;
}

const getWordsXShape = (rows: string[][]): string[] => {
  const words: string[] = []
  const numRows = rows.length;
  const numCols = rows[0].length;
  const targetWord = 'MAS';
  const targetLength = targetWord.length;

  const isValidWord = (word: string): boolean => {
    return word === targetWord || word.split('').reverse().join('') === targetWord;
  }

  // Check X shape
  for (let row = 0; row <= numRows - targetLength; row++) {
    for (let col = 0; col <= numCols - targetLength; col++) {
      let word1 = '';
      let word2 = '';
      for (let k = 0; k < targetLength; k++) {
        word1 += rows[row + k][col + k];
        word2 += rows[row + k][col + targetLength - 1 - k];
      }
      if (isValidWord(word1) && isValidWord(word2)) {
        words.push(word1);
      }
    }
  }
  return words
}

@Component({
  selector: 'app-day-4',
  template: `
    <h2>Day 4</h2>
    <textarea name="input" [(ngModel)]="dataInput" rows="25" cols="50"></textarea>
    <p>Total: {{ total() }}</p>
    <p>Total X Shape: {{ totalXShape() }}</p>
  `,
  imports: [FormsModule]
})
export default class Day3Page {
  readonly dataInput = signal<string>(EXAMPLE_DATA);
  private readonly rows = computed(() => this.dataInput().split('\n').map(row => row.split('')));
  private readonly words = computed(() => getWords(this.rows()));
  private readonly wordsXShape = computed(() => getWordsXShape(this.rows()));
  readonly total = computed(() => this.words().length);
  readonly totalXShape = computed(() => this.wordsXShape().length);
}
