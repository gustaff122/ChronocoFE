import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth.service';
import { IUser } from '../../services/auth-service/models/i-user';
import { catchError, finalize, lastValueFrom, of, skip, Subscription, switchMap, tap, timer } from 'rxjs';
import { RoutesEnum } from '@chronoco/models/routes.enum';
import { Router } from '@angular/router';

interface IAuthState {
  user: IUser;
  loading: boolean;
}

const DEFAULT_STATE: IAuthState = {
  user: null,
  loading: false,
};

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);

  private readonly state: WritableSignal<IAuthState> = signal(DEFAULT_STATE);

  public readonly user: Signal<IUser> = computed(() => this.state()?.user);
  public readonly isLoggedIn: Signal<boolean> = computed(() => this.state()?.user !== null);

  private refresh: Subscription;

  public init(): Promise<IUser> {
    return this.getUserInfo();
  }

  public login(login: string, password: string): void {
    this.state.update(state => ({ ...state, loading: true }));
    this.authService.login(login, password)
      .pipe(
        finalize(() => this.state.update(state => ({ ...state, loading: false }))),
      )
      .subscribe((user) => {
        const { HOME } = RoutesEnum;
        this.state.update(state => ({ ...state, user }));

        this.startAutoRefresh();
        this.router.navigate([ HOME ]);
      });
  }

  public logout(): void {
    this.authService.logout().subscribe(() => {
      const { AUTH } = RoutesEnum;

      this.state.update(state => ({ ...state, user: null }));
      this.router.navigate([ AUTH ]);
      this.stopAutoRefresh();
    });
  }

  private getUserInfo(): Promise<IUser> {
    return lastValueFrom(
      this.authService.getSelf()
        .pipe(
          tap(user => {
            this.state.update(state => ({ ...state, user }));

            if (!this.refresh) {
              this.startAutoRefresh();
            }
          }),
          catchError(() => of(null)),
        ),
    );
  }

  public changeSelectedEvent(selectedEvent: string): void {
    this.state.update(state => ({ ...state, user: { ...state.user, selectedEvent } }));
  }

  private startAutoRefresh(): void {
    this.stopAutoRefresh();

    this.refresh = timer(0, 28 * 60 * 1000).pipe(
      skip(1),
      switchMap(() =>
        this.authService.refresh()
      )
    ).subscribe();
  }

  private stopAutoRefresh(): void {
    if (this.refresh) {
      this.refresh.unsubscribe();
      this.refresh = undefined;
    }
  }
}