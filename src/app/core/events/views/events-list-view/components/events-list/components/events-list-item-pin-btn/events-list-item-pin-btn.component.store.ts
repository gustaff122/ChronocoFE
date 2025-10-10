import { inject, Injectable } from '@angular/core';
import { EventsService } from '../../../../../../../../services/events-service/events.service';
import { AuthStore } from '@chronoco/stores/auth-store/auth.store';
import { catchError } from 'rxjs';

@Injectable()
export class EventsListItemPinBtnComponentStore {
  private readonly eventsService: EventsService = inject(EventsService);
  private readonly authStore: AuthStore = inject(AuthStore);

  public selectEvent(eventId: string): void {
    const previousEvent = this.authStore.user().selectedEvent;
    this.authStore.changeSelectedEvent(eventId);

    this.eventsService.selectEvent(eventId).pipe(
      catchError((e) => {
        this.authStore.changeSelectedEvent(previousEvent);
        throw e;
      }),
    ).subscribe();
  }
}