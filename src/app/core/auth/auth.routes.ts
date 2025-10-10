import { Route } from '@angular/router';
import { RoutesEnum } from '../../models/routes.enum';

const { AUTH, AUTH_LOGIN } = RoutesEnum;

export default [
  {
    path: '',
    loadComponent: () => import('@chronoco/core/auth/auth-routing.component').then(c => c.AuthRoutingComponent),
    children: [
      {
        path: '',
        redirectTo: `/${AUTH}/${AUTH_LOGIN}`,
        pathMatch: 'full',
      },
      {
        path: AUTH_LOGIN,
        loadComponent: () => import('@chronoco/core/auth/views/login-view/login-view.component').then(c => c.LoginViewComponent),
      },
    ],
  },
] satisfies Route[];