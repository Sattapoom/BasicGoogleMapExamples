import { Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

export default function Ex05Routing() {
  const position = { lat: 13.75, lng: 100.55 };
  const zoomLv = 11;
  return (
    <div className="p-10 w-full h-full">
      <Map
        defaultZoom={zoomLv}
        defaultCenter={position}
        mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
      >
        <Directions />
      </Map>
    </div>
  );
}

const Directions = () => {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);

  useEffect(() => {
    if (!routesLib || !map) return;
    setDirectionsService(new routesLib.DirectionsService());
    setDirectionsRenderer(new routesLib.DirectionsRenderer({ map }));
  }, [routesLib, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;
    directionsService
      .route({
        origin: { lat: 13.748286022129484, lng: 100.53930182507276 },
        destination: { lat: 13.753903752856667, lng: 100.50656441936519 },
        travelMode: google.maps.TravelMode.DRIVING,
        // travelMode: "TWO_WHEELER" as google.maps.TravelMode,
        provideRouteAlternatives: true,
      })
      .then((resp) => {

        directionsRenderer.setDirections(resp);
        directionsRenderer.setOptions({ polylineOptions: { strokeColor: "#FF06AA" } });
        // directionsRenderer.setRouteIndex(1)
        setRoutes(resp.routes);
      });
  }, [directionsService, directionsRenderer]);

  console.log(routes);

  return null;
};
