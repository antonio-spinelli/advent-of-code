import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <h1>{{ title }}</h1>
    <nav>
      <ul>
        <li><a routerLink="/day-1">Day 1</a></li>
        <li><a routerLink="/day-2">Day 2</a></li>
        <li><a routerLink="/day-3">Day 3</a></li>
      </ul>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      ul {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
        list-style-type: circle;
      }
    `
  ]
})
export class AppComponent {
  title = 'Advent of Code';
}
