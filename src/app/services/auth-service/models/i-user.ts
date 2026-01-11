export interface IUser {
  id: string;
  name: string;
  login: string;
  role: string;
  selectedEvent: string;
  password?: string;
}