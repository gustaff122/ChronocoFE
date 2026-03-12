import { Observable } from 'rxjs';

export interface ISnackbar {
  id?: string;
  header: string;
  message: string;
  timeout: number;
  type: SnackbarType;

  progress$?: Observable<number>;
}

export enum SnackbarType {
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
}