import { RenderMode, ServerRoute } from '@angular/ssr';
import { RoutesEnum } from '@chronoco/models/routes.enum';

export const serverRoutes: ServerRoute[] = [
  {
    path: RoutesEnum.AUTH,
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
