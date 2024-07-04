import {
  AdvancedMarker,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

// export default function Ex03PlaceSuggest() {
//   const [selectedPlaces, setSelectedPlaces] = useState<
//     google.maps.places.PlaceResult[]
//   >([]);

//   const map = useMap();
//   const placesLib = useMapsLibrary("places");
//   const [autoComplete, setAutocomplete] =
//     useState<google.maps.places.Autocomplete>();

//   const placeAutoCompleteRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (!placesLib || !map) return;
//     setAutocomplete(
//       new placesLib.Autocomplete(
//         placeAutoCompleteRef.current as HTMLInputElement
//         // { componentRestrictions: { country: ['th'] }, }
//       )
//     );
//   }, [placesLib, map]);

//   useEffect(() => {
//     if (!autoComplete || !map) {
//       return;
//     } else {
//       autoComplete.addListener("place_changed", () => {
//         const place = autoComplete.getPlace();
//         const pos = place.geometry?.location;

//         if (pos) {
//           setSelectedPlaces([...selectedPlaces, place]);
//           map.setCenter(pos);
//         }
//       });
//     }
//   }, [autoComplete]);

//   const position = { lat: 13.75, lng: 100.55 };
//   const zoomLv = 11;
//   return (
//     <div className="flex flex-col p-3 w-full h-full">
//       <input
//         className="rounded-full p-1 shadow-md"
//         ref={placeAutoCompleteRef}
//       />
//       <label className=" text-center text-xl">
//         {selectedPlaces.length > 0
//           ? `Go to ${
//               selectedPlaces[selectedPlaces.length - 1].formatted_address
//             }.`
//           : "Type at the searchbar."}
//       </label>
//       <div className="p-3 w-full h-full">
//         <Map
//           mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
//           defaultZoom={zoomLv}
//           defaultCenter={position}
//         >
//           {selectedPlaces.map((place, index) => {
//             return (
//               <AdvancedMarker
//                 key={index}
//                 position={place.geometry?.location}
//               ></AdvancedMarker>
//             );
//           })}
//         </Map>
//       </div>
//     </div>
//   );
// }

export default function Ex03PlaceSuggest() {
  const map = useMap();
  const placesLib = useMapsLibrary("places");

  const [selectedPlaces, setSelectedPlaces] = useState<
    google.maps.places.PlaceResult[]
  >([]);

  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken>();

  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);

  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);

  const [predictionResults, setPredictionResults] = useState<
    Array<google.maps.places.AutocompletePrediction>
  >([]);

  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (!placesLib || !map) return;

    setAutocompleteService(new placesLib.AutocompleteService());
    setPlacesService(new placesLib.PlacesService(map));
    setSessionToken(new placesLib.AutocompleteSessionToken());

    return () => setAutocompleteService(null);
  }, [map, placesLib]);

  const fetchPredictions = useCallback(
    async (inputValue: string) => {
      if (!autocompleteService || !inputValue) {
        setPredictionResults([]);
        return;
      }

      const request = {
        input: inputValue,
        sessionToken,
        componentRestrictions: { country: "th" },
        language: "th",
      };
      const response = await autocompleteService.getPlacePredictions(request);

      setPredictionResults(response.predictions);
    },
    [autocompleteService, sessionToken]
  );

  const onInputChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      const value = (event.target as HTMLInputElement)?.value;

      setInputValue(value);
      fetchPredictions(value);
    },
    [fetchPredictions]
  );

  const handleSuggestionClick = useCallback(
    (placeId: string) => {
      if (!placesLib) return;

      const detailRequestOptions = {
        placeId,
        fields: ["geometry", "name", "formatted_address"],
        sessionToken,
      };

      const detailsRequestCallback = (
        placeDetails: google.maps.places.PlaceResult | null
      ) => {
        if (placeDetails) {
          setSelectedPlaces([...selectedPlaces, placeDetails]);
          const pos = placeDetails.geometry?.location;
          if (map && pos) {
            map.setCenter(pos);
          }
        }
        setPredictionResults([]);
        setInputValue(placeDetails?.formatted_address ?? "");
        setSessionToken(new placesLib.AutocompleteSessionToken());
      };

      placesService?.getDetails(detailRequestOptions, detailsRequestCallback);
    },
    [placesLib, placesService, sessionToken]
  );

  const position = { lat: 13.75, lng: 100.55 };
  const zoomLv = 11;

  return (
    <div className="flex flex-col p-3 w-full h-full">
      <div className="w-full flex flex-col items-center">
        <input
          className="w-1/2 rounded-3xl border border-red-400 pl-4 text-xl"
          value={inputValue}
          onInput={(event: FormEvent<HTMLInputElement>) => onInputChange(event)}
          placeholder="Search for a place"
        />
        <div className="w-1/2 px-2">
          {predictionResults.length > 0 && (
            <ul className="w-[47%] absolute z-30 bg-white space-y-2 rounded-md">
              {predictionResults.map(({ place_id, description }, index) => {
                return (
                  <li
                    key={place_id}
                    className={`${index % 2 == 0 ? "bg-lime-100" : "bg-amber-100"
                      } hover:bg-orange-400 active:bg-orange-200`}
                    onClick={() => handleSuggestionClick(place_id)}
                  >
                    {description}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

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
