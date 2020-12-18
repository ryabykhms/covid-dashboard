import * as React from 'react';
import './country-list.css';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { IAppState } from '@types';
import {setActiveCountry} from "../../store";

export const CountryList = () => {
  const country = useSelector((state: IAppState) => state.countries);
  const selectedCountry = useSelector((state: IAppState) => state.selectedCountry);
  const dispatch = useDispatch();
  const setCountry = (name: string) => dispatch(setActiveCountry(name));

  return <ul className='country-list scrollbar'>
    {
      country.map(({name, flag, population}) => (
      <li
        className={`country-list__item ${selectedCountry === name ? 'country-list__active-item' : ''}`}
        key={name}
        onClick={() => setCountry(name)}
      >
        <img className='country-list__image' src={flag} alt={name} />
        {name}
      </li>
      ))
    }
  </ul>
}
