import React, { useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';

const fetchCoordinates = async (location) => {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);
  const data = await response.json();
  if (data && data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };
  } else {
    throw new Error('Location not found');
  }
};

const EventMap = ({ location }) => {
  const mapRef = useRef(null);

  const { data, error, isLoading } = useQuery({
    queryKey: ['locationCoordinates', location],
    queryFn: () => fetchCoordinates(location),
    enabled: !!location, // Only run the query if the location is provided
  });

  useEffect(() => {
    if (data && mapRef.current) {
      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([data.lon, data.lat]),
          zoom: 16,
        }),
      });

      const marker = new Feature({
        geometry: new Point(fromLonLat([data.lon, data.lat])),
      });

      marker.setStyle(new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: '/marker.png',
          scale: 0.08,
        }),
      }));

      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: [marker],
        }),
      });

      map.addLayer(vectorLayer);

      // Cleanup map on unmount
      return () => map.setTarget(null);
    }
  }, [data]);

  if (isLoading) return <div className='text-black'>Loading...</div>;
  if (error) return <div className='text-red-500'>Error: {error.message}</div>;

  return <div ref={mapRef} className="w-full h-64 rounded-lg overflow-hidden" />;
};

export default EventMap;