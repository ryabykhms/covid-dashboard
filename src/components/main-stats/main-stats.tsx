import * as React from 'react';
import './main-stats.css';
import {useDispatch, useSelector} from "react-redux";
import { IAppState } from "@types";
import { setActiveCountry } from "../../store";

export const MainStats = () => {
  const selectedCountry = useSelector(
    (state: IAppState) => state.selectedCountry
  );
  const dispatch = useDispatch();
  const setCountry = (name: null) => dispatch(setActiveCountry(name));

  return <div
    className={`main-stats 
    ${selectedCountry === null ? 'main-stats__active' : ''}`}
    onClick={() => setCountry(null)}>
    <h2 className="main-stats__title">Global Cases</h2>
    <p className="main-stats__value">17 176 796</p>
  </div>
}
