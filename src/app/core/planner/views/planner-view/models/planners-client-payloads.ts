import { IInstance, ILegend } from '@chronoco/models/i-legend';
import { PlannersClientMessages } from './planners-socket-messages';

export interface PlannersClientPayloads {
  [PlannersClientMessages.JOIN_PLANNER]: {
    eventId: string;
  };

  [PlannersClientMessages.ADD_INSTANCE]: {
    planId: string;
    instance: Omit<IInstance, 'id'> & Partial<Pick<IInstance, 'id'>>;
  };

  [PlannersClientMessages.UPDATE_INSTANCE]: {
    id: IInstance['id'];
    changes: Partial<IInstance>;
  };

  [PlannersClientMessages.REMOVE_INSTANCE]: {
    id: IInstance['id'];
  };

  [PlannersClientMessages.ADD_LEGEND]: { legend: Omit<ILegend, 'id'> };

  [PlannersClientMessages.UPDATE_LEGEND]: {
    id: ILegend['id'];
    changes: Partial<ILegend>;
  };

  [PlannersClientMessages.REMOVE_LEGEND]: {
    id: ILegend['id'];
  };
}
