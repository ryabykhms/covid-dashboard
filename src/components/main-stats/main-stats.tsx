import * as React from 'react';
import './main-stats.css';
import {connect, useDispatch, useSelector} from 'react-redux';
import { IAppState } from '@types';
import { setActiveCountry } from '@store';
import { getStatsOnCurrentOptions } from '@utils';
import { SELECTED_DATA_OPTIONS } from "@constants";

const switchStatusStats = (status: string | undefined): string => {
  switch (status) {
    case SELECTED_DATA_OPTIONS.ACTIVE_STATUS_CONFIRMED: {
      return 'main-stats__confirmed';
    }
    case SELECTED_DATA_OPTIONS.ACTIVE_STATUS_RECOVERED: {
      return 'main-stats__recovered';
    }
    case SELECTED_DATA_OPTIONS.ACTIVE_STATUS_DEATHS: {
      return 'main-stats__deaths';
    }
    default: return 'main-stats__no-data';
  }

}

const MainStatsComponent = (state: any) => {
  const { covidGlobal, selectedOptions } = state;

  const selectedCountry = useSelector(
    (state: IAppState) => state.selectedCountry
  );

  const dispatch = useDispatch();
  const setCountry = (name: null) => dispatch(setActiveCountry(name));

  const [stats, status] = getStatsOnCurrentOptions(covidGlobal, selectedOptions);

  return <div
    className={`main-stats 
    ${selectedCountry === null ? 'main-stats__active' : ''}`}
    onClick={() => setCountry(null)}>
    <h2 className="main-stats__title">Global Cases</h2>
    <p className={`main-stats__value
    ${switchStatusStats(status)}`}
    >
      {stats}
    </p>
  </div>
}

export const MainStats = connect(
  (state: IAppState) => ({
    covidGlobal: state.covidGlobal,
    selectedOptions : {
      timeInterval: state.selectedOptions.timeInterval,
      activeStatus: state.selectedOptions.activeStatus,
      sizeStats: state.selectedOptions.sizeStats,
    }
  }), null
)(MainStatsComponent);

