import defaultState from '../default-state';
import { ICountry, AppActions } from '../../types';
import { Dispatch } from 'redux';
import {
  storageCountries,
  storagePopulation,
  storageCovidData,
  storageCovidGlobal,
  storageLastFetchDate,
} from '../../utils/local-storage';

export function covidReducer(state = defaultState, action: any) {
  const { payload, type } = action;
  switch (type) {
    case AppActions.SET_COVID_DATA:
      let covidAllCountries = state.covidAllCountries;
      let covidGlobal = state.covidGlobal;
      let validCountries: Array<ICountry> = state.countries;

      if (payload.isFetch) {
        const fetchDate = new Date().getTime().toString();
        const population = calcEarthPopulation(state.countries);
        covidAllCountries = formatDataFromFetch(
          state.countries,
          payload.data.Countries
        );

        validCountries = getCoutriesSameFromCovid(
          covidAllCountries,
          state.countries
        );

        covidGlobal = formatGlobalFromFetch(population, payload.data.Global);

        storagePopulation.set(population);
        storageCountries.set(validCountries);
        storageCovidData.set(covidAllCountries);
        storageCovidGlobal.set(covidGlobal);
        storageLastFetchDate.set(fetchDate);
      } else {
        covidAllCountries = payload.data;
        covidGlobal = storageCovidGlobal.get();
      }

      let covidActive: any = state.covidActive;
      if (!state.selectedCountry) {
        covidActive = covidGlobal;
      }

      return {
        ...state,
        isCovidLoaded: true,
        covidAllCountries,
        covidGlobal,
        covidActive,
        countries: validCountries,
      };
    default:
      return state;
  }
}

function getCoutriesSameFromCovid(
  covidAllCountries: any,
  countries: Array<ICountry>
) {
  return countries.filter((country: ICountry) => {
    return covidAllCountries[country.alpha2Code.toUpperCase()] !== undefined;
  });
}

function calcEarthPopulation(countries: any) {
  return countries.reduce((sum: number, country: any) => {
    return sum + country.population;
  }, 0);
}

const calcPer100 = (
  population: number,
  confirmed: number,
  deaths: number,
  recovered: number
) => {
  const per100 = 100000;
  return {
    confirmed: Math.floor((per100 * confirmed) / population),
    deaths: Math.floor((per100 * deaths) / population),
    recovered: Math.floor((per100 * recovered) / population),
  };
};

function formatGlobalFromFetch(population: number, global: any) {
  return createCovidInfoObject(population, global);
}

function createCovidInfoObject(population: number, info: any): any {
  const obj = {
    total: {
      confirmed: info.TotalConfirmed,
      deaths: info.TotalDeaths,
      recovered: info.TotalRecovered,
    },

    totalPer100: calcPer100(
      population,
      info.TotalConfirmed,
      info.TotalDeaths,
      info.TotalRecovered
    ),

    lastDay: {
      confirmed: info.NewConfirmed,
      deaths: info.NewDeaths,
      recovered: info.NewRecovered,
    },

    lastDayPer100: calcPer100(
      population,
      info.NewConfirmed,
      info.NewDeaths,
      info.NewRecovered
    ),
  };

  return obj;
}

function formatDataFromFetch(countries: ICountry[], data: any) {
  const countriesObject = countries.reduce((acc: object, country: ICountry) => {
    return {
      ...acc,
      [country.alpha2Code.toUpperCase()]: country.population,
    };
  }, {});

  const covidData = data.reduce((acc: Object, country: any) => {
    if (!countriesObject[country.CountryCode]) {
      return { ...acc };
    }

    const population = countriesObject[country.CountryCode];

    const countryObject = {
      [country.CountryCode]: createCovidInfoObject(population, country),
    };

    return {
      ...acc,
      ...countryObject,
    };
  }, {});

  return covidData;
}

export const loadCovidInfo = () => (dispatch: Dispatch) => {
  const now = new Date();
  const hours = now.getUTCHours();
  const prev = new Date(+storageLastFetchDate.get());
  const isPrevDay = prev.getUTCDate() !== now.getUTCDate();
  const isPrevHours = prev.getUTCHours() < hours;
  const isNewTime = hours >= 8 && (isPrevDay || isPrevHours);

  if (!storageCovidData.has() || isNewTime) {
    fetch('https://api.covid19api.com/summary').then(async (response) => {
      dispatch({
        type: AppActions.SET_COVID_DATA,
        payload: { isFetch: true, data: await response.json() },
      });
    });
  } else {
    dispatch({
      type: AppActions.SET_COVID_DATA,
      payload: {
        isFetch: false,
        data: storageCovidData.get(),
      },
    });
  }
};