import { Map } from "@vis.gl/react-google-maps";

export default function Ex05Clustering() {
  const position = { lat: 13.75, lng: 100.55 };
  const zoomLv = 11;
  return (
    <div className="p-10 w-full h-full">
      <Map
        mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
        defaultZoom={zoomLv}
        defaultCenter={position}
      ></Map>
    </div>
  );
}
