import { Component, inject, signal, Signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { IMenuItem } from '@chronoco/models/i-menu-item';
import { MENU_ITEMS } from '@chronoco/const/menu-items';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { heroArrowRightStartOnRectangleSolid, heroCalendarSolid, heroFolderOpenSolid, heroHomeSolid, heroUserGroupSolid } from '@ng-icons/heroicons/solid';
import { AuthStore } from '@chronoco/stores/auth-store/auth.store';
import { IUser } from '../../../../services/auth-service/models/i-user';
import { FirstNamePipe } from '@chronoco/pipes/first-name.pipe';
import { LastNamePipe } from '@chronoco/pipes/last-name.pipe';
import { InitialsPipe } from '@chronoco/pipes/initials.pipe';

@Component({
  selector: 'app-shell-logged-in-sidebar',
  imports: [
    RouterLink,
    NgIcon,
    RouterLinkActive,
    FirstNamePipe,
    LastNamePipe,
    InitialsPipe,
  ],
  templateUrl: './shell-logged-in-sidebar.component.html',
  styleUrl: './shell-logged-in-sidebar.component.css',
  viewProviders: [ provideIcons({ heroCalendarSolid, heroHomeSolid, heroUserGroupSolid, heroFolderOpenSolid, heroArrowRightStartOnRectangleSolid }) ],
})
export class ShellLoggedInSidebarComponent {
  private readonly authStore: AuthStore = inject(AuthStore);

  public readonly navigation: Signal<IMenuItem[]> = signal(MENU_ITEMS).asReadonly();

  public readonly user: Signal<IUser> = this.authStore.user;

  public logoutHandler(): void {
    this.authStore.logout();
  }
}
