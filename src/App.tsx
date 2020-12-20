import { useEffect } from 'react';
import { connect } from 'react-redux';
import { MainPage } from '@pages';
import { Loader } from '@components';
import { loadCountries, loadCovidInfo } from '@store';
import { IAppState, IAppComponentProps } from '@types';
import './App.css';

function AppComponent({
  isCountriesLoaded,
  isCovidLoaded,
  loadCountries,
  loadCovidInfo,
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

  return isCountriesLoaded && isCovidLoaded ? <MainPage /> : <Loader />;
}

const mapStateToProps = (state: IAppState) => ({
  isCountriesLoaded: state.isCountriesLoaded,
  isCovidLoaded: state.isCovidLoaded,
});

const mapDispatchToProps = (dispatch: any) => ({
  loadCountries: () => dispatch(loadCountries()),
  loadCovidInfo: () => dispatch(loadCovidInfo()),
});

export const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);
