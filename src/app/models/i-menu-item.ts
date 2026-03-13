export interface IMenuItem {
  name: string;
  icon: string;
  url: string;
  disabled?: boolean;
  tooltipOnDisabled?: string;
}