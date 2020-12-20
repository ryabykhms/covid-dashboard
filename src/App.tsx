import { useEffect } from 'react';
import { connect } from 'react-redux';
import { MainPage } from '@pages';
import { Loader } from '@components';
import { loadCountries, loadCovidInfo, loadGlobalCovidData } from '@store';
import { IAppState, IAppComponentProps } from '@types';
import './App.css';

function AppComponent({
  isCountriesLoaded,
  isCovidLoaded,
  isGlobalCovidDataLoaded,
  loadCountries,
  loadCovidInfo,
  loadGlobalCovidData,
}: IAppComponentProps) {
  useEffect(() => {
    if (!isCountriesLoaded) {
      loadCountries();
    }
  }, []);

  useEffect(() => {
    if (isCountriesLoaded && !isCovidLoaded) {
      loadCovidInfo();
    }
  }, [isCountriesLoaded]);

  useEffect(() => {
    if (isCovidLoaded && !isGlobalCovidDataLoaded) {
      loadGlobalCovidData();
    }
  }, [isCovidLoaded]);

  return isCountriesLoaded && isCovidLoaded ? <MainPage /> : <Loader />;
}

const mapStateToProps = (state: IAppState) => ({
  isCountriesLoaded: state.isCountriesLoaded,
  isCovidLoaded: state.isCovidLoaded,
  isGlobalCovidDataLoaded: state.isGlobalCovidDataLoaded,
});

const mapDispatchToProps = (dispatch: any) => ({
  loadCountries: () => dispatch(loadCountries()),
  loadCovidInfo: () => dispatch(loadCovidInfo()),
  loadGlobalCovidData: () => dispatch(loadGlobalCovidData()),
});

export const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);
