import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'day-1',
    loadComponent: () => import('./pages/day-1/day-1.page'),
  }, {
    path: 'day-2',
    loadComponent: () => import('./pages/day-2/day-2.page'),
  },
  { path: '**', redirectTo: 'day-1', pathMatch: 'full' },
];
