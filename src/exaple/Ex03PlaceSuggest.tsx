import {
  AdvancedMarker,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";

export default function Ex03PlaceSuggest() {
  const [selectedPlaces, setSelectedPlaces] = useState<
    google.maps.places.PlaceResult[]
  >([]);

  const map = useMap();
  const placesLib = useMapsLibrary("places");
  const [autoComplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete>();

  const placeAutoCompleteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!placesLib || !map) return;
    setAutocomplete(
      new placesLib.Autocomplete(
        placeAutoCompleteRef.current as HTMLInputElement
        // { componentRestrictions: { country: ['th'] }, }
      )
    );
  }, [placesLib, map]);

  useEffect(() => {
    if (!autoComplete || !map) {
      return;
    } else {
      autoComplete.addListener("place_changed", () => {
        const place = autoComplete.getPlace();
        const pos = place.geometry?.location;

        if (pos) {
          setSelectedPlaces([...selectedPlaces, place]);
          map.setCenter(pos);
        }
      });
    }
  }, [autoComplete]);

  const position = { lat: 13.75, lng: 100.55 };
  const zoomLv = 11;
  return (
    <div className="flex flex-col p-3 w-full h-full">
      <input
        className="rounded-full p-1 shadow-md"
        ref={placeAutoCompleteRef}
      />
      <label className=" text-center text-xl">
        {selectedPlaces.length > 0
          ? `Go to ${selectedPlaces[selectedPlaces.length - 1].formatted_address
          }.`
          : "Type at the searchbar."}
      </label>
      <div className="p-3 w-full h-full">
        <Map
          mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
          defaultZoom={zoomLv}
          defaultCenter={position}
        >
          {selectedPlaces.map((place, index) => {
            return (
              <AdvancedMarker
                key={index}
                position={place.geometry?.location}
              ></AdvancedMarker>
            );
          })}
        </Map>
      </div>
    </div>
  );
}
