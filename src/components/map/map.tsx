import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, GeoJSON } from 'react-leaflet';
import { setActiveCountry } from '@store';
import { IAppState } from '@types';
import 'leaflet/dist/leaflet.css';
import './map.css';
import geoJson from './countries.json';
import L, { Layer } from 'leaflet';
import { getStatsOnCurrentOptions } from '@utils';
import Legend from './legend';

interface IGeoFeature {
  type: string;
  properties: {
    iso_a2: string;
    name: string;
  };
  geometry: {
    coordinates: number[];
    type: string;
  };
}

export const Map = () => {
  const dispatch = useDispatch();
  const setCountry = (name: string) => dispatch(setActiveCountry(name));
  const intensivity = useSelector((state: IAppState) => state.intensivity);
  const covidAllCountries = useSelector(
    (state: IAppState) => state.covidAllCountries
  );
  const selectedCountry = useSelector(
    (state: IAppState) => state.selectedCountry
  );
  const selectedOptions = useSelector(
    (state: IAppState) => state.selectedOptions
  );

  const [intensivityItem, optionKey]: any = getStatsOnCurrentOptions(
    intensivity,
    selectedOptions
  );

  const labelPerCountry = (feature: any) => {
    const alpha2Code = feature.properties.iso_a2;
    const name = feature.properties.name;
    const data = covidAllCountries[alpha2Code];
    let covidInfo = '';
    if (data) {
      const [stats, status] = getStatsOnCurrentOptions(
        covidAllCountries[alpha2Code],
        selectedOptions
      );
      covidInfo = `${status}: ${stats}`;
    } else {
      covidInfo = 'No data';
    }
    return `<div>${name}</div><div class="uc-first">${covidInfo}</div>`;
  };

  const onEachCountry = (feature: any, layer: Layer) => {
    const alpha2Code = feature.properties.iso_a2;

    if (alpha2Code === selectedCountry) {
      layer.bindTooltip(() => labelPerCountry(feature), { permanent: true });
    } else {
      layer.bindTooltip(() => labelPerCountry(feature));
    }

    (layer as any).setStyle({
      fillColor: '#FEB24C',
      fillOpacity: 1,
      color: 'red',
      weight: 1,
    });

    layer.on({
      click: () => {
        if (covidAllCountries[alpha2Code]) {
          setCountry(alpha2Code);
        }
      },
    });

    if (covidAllCountries[alpha2Code]) {
      const [current, option]: any = getStatsOnCurrentOptions(
        covidAllCountries[alpha2Code],
        selectedOptions
      );

      const colorIndex = intensivityItem.findIndex(
        (item: any) => current <= item
      );

      let color = '#FEB24C';
      switch (colorIndex) {
        case -1:
        case 4: {
          color = '#800026';
          break;
        }
        case 3: {
          color = '#BD0026';
          break;
        }
        case 2: {
          color = '#E31A1C';
          break;
        }
        case 1: {
          color = '#FC4E2A';
          break;
        }
        case 0: {
          color = '#FEB24C';
          break;
        }
      }

      (layer as any).setStyle({
        fillColor: color,
      });
    }
  };

  const southWest = L.latLng(-83.27770503961696, -243.98437500000003);
  const northEast = L.latLng(83.27770503961696, 244.68750000000003);
  const bounds = L.latLngBounds(southWest, northEast);

  const key = JSON.stringify(selectedOptions) + (selectedCountry || 'null');
  return (
    <div className="map-container">
      <MapContainer
        style={{ height: '100%', width: '100%' }}
        center={[0, 0]}
        zoom={1}
        maxZoom={3}
        minZoom={1}
        maxBounds={bounds}
      >
        <GeoJSON
          key={key}
          data={geoJson as any}
          onEachFeature={onEachCountry}
        />

        <Legend intensivity={intensivityItem} />
      </MapContainer>
    </div>
  );
};
