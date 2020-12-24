import * as React from 'react';
import './chart.css';
import Chart, {
  ArgumentAxis,
  Series,
  CommonSeriesSettings,
  CommonAxisSettings,
  Grid,
  Format,
  Label,
  ValueAxis,
  Tooltip,
  AdaptiveLayout,
} from 'devextreme-react/chart';
import {useDispatch, useSelector} from 'react-redux';
import { IAppState, IColorChart } from '@types';
import { getOnCurrentOptionsChart } from '@utils';
import { TooltipTemplate } from './tooltip';
import {useRef} from "react";
import {setFullScreenElementValue} from "@store";
import {FullScreenMode} from "../full-screen-mode";
import {render} from "react-dom";
import { NoData } from '@components';


const COLOR_CHART: IColorChart = {
  Confirmed: '#FF0000',
  Deaths: '#ffffff',
  Recovered: '#329D27',
  ConfirmedPer100: '#FF0000',
  DeathsPer100: '#ffffff',
  RecoveredPer100: '#329D27',
  NewConfirmed: '#FF0000',
  NewDeaths: '#ffffff',
  NewRecovered: '#329D27',
  NewConfirmedPer100: '#FF0000',
  NewDeathsPer100: '#ffffff',
  NewRecoveredPer100: '#329D27',
};

export const ChartComponent = () => {
  const selectedData = useSelector((state: IAppState) => state.selectedData);
  const isCountryCovidDataFailed = useSelector(
    (state: IAppState) => state.isCountryCovidDataFailed
  );
  const isCountryCovidDataLoaded = useSelector(
    (state: IAppState) => state.isCountryCovidDataLoaded
  );

  const isFullScreen = useSelector((state: IAppState) => state.fullScreenElement);
console.log(isFullScreen)

  const dataWithDates = (selectedData || []).map(
    ({ Date: date, ...props }) => ({
      ...props,
      Date: new Date(date),
    })
  );
  const selectedOptions = useSelector(
    (state: IAppState) => state.selectedOptions
  );
  const currentSelected = getOnCurrentOptionsChart(selectedOptions);
  const colorChart: string = COLOR_CHART[currentSelected as keyof IColorChart];

  const chart = useRef(null);
  const dispatch = useDispatch();

  const toggle = () => {
    dispatch(setFullScreenElementValue());

    (chart.current as unknown as HTMLElement).classList.toggle('chart__fullscreen');
  }

  return (

    <div className="chart" ref={chart}>
      {!isCountryCovidDataLoaded ? (
        'Loading...'
      ) : isCountryCovidDataFailed ? (
        <NoData />
      ) : (
      <React.Fragment>
        <FullScreenMode click={ toggle } />
        <Chart dataSource={dataWithDates} id="chart-country">
          <CommonSeriesSettings argumentField="Date" type="spline" />
          <CommonAxisSettings color="#ffffff">
            <Grid visible={true} />
          </CommonAxisSettings>
          <Series
            valueField={`${currentSelected}`}
            name={`${currentSelected}`}
            color={colorChart}
          />
          <ArgumentAxis>
            <Label font={{ color: '#ffffff' }}>
              <Format type="shortDate" />
            </Label>
          </ArgumentAxis>

          <ValueAxis allowDecimals>
            <Label font={{ color: '#ffffff' }}>
              <Format type="largeNumber" />
            </Label>
          </ValueAxis>
          <Tooltip enabled={true} contentRender={TooltipTemplate} />
          <AdaptiveLayout
            keepLabels={false}
            width={100}
          />
        </Chart>
      </React.Fragment>
        )}
    </div>
  );
};
