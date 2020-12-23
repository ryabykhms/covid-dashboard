import { ICountry, ICountryCovidItem } from '@types';
import { func, storage } from '@utils';

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

function compareFields(field1: any, field2: any) {
  const field = field1.slice();

  if (field2 < field1[0]) {
    field[0] = field2;
  }

  if (field2 > field1[1]) {
    field[1] = field2;
  }
  return field;
}

function compare(object1: any, object2: any) {
  const result = { ...object1 };

  result.confirmed = compareFields(object1.confirmed, object2.confirmed);
  result.deaths = compareFields(object1.deaths, object2.deaths);
  result.recovered = compareFields(object1.recovered, object2.recovered);

  return result;
}

function range(size: number, obj: any) {
  const result = Object.keys(obj).reduce((acc: object, key: string) => {
    const [min, max] = obj[key];
    const step = Math.round((max - min) / size);

    return {
      ...acc,
      [key]: Array(size)
        .fill(0)
        .map((_, idx) => min + idx * step),
    };
  }, {});

  return result;
}

function rangeIntensivity(size: number, intensivity: any) {
  const obj = {
    total: range(size, intensivity.total),
    totalPer100: range(size, intensivity.totalPer100),
    lastDay: range(size, intensivity.lastDay),
    lastDayPer100: range(size, intensivity.lastDayPer100),
  };

  return obj;
}

function getIntensivity(covidAllCountries: any) {
  const max = Number.MAX_SAFE_INTEGER;
  const init = {
    confirmed: [max, 0],
    deaths: [max, 0],
    recovered: [max, 0],
  };
  let intensivity: any = {
    total: { ...init },
    totalPer100: { ...init },
    lastDay: { ...init },
    lastDayPer100: { ...init },
  };

  Object.keys(covidAllCountries).forEach((key) => {
    const country = covidAllCountries[key];
    intensivity.total = compare(intensivity.total, country.total);
    intensivity.totalPer100 = compare(
      intensivity.totalPer100,
      country.totalPer100
    );
    intensivity.lastDay = compare(intensivity.lastDay, country.lastDay);
    intensivity.lastDayPer100 = compare(
      intensivity.lastDayPer100,
      country.lastDayPer100
    );
  });

  const RANGE_SIZE = 5;

  intensivity = rangeIntensivity(RANGE_SIZE, { ...intensivity });

  return intensivity;
}

function getCoutriesSameFromCovid(
  covidAllCountries: any,
  countries: Array<ICountry>
) {
  return countries.filter((country: ICountry) => {
    return covidAllCountries[country.alpha2Code.toUpperCase()] !== undefined;
  });
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

function calcEarthPopulation(countries: any) {
  return countries.reduce((sum: number, country: any) => {
    return sum + country.population;
  }, 0);
}
