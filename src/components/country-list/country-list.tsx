import * as React from 'react';
import './country-list.css';
import { useDispatch, useSelector } from 'react-redux';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { IAppState, ICovidInfo, ICountryForRender } from '@types';
import { setActiveCountry } from '@store';
import { getStatsOnCurrentOptions } from "@utils";
import { SELECTED_DATA_OPTIONS } from "@constants";

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

export const CountryList = (state: any) => {
  const covidAllCountries = useSelector((state: IAppState) => state.covidAllCountries);
  const selectedOptions = useSelector((state: IAppState) => state.selectedOptions);
  console.log(selectedOptions.activeStatus)

  const country = useSelector((state: IAppState) => state.countries);
  const selectedCountry = useSelector(
    (state: IAppState) => state.selectedCountry
  );

  const dispatch = useDispatch();
  const setCountry = (name: string) => dispatch(setActiveCountry(name));

  const result: ICountryForRender[]  = country
    .map(({ name, flag, alpha2Code }) => {
      const alpha2 = alpha2Code as keyof ICovidInfo;
      const [stats, status] = getStatsOnCurrentOptions(covidAllCountries[alpha2], selectedOptions);
      return {
        name: name,
        flag: flag,
        alpha2Code: alpha2Code,
        stats: stats,
        status: status,
      }
    }).sort((a, b) => {
      let argA = a.stats as number;
      let argB = b.stats as number;
      return argB - argA;
    })

  return (
    <ul className="country-list">
      <SimpleBar forceVisible="false" className="country-list__size-scrollbar">
        {result.map(({name, status, alpha2Code, flag, stats}) => {
          return (
            <li
              className={`country-list__item ${
                selectedCountry === alpha2Code ? 'country-list__active-item' : ''
              }`}
              key={name}
              onClick={() => setCountry(alpha2Code as string)}
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
        })}

      </SimpleBar>
    </ul>
  );
};


