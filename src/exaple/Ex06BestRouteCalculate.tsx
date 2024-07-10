import {
  AdvancedMarker,
  Map,
  MapMouseEvent,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

export default function Ex06BestRouteCalculate() {
  const EBikePosition = {
    lat: 13.75,
    lng: 100.55,
  } as google.maps.LatLngLiteral;
  const zoomLv = 11;

  const [locations, setLocations] = useState<google.maps.LatLngLiteral[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);

  const onClickMap = (e: MapMouseEvent) => {
    const newPos = e.detail.latLng;
    if (newPos != null) {
      if (locations.includes(newPos)) return;
      setLocations([...locations, newPos]);
      setIsCalculated(false);
    }
  };

  const reNewLocations = (l: google.maps.LatLngLiteral[]) => {
    setLocations(l);
    setIsCalculated(true);
  };

  return (
    <div className="p-10 w-full h-full">
      <Calculation
        locations={locations}
        reNewLocations={reNewLocations}
        origin={EBikePosition}
      />
      <Map
        defaultZoom={zoomLv}
        defaultCenter={EBikePosition}
        mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
        onClick={onClickMap}
        disableDefaultUI={true}
      >
        <AdvancedMarker position={EBikePosition} className=" text-3xl">
          🏍️
        </AdvancedMarker>
        <Pins locations={locations} isCalculated={isCalculated} />
        {isCalculated && (
          <Directions markers={locations} origin={EBikePosition} />
        )}
      </Map>
    </div>
  );
}

const Pins = ({
  locations,
  isCalculated,
}: {
  locations: google.maps.LatLngLiteral[];
  isCalculated: boolean;
}) => {
  return (
    <>
      {locations.map((pos, index) => {
        return (
          <AdvancedMarker key={index} position={pos}>
            <div
              className={`flex justify-center items-center rounded-full ${isCalculated
                ? "bg-green-500 border-green-900"
                : "bg-red-500 border-red-900"
                } border-2 w-8 h-8`}
            >
              <div className="text-xl">{index + 1}</div>
            </div>
          </AdvancedMarker>
        );
      })}
    </>
  );
};

interface CalculationProps {
  locations: google.maps.LatLngLiteral[];
  origin: google.maps.LatLngLiteral;
  reNewLocations: (l: google.maps.LatLngLiteral[]) => void;
}

const Calculation: React.FC<CalculationProps> = ({
  locations,
  origin,
  reNewLocations,
}) => {
  const geoCodeLib = useMapsLibrary("geocoding");
  const map = useMap();

  const [waitForCalculate, setWaitForCalculate] = useState(false);

  const [dtMatrix, setDTMatrix] =
    useState<google.maps.DistanceMatrixService | null>(null);

  useEffect(() => {
    if (!map || !geoCodeLib) return;
    setDTMatrix(new google.maps.DistanceMatrixService());
  }, [map, geoCodeLib, locations]);

  const onClickCalculate = async () => {
    const unOrdered: google.maps.LatLngLiteral[] = [...locations.slice()];
    console.log(unOrdered, "Unordered");
    setWaitForCalculate(true);
    await reOrderLocations(origin, unOrdered).then((bestOrdered) => {
      console.log(bestOrdered, "Ordered");
      reNewLocations(bestOrdered);
      setWaitForCalculate(false);
    });
  };

  const reOrderLocations = async (
    o: google.maps.LatLngLiteral,
    d: google.maps.LatLngLiteral[]
  ): Promise<google.maps.LatLngLiteral[]> => {
    let result = d;

    if (!dtMatrix || !map || d.length === 0) {
      return [];
    }

    const request = {
      origins: [o],
      destinations: d,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: true,
      avoidTolls: true,
    };

    let bestDistanceIndex = 0;
    let bestDurationIndex = 0;

    await dtMatrix.getDistanceMatrix(request).then(async (response) => {
      if (response && response.rows && response.rows.length > 0) {
        const durationAndDistances = response.rows[0].elements;

        let bestDistance =
          durationAndDistances[bestDistanceIndex].distance.value;
        let bestDuration =
          durationAndDistances[bestDurationIndex].duration.value;

        durationAndDistances.forEach((item, index) => {
          if (bestDistance > item.distance.value) {
            bestDistanceIndex = index;
            bestDistance = item.distance.value;
          }
          if (bestDuration > item.duration.value) {
            bestDurationIndex = index;
            bestDuration = item.duration.value;
          }
        });
      }

      let bestNextLocation = d[bestDistanceIndex];

      if (bestDistanceIndex !== bestDurationIndex) {
        bestNextLocation = d[bestDurationIndex];
      }

      let nextCalculations: google.maps.LatLngLiteral[] = [];

      d.forEach((item) => {
        if (bestNextLocation !== item) {
          nextCalculations.push(item);
        }
      });

      console.log({ bestNextLocation, nextCalculations });

      await reOrderLocations(bestNextLocation, nextCalculations).then((r) => {
        result = [bestNextLocation, ...r];
      });
    });

    return result;
  };

  return (
    <div className="w-full flex justify-end">
      <div
        onClick={() => {
          if (waitForCalculate) return;
          onClickCalculate();
        }}
        className={`absolute z-50 p-1 m-2 flex flex-col items-center rounded-2xl ${waitForCalculate
          ? "bg-gray-400 p-2"
          : "bg-amber-400 active:bg-orange-200"
          } select-none`}
      >
        {waitForCalculate ? (
          <>
            <span>Calculating ... </span>
          </>
        ) : (
          <>
            <span>Calculate</span>
            <span>Routes</span>
          </>
        )}
      </div>
    </div>
  );
};

const Directions = ({
  markers,
  origin,
}: {
  markers: google.maps.LatLngLiteral[];
  origin: google.maps.LatLngLiteral;
}) => {
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
    const waypoints: { location: google.maps.LatLngLiteral; }[] = [];
    markers.forEach((location, index) => {
      if (index != markers.length - 1) {
        waypoints.push({ location: location });
      }
    });
    directionsService
      .route({
        origin: origin,
        destination: markers[markers.length - 1],
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
        waypoints: waypoints,
      })
      .then((resp) => {
        directionsRenderer.setDirections(resp);
        directionsRenderer.setOptions({
          polylineOptions: { strokeColor: "#FF06AA" },
        });
        setRoutes(resp.routes);
      });
  }, [directionsService, directionsRenderer]);

  console.log(routes);

  return null;
};
