import { Route } from '@angular/router';
import { isLoggedOut } from './guards/is-logged-out.guard';
import { isLoggedIn } from './guards/is-logged-in.guard';
import { RoutesEnum } from '@chronoco/models/routes.enum';

export const routes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('@chronoco/shell/shell-logged-in/shell-logged-in.component').then(c => c.ShellLoggedInComponent),
        canActivate: [ isLoggedIn ],
        children: [
          {
            path: RoutesEnum.HOME,
            loadChildren: () => import('@chronoco/core/home/home.routes'),
          },
          {
            path: RoutesEnum.EVENTS,
            loadChildren: () => import('@chronoco/core/events/events.routes'),
          },
          {
            path: RoutesEnum.PLANNER,
            loadChildren: () => import('@chronoco/core/planner/planner.routes'),
          },
          {
            path: RoutesEnum.USERS,
            loadChildren: () => import('@chronoco/core/users/users.routes'),
          },
        ],
      },
      {
        path: RoutesEnum.AUTH,
        loadChildren: () => import('@chronoco/core/auth/auth.routes'),
        canActivate: [ isLoggedOut ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
