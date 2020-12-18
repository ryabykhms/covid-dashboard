import * as React from 'react';
import './country-list.css';
import { useSelector } from 'react-redux';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { IAppState } from '@types';

export const CountryList = () => {
  const country = useSelector((state: IAppState) => state.countries);

  return <ul className='country-list'>
    <SimpleBar forceVisible="false" className='country-list__size-scrollbar'>
      {
        country.map(({name, flag, population}) => (
          <li key={name}>
            <img className='country-list__image' src={flag} alt={name} />
            {name}

          </li>
        ))
      }
    </SimpleBar>
  </ul>
}
