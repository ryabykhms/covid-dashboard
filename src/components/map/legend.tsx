import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

const Legend = ({ intensivity }: any) => {
  const map = useMap();

  useEffect((): any => {
    const getColor = (d: any) => {
      switch (d) {
        case 4: {
          return '#800026';
        }
        case 3: {
          return '#BD0026';
        }
        case 2: {
          return '#E31A1C';
        }
        case 1: {
          return '#FC4E2A';
        }
        case 0: {
          return '#FEB24C';
        }
      }
    };

    const legend = L.control.attribution({ position: 'bottomleft' });

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      let labels: any = [];
      let from;
      let to;

      if (intensivity) {
        intensivity.forEach((item: any, i: any) => {
          from = item;
          to = intensivity[i + 1];

          labels.push(
            '<i style="background:' +
              getColor(i) +
              '"></i> ' +
              from +
              (to ? '&ndash;' + to : '+')
          );
        });
      }

      div.innerHTML = labels.join('<br>');
      return div;
    };

    legend.addTo(map);
    return () => legend.remove();
  });
  return null;
};

export default Legend;
