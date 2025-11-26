import { ITableColumn } from './i-table-column';

export interface ITableConfig {
  columns: ITableColumn[];
  hasSquareBottom?: boolean;
  checkboxesConfig?: {
    hasCheckboxes?: boolean;
    checkboxKey: string;
  };
}
