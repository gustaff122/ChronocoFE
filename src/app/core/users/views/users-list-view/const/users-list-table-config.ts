import { ITableConfig } from '@chronoco/ui/shared-table/models/i-table-config';

export const USERS_LIST_TABLE_CONFIG: ITableConfig = {
  hasSquareBottom: true,
  checkboxesConfig: {
    hasCheckboxes: true,
    checkboxKey: 'id',
  },
  columns: [
    {
      caption: 'Nazwa',
      templateName: 'nameTpl',
      width: 260,
    },
    {
      caption: 'Login',
      dataField: 'login',
      width: 180,
    },
    {
      caption: 'Rola',
      templateName: 'roleTpl',
      width: 180,
    },
    {
      caption: 'Akcje',
      templateName: 'buttonsTpl',
      width: 220,
    },
  ],
};