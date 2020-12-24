import {defaultState} from "@store";
import {AppActions} from "@types";
import {Dispatch} from "redux";

export function fullScreenElementReducer(state = defaultState, action: any) {
  const { type } = action;
  let fullScreenElement = state.fullScreenElement;
  switch (type) {
    case AppActions.SET_FULL_SCREEN:
      fullScreenElement = !fullScreenElement;
      return {
        ...state,
        fullScreenElement,
      };
    default:
      return state;
  }
}

export const setFullScreenElementValue = () => (
  dispatch: Dispatch
) => {
  dispatch({ type: AppActions.SET_FULL_SCREEN });
};
