import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'day-1',
    loadComponent: () => import('./pages/day-1/day-1.page'),
  },
  {
    path: 'day-2',
    loadComponent: () => import('./pages/day-2/day-2.page'),
  },
  {
    path: 'day-3',
    loadComponent: () => import('./pages/day-3/day-3.page'),
  },
  {
    path: 'day-4',
    loadComponent: () => import('./pages/day-4/day-4.page'),
  },
  {
    path: 'day-5',
    loadComponent: () => import('./pages/day-5/day-5.page'),
  },
  {
    path: 'day-6',
    loadComponent: () => import('./pages/day-6/day-6.page'),
  },
  { path: '**', redirectTo: 'day-1', pathMatch: 'full' },
];
