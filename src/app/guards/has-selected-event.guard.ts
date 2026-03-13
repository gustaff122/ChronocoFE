import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@chronoco/stores/auth-store/auth.store';
import { inject } from '@angular/core';
import { RoutesEnum } from '@chronoco/models/routes.enum';

export const hasSelectedEvent: CanActivateFn = () => {
  const authStore: AuthStore = inject(AuthStore);
  const router: Router = inject(Router);

  const hasSelectedEvent = authStore.user().selectedEvent.length > 0;

  return hasSelectedEvent || router.parseUrl(RoutesEnum.EVENTS);
};