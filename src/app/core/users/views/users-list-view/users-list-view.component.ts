import { Component, inject, Signal } from '@angular/core';
import { ButtonComponent } from '@chronoco/ui/button/button.component';
import { PageContainerComponent } from '@chronoco/ui/page-container/page-container.component';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { SharedTableComponent } from '@chronoco/ui/shared-table/shared-table.component';
import { UsersListViewComponentStore } from './users-list-view.component.store';
import { ITableConfig } from '@chronoco/ui/shared-table/models/i-table-config';
import { USERS_LIST_TABLE_CONFIG } from './const/users-list-table-config';
import { ITableDatasource } from '@chronoco/ui/shared-table/models/i-table-datasource';
import { InitialsPipe } from '@chronoco/pipes/initials.pipe';
import { UserRoleEnum } from '@chronoco/services/users-service/models/user-role.enum';
import { PaginationComponent } from '@chronoco/ui/pagination/pagination.component';

@Component({
  selector: 'app-users-list-view',
  imports: [
    ButtonComponent,
    PageContainerComponent,
    NgTemplateOutlet,
    SharedTableComponent,
    InitialsPipe,
    DatePipe,
    PaginationComponent,
  ],
  templateUrl: './users-list-view.component.html',
  styleUrl: './users-list-view.component.css',
  providers: [
    UsersListViewComponentStore,
  ],

})
export class UsersListViewComponent {
  private readonly componentStore: UsersListViewComponentStore = inject(UsersListViewComponentStore);
  public readonly config: ITableConfig = USERS_LIST_TABLE_CONFIG;
  public readonly dataSource: Signal<ITableDatasource<any>> = this.componentStore.usersDatasource;
  protected readonly UserRoleEnum = UserRoleEnum;
}
