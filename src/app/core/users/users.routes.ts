import { Route } from '@angular/router';
import { RoutesEnum } from '@chronoco/models/routes.enum';

export default [
  {
    path: '',
    loadComponent: () => import('@chronoco/core/users/users-routing.component').then(c => c.UsersRoutingComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('@chronoco/core/users/views/users-list-view/users-list-view.component').then(c => c.UsersListViewComponent),
      },
      {
        path: RoutesEnum.USERS_ADD,
        loadComponent: () => import('@chronoco/core/users/views/users-add-user-view/users-add-user-view.component').then(c => c.UsersAddUserViewComponent),
      },
    ],
  },
] satisfies Route[];