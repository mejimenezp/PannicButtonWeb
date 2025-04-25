import { useEffect, useRef } from 'react';
import '../assets/css/mapa.css';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

const containerStyle = {
  width: '100%',
  height: '100%',
};
const randomOffset = () => (Math.random() - 0.5) * 0.0001;

const MapaUsuarios = ({ usuarios, googleMapsApiKey }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const boundsRef = useRef(null);

  useEffect(() => {
    const initMap = async () => {
      if (!window.google || !mapRef.current || !usuarios.length) return;

      const { Map, Marker, InfoWindow, LatLngBounds } = window.google.maps;

      // Crear la instancia del mapa de Google Maps
      mapInstance.current = new Map(mapRef.current, {
        zoom: 6, // Nivel de zoom inicial
      });

      boundsRef.current = new LatLngBounds();

      const markers = usuarios.map((u) => {
        if (!u.Latitud || !u.Longitud) return null;

        const lat = parseFloat(u.Latitud) + randomOffset();
        const lng = parseFloat(u.Longitud) + randomOffset();
        const position = { lat, lng };

        const marker = new Marker({
          map: mapInstance.current,
          position,
          title: u.Usua_Name,
        });

        boundsRef.current.extend(position);

        const infoWindow = new InfoWindow({
          content: `<div>
            <strong>${u.Usua_Name}</strong><br />
            ${u.Usua_Email}<br />
            ${u.Departamento}, ${u.Ciudad}, ${u.Vereda}
          </div>`,
        });

        marker.addListener("click", () => {
          infoWindow.open(mapInstance.current, marker);
        });

        return marker;
      }).filter(Boolean); // Filtrar posibles nulls

      // Crear el MarkerClusterer para agrupar los marcadores cercanos
      new MarkerClusterer({ map: mapInstance.current, markers });

      // Ajustar el centro y zoom automáticamente para que todos los marcadores sean visibles
      mapInstance.current.fitBounds(boundsRef.current);
    };

    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=marker&v=weekly`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }
  }, [usuarios, googleMapsApiKey]);

  return <div ref={mapRef} style={containerStyle} />;
};

export default MapaUsuarios;
