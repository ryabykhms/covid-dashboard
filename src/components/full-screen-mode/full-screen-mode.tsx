import * as React from 'react';
import './full-screen-mode.css';
import expand from './image/expand.svg'

export const FullScreenMode = ({ click }: any) => {

  return <div className='full-screen' onClick={click}>
    <img src={expand} width={25} height={25} alt=""/>
  </div>
}
