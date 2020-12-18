import * as React from 'react';
import './country-list.css';
import { useDispatch, useSelector } from 'react-redux';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { IAppState } from '@types';
import { setActiveCountry } from '../../store';

export const CountryList = () => {
  const country = useSelector((state: IAppState) => state.countries);
  const selectedCountry = useSelector(
    (state: IAppState) => state.selectedCountry
  );
  const dispatch = useDispatch();
  const setCountry = (name: string) => dispatch(setActiveCountry(name));

  return (
    <ul className="country-list">
      <SimpleBar forceVisible="false" className="country-list__size-scrollbar">
        {country.map(({ name, flag, population, alpha2Code }) => (
          <li
            className={`country-list__item ${
              selectedCountry === name ? 'country-list__active-item' : ''
            }`}
            key={name}
            onClick={() => setCountry(alpha2Code)}
          >
            <div className="country-list__row">
              <img className="country-list__image" src={flag} alt={name} />
              {name}
            </div>
            <div className="country-list__row">
              <span className="country-list__cases-count">17 176 796</span>
            </div>
          </li>
        ))}
      </SimpleBar>
    </ul>
  );
};
