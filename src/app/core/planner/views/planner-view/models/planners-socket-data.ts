import { IInstance, IInstancePayload, ILegend } from '@chronoco/models/i-legend';
import { PlannersSocketMessages } from './planners-socket-messages';

export interface PlannersSocketData {
  [PlannersSocketMessages.PRESENCE_SNAPSHOT]: {
    users: string[];
    planner: {
      id: string;
      instances: IInstancePayload[];
      legends: ILegend[];
    };
  };

  [PlannersSocketMessages.USER_JOINED]: {
    user: string;
  };

  [PlannersSocketMessages.USER_LEFT]: {
    username: string;
  };

  [PlannersSocketMessages.INSTANCE_ADDED]: IInstancePayload;

  [PlannersSocketMessages.INSTANCE_UPDATED]: {
    updated: IInstancePayload;
    userId: string;
  };

  [PlannersSocketMessages.INSTANCE_REMOVED]: {
    id: IInstance['id'];
  };

  [PlannersSocketMessages.LEGEND_ADDED]: ILegend;

  [PlannersSocketMessages.LEGEND_UPDATED]: ILegend;

  [PlannersSocketMessages.LEGEND_REMOVED]: {
    id: ILegend['id'];
  };
}
