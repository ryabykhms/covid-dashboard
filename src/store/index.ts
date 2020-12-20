import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import defaultState from './default-state';
import { rootReducer } from './reducers';

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const AppStore = createStore(
  rootReducer as any,
  defaultState,
  composeEnhancers(applyMiddleware(thunk))
);

AppStore.subscribe(() => console.log(AppStore.getState()));

export { defaultState };
export * from './reducers';
