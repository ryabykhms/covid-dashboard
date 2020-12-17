import * as React from 'react';
import './country-list.css';
import { useSelector } from 'react-redux';
import { IAppState } from '@types';

export const CountryList = () => {
  const country = useSelector((state: IAppState) => state.countries);

  return <ul className='country-list'>
    {
      country.map(({name, flag, population}) => (
      <li key={name}>
        <img className='country-list__image' src={flag} alt={name} />
        {name}
      </li>
      ))
    }
  </ul>
}
