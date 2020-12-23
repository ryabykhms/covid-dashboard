import { ICountry, ICountryCovidItem } from '@types';
import { func, storage } from '@utils';
import {
  getIntensivity,
  getCoutriesSameFromCovid,
  calcEarthPopulation,
  calcPer100,
} from '@api';

export const DISEASE = {
  globalData: {
    url: 'https://disease.sh/v3/covid-19/historical/all?lastdays=400',
    params: { countries: [] },
    handler: (data: any) => globalDataHandler(data),
  },

  summary: {
    url: 'https://disease.sh/v3/covid-19/countries',
    params: { countries: [] },
    handler: (data: any, addData: any) => summaryDataHandler(data, addData),
  },

  country: {
    url: 'https://disease.sh/v3/covid-19/historical/{country}?lastdays=400',
    params: { country: null, population: 0 },
    handler: (data: any) => countryDataHandler(data),
  },

  globalSummary: {
    url: 'https://disease.sh/v3/covid-19/all',
  },
};

function countryDataHandler(data: any) {
  const { population } = DISEASE.country.params;
  const selectedData = formatGlobalCovidData(
    population,
    data.timeline,
    data.country
  );

  return selectedData;
}

function globalDataHandler(data: any) {
  const { countries } = DISEASE.globalData.params;
  let globalCovidData = null;
  let population = calcEarthPopulation(countries);
  globalCovidData = formatGlobalCovidData(population, data);
  return globalCovidData;
}

function summaryDataHandler(data: any, globalData: any) {
  const { countries } = DISEASE.summary.params;
  let covidAllCountries = {};
  let intensivity = {};
  let covidGlobal = [];
  let validCountries: Array<ICountry> = countries;

  const fetchDate = new Date().getTime().toString();
  const population = calcEarthPopulation(countries);

  covidAllCountries = formatDataFromFetch(countries, data);
  intensivity = getIntensivity(covidAllCountries);

  validCountries = getCoutriesSameFromCovid(covidAllCountries, countries);

  covidGlobal = formatGlobalFromFetch(population, globalData);

  storage.population.set(population);
  storage.countries.set(validCountries);
  storage.covidData.set(covidAllCountries);
  storage.covidGlobal.set(covidGlobal);
  storage.lastFetchDate.set(fetchDate);
  storage.intensivity.set(intensivity);

  return { covidAllCountries, validCountries, covidGlobal, intensivity };
}

function formatDataFromFetch(countries: ICountry[], data: any) {
  const countriesObject = countries.reduce((acc: object, country: ICountry) => {
    return {
      ...acc,
      [country.alpha2Code.toUpperCase()]: country.population,
    };
  }, {});

  const covidData = data.reduce((acc: Object, country: any) => {
    if (!countriesObject[country.countryInfo.iso2]) {
      return { ...acc };
    }

    const population = countriesObject[country.countryInfo.iso2];

    const countryObject = {
      [country.countryInfo.iso2]: createCovidInfoObject(population, country),
    };

    return {
      ...acc,
      ...countryObject,
    };
  }, {});

  return covidData;
}

function createCovidInfoObject(population: number, info: any): any {
  const obj = {
    population,
    total: {
      confirmed: info.cases,
      deaths: info.deaths,
      recovered: info.recovered,
    },

    totalPer100: {
      confirmed: Math.round(info.casesPerOneMillion / 10),
      deaths: Math.round(info.deathsPerOneMillion / 10),
      recovered: Math.round(info.recoveredPerOneMillion / 10),
    },

    lastDay: {
      confirmed: info.todayCases,
      deaths: info.todayDeaths,
      recovered: info.todayRecovered,
    },

    lastDayPer100: calcPer100(
      population,
      info.todayCases,
      info.todayDeaths,
      info.todayRecovered
    ),
  };

  return obj;
}

function getNew(prev: number | undefined, current: number) {
  if (!prev) {
    return current;
  }

  const diff = Math.abs(current - prev);

  return diff;
}

function formatGlobalCovidData(population: number, data: any, country?: any) {
  const dates = Object.keys(data.cases);

  const result = dates.map((date, i) => {
    const lastDay = new Date(date);
    const prev = dates[i - 1] ? dates[i - 1] : 0;
    const newData = {
      NewConfirmed: getNew(data.cases[prev], data.cases[date]),
      NewDeaths: getNew(data.deaths[prev], data.deaths[date]),
      NewRecovered: getNew(data.recovered[prev], data.recovered[date]),
    };

    let dataCountry = {};
    if (country) {
      dataCountry = {
        Country: country,
      };
    }

    return {
      Confirmed: data.cases[date],
      Deaths: data.deaths[date],
      Recovered: data.recovered[date],
      ConfirmedPer100: func.calcPer100Thousand(population, data.cases[date]),
      DeathsPer100: func.calcPer100Thousand(population, data.deaths[date]),
      RecoveredPer100: func.calcPer100Thousand(
        population,
        data.recovered[date]
      ),
      ...newData,
      NewConfirmedPer100: func.calcPer100Thousand(
        population,
        newData.NewConfirmed
      ),
      NewDeathsPer100: func.calcPer100Thousand(population, newData.NewDeaths),
      NewRecoveredPer100: func.calcPer100Thousand(
        population,
        newData.NewRecovered
      ),
      ...dataCountry,
      Date: lastDay,
    };
  });

  return result;
}

function formatGlobalFromFetch(population: number, global: any) {
  return createCovidInfoObject(population, global);
}
