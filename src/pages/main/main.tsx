import * as React from 'react';
import './reset.css';
import './main.css';
import {
  CountryList,
  MainStats,
  Chart,
  Map,
  StatsTable,
  Footer,
  Header,
} from "@components";

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
                <Chart />
                <StatsTable />
              </div>
            </div>
          <Footer />
        </>
    )
}
