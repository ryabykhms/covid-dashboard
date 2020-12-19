import * as React from 'react';
import './reset.css';
import './main.css';

import {
  CountryList,
  MainStats,
  ChartComponent,
  Map,
  StatsTable,
  Footer,
  Header,
} from "@components";

import '../../css-variables/css-variables.css'

export const MainPage = () => {
    return (
        <>
          <Header />
            <div className='main__wrapper'>
              <div className='main__left-column'>
                <MainStats />
                <CountryList />
              </div>
              <Map />
              <div className='main__right-column'>
                <StatsTable />
                <ChartComponent />
              </div>
            </div>
          <Footer />
        </>
    )
}
