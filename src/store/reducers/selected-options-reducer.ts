import { Dispatch } from 'redux';
import { AppActions } from '@types';
import defaultState from '../default-state';

export function selectedOptionsReducer(state = defaultState, action: any) {
  const { payload, type } = action;
  switch (type) {
    case AppActions.SET_TIME_INTERVAL:
      return {
        ...state,
        selectedOptions: Object.assign(state.selectedOptions, {
          timeInterval: payload,
        }),
      };
      case AppActions.SET_ACTIVE_STATUS:
      return {
        ...state,
        selectedOptions: Object.assign(state.selectedOptions, {
          activeStatus: payload,
        }),
      };
      case AppActions.SET_SIZE_STATS:
      return {
        ...state,
        selectedOptions: Object.assign(state.selectedOptions, {
          sizeStats: payload,
        }),
      };
    default:
      return state;
  }
}

export const setActiveTimeInterval = (payload: string) => (dispatch: Dispatch) => {
  dispatch({ type: AppActions.SET_TIME_INTERVAL, payload });
};

export const setActiveStatus = (payload: string) => (dispatch: Dispatch) => {
  dispatch({ type: AppActions.SET_ACTIVE_STATUS, payload });
};

export const setSizeStats = (payload: string) => (dispatch: Dispatch) => {
  dispatch({ type: AppActions.SET_SIZE_STATS, payload });
};
