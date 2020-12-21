import * as React from 'react';
import './country-list.css';
import {connect, useDispatch, useSelector} from 'react-redux';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { IAppState } from '@types';
import { setActiveCountry } from '@store';
import {getStatsOnCurrentOptions} from "@utils";
import {SELECTED_DATA_OPTIONS} from "@constants";

const switchStatusStats = (status: string | undefined): string => {
  switch (status) {
    case SELECTED_DATA_OPTIONS.ACTIVE_STATUS_CONFIRMED: {
      return 'country-list__confirmed';
    }
    case SELECTED_DATA_OPTIONS.ACTIVE_STATUS_RECOVERED: {
      return 'country-list__recovered';
    }
    case SELECTED_DATA_OPTIONS.ACTIVE_STATUS_DEATHS: {
      return 'country-list__deaths';
    }
    default: return 'country-list__no-data';
  }
}

const CountryListComponent = (state: any) => {
  const { covidAllCountries, selectedOptions } = state;

  const country = useSelector((state: IAppState) => state.countries);
  const selectedCountry = useSelector(
    (state: IAppState) => state.selectedCountry
  );
  const dispatch = useDispatch();
  const setCountry = (name: string) => dispatch(setActiveCountry(name));

  return (
    <ul className="country-list">
      <SimpleBar forceVisible="false" className="country-list__size-scrollbar">
        {country.map(({ name, flag, population, alpha2Code }) => {

          const [stats, status] = getStatsOnCurrentOptions(covidAllCountries[alpha2Code], selectedOptions);

           return (
              <li
                className={`country-list__item ${
                  selectedCountry === alpha2Code ? 'country-list__active-item' : ''
                }`}
                key={name}
                onClick={() => setCountry(alpha2Code)}
              >
                <div className="country-list__row">
                  <img className="country-list__image" src={flag} alt={name}/>
                  {name}
                </div>
                <div className="country-list__row">
                  <span className={`country-list__cases-count ${switchStatusStats(status)}`}>
                    {stats}
                  </span>
                </div>
              </li>
            )
          }
        )}
      </SimpleBar>
    </ul>
  );
};

export const CountryList = connect(
  (state: IAppState) => ({
    covidAllCountries: state.covidAllCountries,
    selectedOptions : {
      timeInterval: state.selectedOptions.timeInterval,
      activeStatus: state.selectedOptions.activeStatus,
      sizeStats: state.selectedOptions.sizeStats,
    }
  }), null
)(CountryListComponent);
