import React, { useEffect, useRef } from 'react';
import * as atlas from 'azure-maps-control';
import 'azure-maps-control/dist/atlas.min.css';
import "../assets/css/mapa.css";

const AzureMapaUsuarios = ({ usuarios, azureMapsKey }) => {
  const mapRef = useRef(null);

  // Función para generar una pequeña variación
  const randomOffset = () => (Math.random() - 0.5) * 0.001;

  useEffect(() => {
    if (!mapRef.current || !azureMapsKey) return;

    const map = new atlas.Map(mapRef.current, {
      center: [-74.2973, 4.5709], // Colombia centro
      zoom: 6,
      authOptions: {
        authType: atlas.AuthenticationType.subscriptionKey,
        subscriptionKey: azureMapsKey,
      },
    });

    map.events.add('ready', () => {
      const dataSource = new atlas.source.DataSource();
      map.sources.add(dataSource);

      usuarios
        .filter((u) => u.Latitud && u.Longitud)
        .forEach((u) => {
          const lat = parseFloat(u.Latitud) + randomOffset();
          const lon = parseFloat(u.Longitud) + randomOffset();

          console.log(u.Usua_Name, lat, lon); // Para verificar

          const point = new atlas.data.Point([lon, lat]);
          const properties = {
            title: u.Usua_Name,
            description: `${u.Usua_Email}<br/>${u.Departamento}, ${u.Ciudad}`,
          };
          dataSource.add(new atlas.data.Feature(point, properties));
        });

      map.layers.add(
        new atlas.layer.SymbolLayer(dataSource, null, {
          iconOptions: {
            image: 'pin-round-darkblue',
            anchor: 'center',
            allowOverlap: true,
          },
          textOptions: {
            textField: ['get', 'title'],
            offset: [0, 1.5],
          },
        })
      );

      map.popups.add(new atlas.Popup(), true);

      map.events.add('click', mapRef.current, (e) => {
        const shapes = map.layers.getRenderedShapes(e.position);
        if (shapes.length > 0 && shapes[0].getProperties) {
          const props = shapes[0].getProperties();
          const position = shapes[0].getGeometry().coordinates;
          map.popups.clear();
          map.popups.add(
            new atlas.Popup({
              position,
              content: `<div><strong>${props.title}</strong><br/>${props.description}</div>`,
            })
          );
        }
      });
    });

    return () => map.dispose();
  }, [usuarios, azureMapsKey]);

  return (
    <div
      ref={mapRef}
      style={{
        height: '400px',
        width: '600px',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        margin: 'auto',
      }}
    />
  );
};

export default AzureMapaUsuarios;
