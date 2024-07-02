import { Map } from "@vis.gl/react-google-maps";

export default function Ex01BasicMap() {
  const position = { lat: 13.75, lng: 100.55 };
  const zoomLv = 11;
  return (
    <div className="p-10 w-full h-full">
      <Map
        defaultZoom={zoomLv}
        defaultCenter={position}
      ></Map>
    </div>
  );
}