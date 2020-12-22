import * as React from "react";
import './tooltip.css';


export const TooltipTemplate = (info: any) => {
  return (
    <div className="state-tooltip tooltip">
      <span>{info.point.value}</span>
      <span>
        {info.point.data.Date.toLocaleString(
          'en-US',
          {year: 'numeric', month: '2-digit', day: '2-digit'}
        )}
      </span>
    </div>
  );
}
