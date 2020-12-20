import * as React from 'react';
import './control-element.css';
import { useDispatch, useSelector } from 'react-redux';
import { IAppState } from '@types';
import {
  setActiveTimeInterval,
  setActiveStatus,
  setSizeStats
} from '@store';
import { SELECTED_DATA_OPTIONS } from "@constants";

export const ControlElement = () => {
  const timeInterval = useSelector((state: IAppState) => state.selectedData.timeInterval);
  const activeStatus = useSelector((state: IAppState) => state.selectedData.activeStatus);
  const sizeStats = useSelector((state: IAppState) => state.selectedData.sizeStats);

  const dispatch = useDispatch();

  const setTimeInterval = (timeInterval: string) => dispatch(setActiveTimeInterval(timeInterval));
  const setStatusActive = (activeStatus: string) => dispatch(setActiveStatus(activeStatus));
  const setStatusSize = (sizeStatus: string) => dispatch(setSizeStats(sizeStatus));

  return <div className='control-element'>
    <div>
      <label>
        <input className="visually-hidden" type="radio" name="time" value="time"
               onChange={ () => setTimeInterval(SELECTED_DATA_OPTIONS.TIME_INTERVAL_ALL) }
               checked={ timeInterval === SELECTED_DATA_OPTIONS.TIME_INTERVAL_ALL } />
        <span className="radio-indicator">All time</span>
      </label>
      <label>
        <input className="visually-hidden" type="radio" name="time" value="time"
               onChange={ () => setTimeInterval(SELECTED_DATA_OPTIONS.TIME_INTERVAL_LAST_DAY) }
               checked={ timeInterval === SELECTED_DATA_OPTIONS.TIME_INTERVAL_LAST_DAY } />
        <span className="radio-indicator">Last day</span>
      </label>
    </div>
    <div>
      <label>
        <input className="visually-hidden" type="radio" name="active-status" value="status"
               onChange={ () => setStatusActive(SELECTED_DATA_OPTIONS.ACTIVE_STATUS_CONFIRMED) }
               checked={ activeStatus === SELECTED_DATA_OPTIONS.ACTIVE_STATUS_CONFIRMED } />
        <span className="radio-indicator">Confirmed</span>
      </label>
      <label>
        <input className="visually-hidden" type="radio" name="active-status" value="status"
               onChange={ () => setStatusActive(SELECTED_DATA_OPTIONS.ACTIVE_STATUS_RECOVERED) }
               checked={ activeStatus === SELECTED_DATA_OPTIONS.ACTIVE_STATUS_RECOVERED } />
        <span className="radio-indicator">Recovered</span>
      </label>
      <label>
        <input className="visually-hidden" type="radio" name="active-status" value="status"
               onChange={ () => setStatusActive(SELECTED_DATA_OPTIONS.ACTIVE_STATUS_DEATHS) }
               checked={ activeStatus === SELECTED_DATA_OPTIONS.ACTIVE_STATUS_DEATHS } />
        <span className="radio-indicator">Confirmed</span>
      </label>
    </div>
    <div>
      <label>
        <input className="visually-hidden" type="radio" name="active-size" value="size"
               onChange={ () => setStatusSize(SELECTED_DATA_OPTIONS.SIZE_STATUS_ALL) }
               checked={ sizeStats === SELECTED_DATA_OPTIONS.SIZE_STATUS_ALL } />
        <span className="radio-indicator">All people</span>
      </label>
      <label>
        <input className="visually-hidden" type="radio" name="active-size" value="size"
               onChange={ () => setStatusSize(SELECTED_DATA_OPTIONS.SIZE_STATUS_100k) }
               checked={ sizeStats === SELECTED_DATA_OPTIONS.SIZE_STATUS_100k } />
        <span className="radio-indicator">Per 100 thousand</span>
      </label>
    </div>
  </div>
}
