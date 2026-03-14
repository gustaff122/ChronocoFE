import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('@chronoco/core/select-event/select-event-routing.component').then(c => c.SelectEventRoutingComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('@chronoco/core/select-event/views/select-event-view/select-event-view.component').then(c => c.SelectEventViewComponent),
      },
    ],
  },
] satisfies Route[];