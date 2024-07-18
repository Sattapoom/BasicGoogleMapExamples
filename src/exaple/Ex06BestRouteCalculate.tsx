import {
  AdvancedMarker,
  Map,
  MapMouseEvent,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

interface LocationsForcalculation {
  location: google.maps.LatLngLiteral;
  cluster: boolean;
}

export default function Ex06BestRouteCalculate() {
  const EBikePosition = {
    lat: 13.75,
    lng: 100.55,
  } as google.maps.LatLngLiteral;
  const zoomLv = 11;

  const [locations, setLocations] = useState<google.maps.LatLngLiteral[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);
  const [locForCal, setLocForCal] = useState<LocationsForcalculation[]>([]);

  function toRadians(degrees: number) {
    return degrees * (Math.PI / 180);
  }

  function toDegrees(radians: number) {
    return radians * (180 / Math.PI);
  }

  function haversineDistance(
    pos1: google.maps.LatLngLiteral,
    pos2: google.maps.LatLngLiteral
  ) {
    const R = 6371; // Radius of the Earth in kilometers

    const dLat = toRadians(pos2.lat - pos1.lat);
    const dLon = toRadians(pos2.lng - pos1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(pos1.lat)) *
      Math.cos(toRadians(pos2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
  }

  function midpoint(
    pos1: google.maps.LatLngLiteral,
    pos2: google.maps.LatLngLiteral
  ): google.maps.LatLngLiteral {
    const dLon = toRadians(pos2.lng - pos1.lng);

    // Convert latitudes to radians
    const lat1 = toRadians(pos1.lat);
    const lat2 = toRadians(pos2.lat);
    const lon1 = toRadians(pos1.lng);

    // Cartesian coordinates of the two points
    const Bx = Math.cos(lat2) * Math.cos(dLon);
    const By = Math.cos(lat2) * Math.sin(dLon);

    // Compute the midpoint coordinates
    const lat3 = Math.atan2(
      Math.sin(lat1) + Math.sin(lat2),
      Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By)
    );
    const lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);

    // Convert midpoint coordinates back to degrees
    return {
      lat: toDegrees(lat3),
      lng: toDegrees(lon3),
    };
  }

  const onClickMap = (e: MapMouseEvent) => {
    const newPos = e.detail.latLng;
    if (newPos != null) {
      if (locations.includes(newPos)) return;
      setLocations([...locations, newPos]);

      if (locForCal.length < 1) {
        const loc: LocationsForcalculation = {
          location: newPos,
          cluster: false,
        };
        setLocForCal([loc]);
      } else {
        let assigned = false;
        let newLocForCal: LocationsForcalculation[] = [];
        for (let index = 0; index < locForCal.length; index++) {
          const element = locForCal[index];
          const distance = haversineDistance(element.location, newPos);
          if (
            !assigned &&
            ((distance <= 0.5 && element.cluster == false) ||
              (distance <= 1 && element.cluster == true))
          ) {
            const loc: LocationsForcalculation = {
              location: midpoint(newPos, element.location),
              cluster: true,
            };
            newLocForCal.push(loc);
            assigned = true;
          } else {
            newLocForCal.push(element);
          }
        }
        if (!assigned) {
          const loc: LocationsForcalculation = {
            location: newPos,
            cluster: false,
          };
          newLocForCal.push(loc);
        }
        setLocForCal(newLocForCal);
      }

      setIsCalculated(false);
    }
  };

  const reNewLocations = (l: LocationsForcalculation[]) => {
    setLocForCal(l);
    setIsCalculated(true);
  };

  return (
    <div className="p-10 w-full h-full">
      <Calculation
        locations={locForCal}
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
        <Pins
          locations={locations}
          isCalculated={isCalculated}
          LocationsForCal={locForCal}
        />
        {isCalculated && (
          <Directions locations={locForCal} origin={EBikePosition} />
        )}
      </Map>
    </div>
  );
}

const Pins = ({
  locations,
  isCalculated,
  LocationsForCal,
}: {
  locations: google.maps.LatLngLiteral[];
  isCalculated: boolean;
  LocationsForCal: LocationsForcalculation[];
}) => {
  return (
    <>
      {isCalculated
        ? LocationsForCal.map(({ location: pos, cluster }, index) => {
          return (
            <AdvancedMarker key={index} position={pos}>
              <div
                className={`flex justify-center items-center rounded-full ${cluster
                  ? "bg-sky-500 border-sky-900"
                  : "bg-green-500 border-green-900"
                  } border-2 w-8 h-8 z-10`}
              >
                <div className="text-xl">{index + 1}</div>
              </div>
            </AdvancedMarker>

          );
        })
        : locations.map((pos, index) => {
          return (
            <AdvancedMarker key={index} position={pos}>
              <div
                className={`flex justify-center items-center rounded-full bg-red-500 border-red-900 border-2 w-8 h-8 z-20`}
              >
                <div className="text-xl">{index + 1}</div>
              </div>
            </AdvancedMarker>
          );
        })}
      {LocationsForCal.map(({ location: pos, cluster }, index) => {
        return (
          <AdvancedMarker key={index} position={pos}>
            <div
              className={`flex justify-center items-center rounded-full ${cluster
                ? "bg-sky-500 border-sky-900"
                : "bg-green-500 border-green-900"
                } border-2 w-8 h-8 z-10`}
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
  locations: LocationsForcalculation[];
  origin: google.maps.LatLngLiteral;
  reNewLocations: (l: LocationsForcalculation[]) => void;
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
  }, [map, geoCodeLib]);

  const onClickCalculate = async () => {
    const unOrdered: LocationsForcalculation[] = [...locations.slice()];
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
    d: LocationsForcalculation[]
  ): Promise<LocationsForcalculation[]> => {
    let result = d;

    if (!dtMatrix || !map || d.length === 0) {
      return [];
    }

    const destination: google.maps.LatLngLiteral[] = [];

    d.forEach(element => {
      destination.push(element.location)
    });

    const request = {
      origins: [o],
      destinations: destination,
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

      let nextCalculations: LocationsForcalculation[] = [];

      d.forEach((item) => {
        if (bestNextLocation !== item) {
          nextCalculations.push(item);
        }
      });

      console.log({ bestNextLocation, nextCalculations });

      await reOrderLocations(bestNextLocation.location, nextCalculations).then((r) => {
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
  locations,
  origin,
}: {
  locations: LocationsForcalculation[];
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
    const waypoints: { location: google.maps.LatLngLiteral }[] = [];
    locations.forEach((location, index) => {
      if (index != locations.length - 1) {
        waypoints.push({ location: location.location });
      }
    });
    directionsService
      .route({
        origin: origin,
        destination: locations[locations.length - 1].location,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
        waypoints: waypoints,
      })
      .then((resp) => {
        directionsRenderer.setDirections(resp);
        directionsRenderer.setOptions({
          suppressMarkers: true,
          polylineOptions: { strokeColor: "#FF06AA" },
        });
        setRoutes(resp.routes);
      });
  }, [directionsService, directionsRenderer]);

  console.log(routes);

  return null;
};
