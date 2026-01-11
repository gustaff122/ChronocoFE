import { Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { PageContainerComponent } from '@chronoco/ui/page-container/page-container.component';
import { RoutesEnum } from '@chronoco/models/routes.enum';
import { NgTemplateOutlet } from '@angular/common';
import { InputComponent } from '@chronoco/ui/input/input.component';
import { UserRoleEnum } from '@chronoco/services/users-service/models/user-role.enum';
import { IUser } from '@chronoco/services/auth-service/models/i-user';
import { Field, FieldTree, form, required } from '@angular/forms/signals';
import { ButtonComponent } from '@chronoco/ui/button/button.component';
import { FormsModule } from '@angular/forms';
import { UsersAddUserViewComponentStore } from './users-add-user-view.component.store';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowPath } from '@ng-icons/heroicons/outline';

const EMPTY_FORM_STATE: Pick<IUser, 'login' | 'name' | 'password' | 'role'> = {
  login: null,
  name: null,
  password: null,
  role: UserRoleEnum.SUPERADMIN,
};


@Component({
  selector: 'app-users-add-user-view',
  imports: [
    PageContainerComponent,
    NgTemplateOutlet,
    InputComponent,
    Field,
    ButtonComponent,
    FormsModule,
    NgIcon,
  ],
  templateUrl: './users-add-user-view.component.html',
  styleUrl: './users-add-user-view.component.css',
  providers: [
    UsersAddUserViewComponentStore
  ],
  viewProviders: [ provideIcons({heroArrowPath}) ]
})
export class UsersAddUserViewComponent {
  private readonly componentStore: UsersAddUserViewComponentStore = inject(UsersAddUserViewComponentStore);

  private readonly formModel: WritableSignal<Pick<IUser, 'login' | 'name' | 'password' | 'role'>> = signal(EMPTY_FORM_STATE);
  public readonly form: FieldTree<Pick<IUser, 'login' | 'name' | 'password' | 'role'>> = form(this.formModel, ((f) => {
    required(f.login);
    required(f.name);
    required(f.password);
  }));

  public readonly loading: Signal<boolean> = this.componentStore.loading;

  public submitHandler(): void {
    this.componentStore.addEvent(this.form().value())
  }

  protected readonly RoutesEnum = RoutesEnum;
}
