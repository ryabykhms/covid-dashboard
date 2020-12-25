import * as React from 'react';
import './full-screen-mode.css';
import expand from './image/expand.svg';
import { VoidSubscriberFullScreenMode } from "@types";

export const FullScreenMode = ( { click } : VoidSubscriberFullScreenMode) => {

  return <div className='full-screen' onClick={ click }>
    <img src={ expand } width={ 25 } height={ 25 } alt=""/>
  </div>
}
