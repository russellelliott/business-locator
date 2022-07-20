import { useState, useMemo, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
} from "@react-google-maps/api";
import Places from "./places";
import Distance from "./distance";

//shortcuts for stuff we are using
type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

//render the map
export default function Map() {
  //set up the location of the office
  const [office, setOffice] = useState<LatLngLiteral>();

  //make a mapRef
  const mapRef = useRef<GoogleMap>(); //give it a type using "<>", tell it's an instance of GoogleMap

  //use same instance of the object to avoid centering issues
  //useMemo; use the same object unless one of the parameters has changed
  //no dependencies (2nd argument); get exact same object every time
  const center = useMemo<LatLngLiteral>(() => ({lat:43, lng: -80}), []);

  //implement options for our map
  const options = useMemo<MapOptions>(() => ({
    disableDefaultUI: true,
    clickableIcons: false
  }), []);

  //populate the mapRef
  const onLoad = useCallback(map => (mapRef.current = map), []);

  //generate the houses from center location
  //houses regenerate when the center location changes, like when the user moves across the map
  const houses = useMemo(() => generateHouses(center), [center])
  return <div className="container">
    <div className="controls">
      <h1>Commute?</h1>
      <Places setOffice={(position) => {
        setOffice(position);
        mapRef.current?.panTo(position);
      }}/>
    </div>
    <div className="map">
      <GoogleMap
        zoom={10}
        center={center}
        mapContainerClassName="map-container"
        options={options}
        onLoad={onLoad}
      >
        {office && (
        <>
          <Marker 
            position={office}
            icon={"https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"}
          />

          {houses.map((house) => (
            <Marker key={house.lat} position={house}/>
          ))}
          <Circle center = {office} radius={15000} options={closeOptions}/>
          <Circle center = {office} radius={30000} options={middleOptions}/>
          <Circle center = {office} radius={45000} options={farOptions}/>
        </>
        )}
      </GoogleMap>
    </div>

  </div>;
}

//options fir displaying circles to indicate commuting distances
const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#FF5252",
  fillColor: "#FF5252",
};

//generate houses at random locations
const generateHouses = (position: LatLngLiteral) => {
  const _houses: Array<LatLngLiteral> = [];
  for (let i = 0; i < 100; i++) {
    const direction = Math.random() < 0.5 ? -2 : 2;
    _houses.push({
      lat: position.lat + Math.random() / direction,
      lng: position.lng + Math.random() / direction,
    });
  }
  return _houses;
};
