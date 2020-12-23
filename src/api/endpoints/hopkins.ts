import { ICountry, ICountryCovidItem } from '@types';
import { func, storage } from '@utils';
import {
  getIntensivity,
  getCoutriesSameFromCovid,
  calcEarthPopulation,
  calcPer100,
} from '@api';

export const HOPKINS = {
  globalData: {
    url: 'https://api.covid19api.com/world',
    params: { countries: [] },
    handler: (data: any) => globalDataHandler(data),
  },

  summary: {
    url: 'https://api.covid19api.com/summary',
    params: { countries: [] },
    handler: (data: any) => summaryDataHandler(data),
  },

  country: {
    url: 'https://api.covid19api.com/country/{country}',
    params: { country: null, population: 0 },
    handler: (data: any) => countryDataHandler(data),
  },
};

function countryDataHandler(data: any) {
  const { population } = HOPKINS.country.params;

  const selectedData = formatCovidData(population, data);

  return selectedData;
}

function addNewAndPer100ThousandData(
  population: number,
  props: ICountryCovidItem,
  prevDayProps: ICountryCovidItem
) {
  if (!prevDayProps) {
    return {};
  }

  const NewConfirmed = props.Confirmed - prevDayProps.Confirmed;
  const NewDeaths = props.Deaths - prevDayProps.Deaths;
  const NewRecovered = props.Recovered - prevDayProps.Recovered;

  const result = {
    ConfirmedPer100: func.calcPer100Thousand(population, props.Confirmed),
    DeathsPer100: func.calcPer100Thousand(population, props.Deaths),
    RecoveredPer100: func.calcPer100Thousand(population, props.Recovered),
    NewConfirmed,
    NewDeaths,
    NewRecovered,
    NewConfirmedPer100: func.calcPer100Thousand(population, NewConfirmed),
    NewDeathsPer100: func.calcPer100Thousand(population, NewDeaths),
    NewRecoveredPer100: func.calcPer100Thousand(population, NewRecovered),
  };

  return result;
}

function formatCovidData(population: number, data: ICountryCovidItem[]) {
  return data.map(({ Date: date, ...props }, i) => ({
    ...props,
    ...addNewAndPer100ThousandData(population, data[i], data[i - 1]),
    Date: new Date(date),
  }));
}

function createCovidInfoObject(population: number, info: any): any {
  const obj = {
    population,
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

function summaryDataHandler(data: any) {
  const { countries } = HOPKINS.summary.params;
  let covidAllCountries = {};
  let intensivity = {};
  let covidGlobal = [];
  let validCountries: Array<ICountry> = countries;

  const fetchDate = new Date().getTime().toString();
  const population = calcEarthPopulation(countries);

  covidAllCountries = formatDataFromFetch(countries, data.Countries);
  intensivity = getIntensivity(covidAllCountries);

  validCountries = getCoutriesSameFromCovid(covidAllCountries, countries);

  covidGlobal = formatGlobalFromFetch(population, data.Global);

  storage.population.set(population);
  storage.countries.set(validCountries);
  storage.covidData.set(covidAllCountries);
  storage.covidGlobal.set(covidGlobal);
  storage.lastFetchDate.set(fetchDate);
  storage.intensivity.set(intensivity);

  return { covidAllCountries, validCountries, covidGlobal, intensivity };
}

function formatGlobalFromFetch(population: number, global: any) {
  return createCovidInfoObject(population, global);
}

function getDatePrev(lastDay: Date, countDays: number) {
  const prevDate = new Date();
  prevDate.setTime(lastDay.getTime());
  prevDate.setDate(prevDate.getDate() - countDays);
  return prevDate;
}

function formatGlobalCovidData(population: number, data: any[]) {
  const lastDay = new Date();
  const length = data.length;
  const sortData = data.slice();
  sortData.sort((a, b) => a.TotalConfirmed - b.TotalConfirmed);
  return sortData.map((infoByDay, i) => {
    const date = getDatePrev(lastDay, length - i);
    return {
      Confirmed: infoByDay.TotalConfirmed,
      Deaths: infoByDay.TotalDeaths,
      Recovered: infoByDay.TotalRecovered,
      ConfirmedPer100: func.calcPer100Thousand(
        population,
        infoByDay.TotalConfirmed
      ),
      DeathsPer100: func.calcPer100Thousand(population, infoByDay.TotalDeaths),
      RecoveredPer100: func.calcPer100Thousand(
        population,
        infoByDay.TotalRecovered
      ),
      NewConfirmed: infoByDay.NewConfirmed,
      NewDeaths: infoByDay.NewDeaths,
      NewRecovered: infoByDay.NewRecovered,
      NewConfirmedPer100: func.calcPer100Thousand(
        population,
        infoByDay.NewConfirmed
      ),
      NewDeathsPer100: func.calcPer100Thousand(population, infoByDay.NewDeaths),
      NewRecoveredPer100: func.calcPer100Thousand(
        population,
        infoByDay.NewRecovered
      ),
      Date: date,
    };
  });
}

function globalDataHandler(data: any) {
  const { countries } = HOPKINS.globalData.params;
  let globalCovidData = null;
  let population = calcEarthPopulation(countries);
  globalCovidData = formatGlobalCovidData(population, data);
  return globalCovidData;
}
