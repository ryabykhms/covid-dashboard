import { useEffect } from "react";
import './App.css';
import { MainPage } from '@pages';
import { Loader } from "@components";
import {
  loadCountries,
} from './store';
import { connect } from 'react-redux';
import {
  IAppState,
  IAppComponentProps,
} from './types';


function AppComponent({ isCountriesLoaded, loadCountries }: IAppComponentProps) {
  useEffect(() => {
    if (!isCountriesLoaded) {
      loadCountries();
    }
  }, []);

  return (
    isCountriesLoaded
      ? <MainPage />
      : <Loader />
  );
}

const mapStateToProps = (state: IAppState) => ({
  isCountriesLoaded: state.isCountriesLoaded
});

const mapDispatchToProps = (dispatch: any) => ({
  loadCountries: () => dispatch(loadCountries())
});

export const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);
