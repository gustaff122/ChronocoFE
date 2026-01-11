import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { RoutesEnum } from '@chronoco/models/routes.enum';
import { UsersService } from '@chronoco/services/users-service/users.service';
import { IUser } from '@chronoco/services/auth-service/models/i-user';

@Injectable()
export class UsersAddUserViewComponentStore {
  private readonly usersService: UsersService = inject(UsersService);
  private readonly router: Router = inject(Router);

  private readonly _loading: WritableSignal<boolean> = signal(false);
  public readonly loading: Signal<boolean> = this._loading.asReadonly();

  public addEvent(user: Pick<IUser, 'login' | 'name' | 'password' | 'role'>): void {
    this._loading.set(true);
    this.usersService.addUser(user).pipe(
      finalize(() => this._loading.set(false)),
    ).subscribe(() => this.router.navigate([ '/', RoutesEnum.USERS ]));
  }
}