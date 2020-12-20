import { Dispatch } from 'redux';
import { defaultState } from '@store';
import { ICountry, AppActions } from '@types';
import { storage } from '@utils';

export function covidReducer(state = defaultState, action: any) {
  const { payload, type } = action;
  switch (type) {
    case AppActions.SET_COVID_DATA:
      let covidAllCountries = state.covidAllCountries;
      let covidGlobal = state.covidGlobal;
      let validCountries: Array<ICountry> = state.countries;

      if (payload.isFetch && !payload.isError) {
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

        storage.population.set(population);
        storage.countries.set(validCountries);
        storage.covidData.set(covidAllCountries);
        storage.covidGlobal.set(covidGlobal);
        storage.lastFetchDate.set(fetchDate);
      }

      if (payload.isFetch && payload.isError) {
        covidGlobal = null;
      }

      if (!payload.isFetch) {
        covidAllCountries = payload.data;
        covidGlobal = storage.covidGlobal.get();
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

    case AppActions.SET_GLOBAL_COVID_DATA:
      let globalCovidData = state.globalCovidData;

      if (payload.isFetch && !payload.isError) {
        globalCovidData = formatGlobalCovidData(payload.data);
      }

      if (payload.isFetch && payload.isError) {
        globalCovidData = null;
      }

      return {
        ...state,
        isGlobalCovidDataLoaded: true,
        isCountryCovidDataLoaded: true,
        globalCovidData,
        selectedData: globalCovidData,
      };

    default:
      return state;
  }
}

function formatGlobalCovidData(data: any[]) {
  const lastDay = new Date();
  return data.map((infoByDay, i) => {
    const date = getDatePrev(lastDay, i);
    return {
      Confirmed: infoByDay.TotalConfirmed,
      Deaths: infoByDay.TotalDeaths,
      Recovered: infoByDay.TotalRecovered,
      Date: date,
    };
  });
}

function getDatePrev(lastDay: Date, countDays: number) {
  const prevDate = new Date();
  prevDate.setTime(lastDay.getTime());
  prevDate.setDate(prevDate.getDate() - countDays);
  return prevDate;
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
  const prev = new Date(+storage.lastFetchDate.get());
  const isPrevDay = prev.getUTCDate() !== now.getUTCDate();
  const isPrevHours = prev.getUTCHours() < hours;
  const isNewTime = hours >= 8 && (isPrevDay || isPrevHours);

  if (!storage.covidData.has() || isNewTime) {
    fetch('https://api.covid19api.com/summary')
      .then(async (response) => {
        dispatch({
          type: AppActions.SET_COVID_DATA,
          payload: {
            isFetch: true,
            isError: false,
            data: await response.json(),
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: AppActions.SET_COVID_DATA,
          payload: { isFetch: true, isError: true, data: error },
        });
      });
  } else {
    dispatch({
      type: AppActions.SET_COVID_DATA,
      payload: {
        isFetch: false,
        isError: true,
        data: storage.covidData.get(),
      },
    });
  }
};

export const loadGlobalCovidData = () => (dispatch: Dispatch) => {
  fetch('https://api.covid19api.com/world')
    .then(async (response) => {
      dispatch({
        type: AppActions.SET_GLOBAL_COVID_DATA,
        payload: {
          isFetch: true,
          isError: false,
          data: await response.json(),
        },
      });
    })
    .catch((error) => {
      dispatch({
        type: AppActions.SET_GLOBAL_COVID_DATA,
        payload: { isFetch: true, isError: true, data: error },
      });
    });
};
