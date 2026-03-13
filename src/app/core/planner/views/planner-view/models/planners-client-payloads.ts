import { IInstance, IInstancePayload, ILegend } from '@chronoco/models/i-legend';
import { PlannersClientMessages } from './planners-socket-messages';

export interface PlannersClientPayloads {
  [PlannersClientMessages.JOIN_PLANNER]: {
    eventId: string;
  };

  [PlannersClientMessages.ADD_INSTANCE]: {
    instance: IInstancePayload;
    legend?: ILegend;
  };

  [PlannersClientMessages.UPDATE_INSTANCE]: {
    changes: Partial<IInstancePayload>;
    id: string;
  };

  [PlannersClientMessages.REMOVE_INSTANCE]: {
    id: IInstance['id'];
  };

  [PlannersClientMessages.ADD_LEGEND]: {
    legend: Omit<ILegend, 'id'> }
  ;

  [PlannersClientMessages.UPDATE_LEGEND]: {
    id: ILegend['id'];
    changes: Partial<ILegend>;
  };

  [PlannersClientMessages.REMOVE_LEGEND]: {
    id: ILegend['id'];
  };
}
