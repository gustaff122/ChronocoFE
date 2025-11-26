import { Injectable, Signal, signal } from '@angular/core';
import { ITableDatasource } from '@chronoco/ui/shared-table/models/i-table-datasource';

@Injectable()
export class UsersListViewComponentStore {
  public readonly usersDatasource: Signal<ITableDatasource<any>> = signal({
    items: [
      {
        id: '1',
        login: 'superman',
        name: 'Clark Kent',
        createdAt: '2023-05-10T12:00:00Z',
        role: 'SUPERADMIN',
      },
      {
        id: '2',
        login: 'admin123',
        name: 'Diana Prince',
        createdAt: '2023-09-22T08:30:00Z',
        role: 'ADMIN',
      },
      {
        id: '3',
        login: 'user01',
        name: 'Bruce Wayne',
        createdAt: '2024-01-15T14:20:00Z',
        role: 'USER',
      },
      {
        id: '4',
        login: 'user02',
        name: 'Barry Allen',
        createdAt: '2024-07-01T09:10:00Z',
        role: 'USER',
      },
    ],
  });
}