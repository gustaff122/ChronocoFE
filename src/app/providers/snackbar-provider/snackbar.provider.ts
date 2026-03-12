import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ISnackbar, SnackbarType } from './models/i-snackbar';
import { animationFrameScheduler, asyncScheduler, BehaviorSubject, defer, finalize, interval, map, SchedulerLike, shareReplay, takeWhile } from 'rxjs';
import { ulid } from 'ulid';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SnackbarProvider {
  private readonly _snackbars$ = new BehaviorSubject<ISnackbar[]>([]);
  public readonly snackbars$ = this._snackbars$.asObservable();

  private readonly platformId = inject(PLATFORM_ID);

  private show(snackbar: ISnackbar): void {
    const id = ulid();

    const scheduler = this.resolveScheduler();

    const progress$ = defer(() => {
      const start =
        typeof performance !== 'undefined'
          ? performance.now()
          : Date.now();

      return interval(0, scheduler).pipe(
        map(() => {
          const now =
            typeof performance !== 'undefined'
              ? performance.now()
              : Date.now();

          const elapsed = now - start;

          return Math.max(
            100 - (elapsed / snackbar.timeout) * 100,
            0,
          );
        }),
        takeWhile(progress => progress > 0, true),
        finalize(() => this.remove(id)),
        shareReplay(1),
      );
    });

    const snackbarState: ISnackbar = {
      ...snackbar,
      id,
      progress$,
    };

    this._snackbars$.next([
      ...this._snackbars$.value,
      snackbarState,
    ]);
  }

  public remove(id: string): void {
    this._snackbars$.next(
      this._snackbars$.value.filter(s => s.id !== id),
    );
  }

  public clear(): void {
    this._snackbars$.next([]);
  }

  public success(message: string, header = 'Success', timeout = 3000): void {
    this.show({ message, timeout, header, type: SnackbarType.SUCCESS });
  }

  public error(message: string, header = 'Error', timeout = 3000): void {
    this.show({ message, timeout, header, type: SnackbarType.ERROR });
  }

  public info(message: string, header = 'Info', timeout = 3000): void {
    this.show({ message, timeout, header, type: SnackbarType.INFO });
  }

  public warning(message: string, header = 'Warning', timeout = 3000): void {
    this.show({ message, timeout, header, type: SnackbarType.WARNING });
  }

  private resolveScheduler(): SchedulerLike {
    return isPlatformBrowser(this.platformId)
      ? animationFrameScheduler
      : asyncScheduler;
  }
}