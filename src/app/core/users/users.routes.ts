import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('@chronoco/core/users/users-routing.component').then(c => c.UsersRoutingComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('@chronoco/core/users/views/users-list-view/users-list-view.component').then(c => c.UsersListViewComponent),
      },
    ],
  },
] satisfies Route[];