import { Component, computed, inject, input, InputSignal, Signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroBookmark } from '@ng-icons/heroicons/outline';
import { EventsListItemPinBtnComponentStore } from './events-list-item-pin-btn.component.store';
import { AuthStore } from '@chronoco/stores/auth-store/auth.store';
import { heroBookmarkSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-events-list-item-pin-btn',
  imports: [
    NgIcon,
  ],
  templateUrl: './events-list-item-pin-btn.component.html',
  styleUrl: './events-list-item-pin-btn.component.css',
  providers: [
    EventsListItemPinBtnComponentStore,
  ],
  viewProviders: [
    provideIcons({ heroBookmark, heroBookmarkSolid }),
  ],
})
export class EventsListItemPinBtnComponent {
  public eventId: InputSignal<string> = input.required();

  private readonly componentStore: EventsListItemPinBtnComponentStore = inject(EventsListItemPinBtnComponentStore);
  private readonly authStore: AuthStore = inject(AuthStore);

  public readonly isSelected: Signal<boolean> = computed(() => this.eventId() === this.authStore.user().selectedEvent);

  public pinHandler(): void {
    if (!this.isSelected()) {
      this.componentStore.selectEvent(this.eventId());
    }
  }
}
