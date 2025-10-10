import { IInstance, ILegend } from '@chronoco/models/i-legend';
import { PlannersSocketMessages } from './planners-socket-messages';

export interface PlannersSocketData {
  [PlannersSocketMessages.PRESENCE_SNAPSHOT]: {
    users: string[];
    planner: {
      id: string;
      instances: IInstance[];
    };
    legends: ILegend[];
  };

  [PlannersSocketMessages.USER_JOINED]: {
    users: { id: string; name: string }[];
  };

  [PlannersSocketMessages.USER_LEFT]: {
    username: string;
  };

  [PlannersSocketMessages.INSTANCE_ADDED]: IInstance;

  [PlannersSocketMessages.INSTANCE_UPDATED]: IInstance;

  [PlannersSocketMessages.INSTANCE_REMOVED]: {
    id: IInstance['id'];
  };

  [PlannersSocketMessages.LEGEND_ADDED]: ILegend;

  [PlannersSocketMessages.LEGEND_UPDATED]: ILegend;

  [PlannersSocketMessages.LEGEND_REMOVED]: {
    id: ILegend['id'];
  };
}
