import * as React from 'react';
import './chart.css';

import Chart, {
  ArgumentAxis,
  Series,
  Legend
} from 'devextreme-react/chart';

const data = [{
  arg: 1990,
  val: 5320816667
}, {
  arg: 2000,
  val: 6127700428
}, {
  arg: 2010,
  val: 6916183482
}];

export const ChartComponent = () => {
  return <div className='chart'>
    <Chart dataSource={data}>
      <Series type="bar" />
      <Legend visible={false} />
    </Chart>
  </div>
}
