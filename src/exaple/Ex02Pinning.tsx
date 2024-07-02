import {
  AdvancedMarker,
  Map,
  MapMouseEvent,
  Marker,
  Pin,
} from "@vis.gl/react-google-maps";
import viteLogo from "/vite.svg";
import { useState } from "react";

export default function Ex02Pinning() {
  const [morePin, setMorePin] = useState<google.maps.LatLngLiteral[]>([]);

  const onClickMap = (e: MapMouseEvent) => {
    const newPos = e.detail.latLng;
    if (newPos != null) {
      // console.log(newPos);

      setMorePin([...morePin, newPos]); // correctly update state with new pin
    }
  };

  return (
    <div className="p-10 w-full h-full">
      <Map
        defaultZoom={9}
        defaultCenter={{ lat: 13.75, lng: 100.55 }}
        mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        onClick={(e) => onClickMap(e)}
      >
        {/* Click to mark */}
        {morePin.map((pos, index) => {
          return <Marker key={index} position={pos}></Marker>;
        })}
        {/* static */}
        <AdvancedMarker position={{ lat: 13.78, lng: 100.56 }}>
          <Pin
            background={"#FBBC04"}
            glyphColor={"#000"}
            borderColor={"#000"}
          />
        </AdvancedMarker>
        <AdvancedMarker position={{ lat: 13.74, lng: 100.65 }}>
          <div className="w-fit h-fit p-3 absolute bg-green-500 rounded-full border-2 border-red-800">
            This is content in side marker
          </div>
        </AdvancedMarker>
        <AdvancedMarker position={{ lat: 13.6, lng: 100.4 }}>
          <div className="w-[20px] h-[20px] absolute">
            <img src={viteLogo} alt="ViteLogo" />
          </div>
        </AdvancedMarker>
      </Map>
    </div>
  );
}
