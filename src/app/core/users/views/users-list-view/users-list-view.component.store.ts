import { computed, inject, Injectable, ResourceRef, Signal } from '@angular/core';
import { UsersService } from '@chronoco/services/users-service/users.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { ITableDatasource } from '@chronoco/ui/shared-table/models/i-table-datasource';
import { IUser } from '@chronoco/services/auth-service/models/i-user';

@Injectable()
export class UsersListViewComponentStore {
  private readonly usersService: UsersService = inject(UsersService);

  private readonly _list: ResourceRef<IUser[]> = rxResource({
    stream: () => this.usersService.getUsers(),
    defaultValue: [],
  });

  public readonly loading: Signal<boolean> = computed(() => this._list.isLoading());
  public readonly dataSource: Signal<ITableDatasource<IUser[]>> = computed(() => ({items: this._list.value()}))
}