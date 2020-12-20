import { Dispatch } from 'redux';
import { AppActions } from '@types';
import defaultState from '../default-state';

export function selectedDataReducer(state = defaultState, action: any) {
  const { payload, type } = action;
  switch (type) {
    case AppActions.SET_TIME_INTERVAL:
      return {
        ...state,
        selectedData: Object.assign(state.selectedData, {
          timeInterval: payload,
        }),
      };
      case AppActions.SET_ACTIVE_STATUS:

      return {
        ...state,
        selectedData: Object.assign(state.selectedData, {
          activeStatus: payload,
        }),
      };
      case AppActions.SET_SIZE_STATS:
      return {
        ...state,
        selectedData: Object.assign(state.selectedData, {
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
