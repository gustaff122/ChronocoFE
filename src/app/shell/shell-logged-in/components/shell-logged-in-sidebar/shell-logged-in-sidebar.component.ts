import { Component, computed, inject, Signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { IMenuItem } from '@chronoco/models/i-menu-item';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { heroArrowRightStartOnRectangleSolid, heroCalendarSolid, heroFolderOpenSolid, heroHomeSolid, heroUserGroupSolid } from '@ng-icons/heroicons/solid';
import { AuthStore } from '@chronoco/stores/auth-store/auth.store';
import { IUser } from '@chronoco/services/auth-service/models/i-user';
import { FirstNamePipe } from '@chronoco/pipes/first-name.pipe';
import { LastNamePipe } from '@chronoco/pipes/last-name.pipe';
import { InitialsPipe } from '@chronoco/pipes/initials.pipe';
import { TippyDirective } from '@ngneat/helipopper';
import { RoutesEnum } from '@chronoco/models/routes.enum';

@Component({
  selector: 'app-shell-logged-in-sidebar',
  imports: [
    RouterLink,
    NgIcon,
    RouterLinkActive,
    FirstNamePipe,
    LastNamePipe,
    InitialsPipe,
    TippyDirective,
  ],
  templateUrl: './shell-logged-in-sidebar.component.html',
  styleUrl: './shell-logged-in-sidebar.component.css',
  viewProviders: [ provideIcons({ heroCalendarSolid, heroHomeSolid, heroUserGroupSolid, heroFolderOpenSolid, heroArrowRightStartOnRectangleSolid }) ],
})
export class ShellLoggedInSidebarComponent {
  private readonly authStore: AuthStore = inject(AuthStore);

  public readonly user: Signal<IUser> = this.authStore.user;

  public logoutHandler(): void {
    this.authStore.logout();
  }

  public readonly navigation: Signal<IMenuItem[]> = computed(() => ([
    {
      name: 'Home',
      url: `/${RoutesEnum.HOME}`,
      icon: 'heroHomeSolid',
    },
    {
      name: 'Wydarzenia',
      url: `/${RoutesEnum.EVENTS}`,
      icon: 'heroFolderOpenSolid',
    },
    {
      name: 'Planer',
      url: `/${RoutesEnum.PLANNER}`,
      icon: 'heroCalendarSolid',
      disabled: !this.authStore.user().selectedEvent,
      tooltipOnDisabled: 'Musisz najpierw wybrać Wydarzenie'
    },
    {
      name: 'Użytkownicy',
      url: `/${RoutesEnum.USERS}`,
      icon: 'heroUserGroupSolid',
    },
  ]))
}
