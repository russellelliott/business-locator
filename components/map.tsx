import { useState, useMemo, useCallback, useRef } from "react";

import { toast, ToastContainer } from 'react-toastify'; //for notification
import 'react-toastify/dist/ReactToastify.css'; //for notification

import React, { ChangeEvent} from 'react' //for timer/controller

import { useInterval } from 'usehooks-ts' //for the timer/counter

import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
  GoogleMarkerClusterer,
} from "@react-google-maps/api";
import Places from "./places";
import Distance from "./distance";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

export default function Map() {
  const [office, setOffice] = useState<LatLngLiteral>();
  const [directions, setDirections] = useState<DirectionsResult>();
  const mapRef = useRef<GoogleMap>();
  const center = useMemo<LatLngLiteral>(
    () => ({ lat: 43.45, lng: -80.49 }),
    []
  );

  //HARDCODED nearest location
  const nearest = useMemo<LatLngLiteral>(
    () => ({ lat: 43.47, lng: -80.43 }),
    []
  );

  const options = useMemo<MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );
  const onLoad = useCallback((map) => (mapRef.current = map), []);
  const houses = useMemo(() => generateHouses(center), [center]);

  const fetchDirections = (house: LatLngLiteral) => {
    if (!office) return;

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: house,
        destination: office,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      }
    );
  };

  // The counter
  const [count, setCount] = useState<number>(0)
  // Dynamic delay
  const [delay, setDelay] = useState<number>(1000)
  // ON/OFF
  const [isPlaying, setPlaying] = useState<boolean>(false)

  useInterval(
    () => {
      // Your custom logic here
      setCount(count + 1)
      //display message with toast
      //toast.success("Success");
      //toast.warn("This is your final warning");
      var distance = getNearest(); //get nearest business
      toast(distance);
    },
    // Delay in milliseconds or null to stop it
    isPlaying ? delay : null,
  )

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDelay(Number(event.target.value))
  }

  function getNearest(){
    var minDistance = Infinity; //max positive number in javascript
    if(!office){ //need office location to get nearest location
      toast.error("No locations available. Please select your location in the searchbox.");
    }else{
      toast.success("Locations available!");
      houses.forEach(function (value){
        //toast(value.lat); //iterate through all the houses
        //find the closest by comparing latitiude and longitude to that of the user's location
        var diffLat = value.lat - office.lat;
        var diffLng = value.lng - office.lng;
        //pythagorean theorem
        var distance = Math.sqrt(Math.pow(diffLat, 2)+Math.pow(diffLng, 2)); //smallest distance = closest
        if(distance < minDistance){
          minDistance = distance; //set min distance
        }
      });
    }
    return minDistance; //return the minimum distance, whatever that may be.
  }

  function goToNearest(){
    toast.info("Here is the closest business to your location.")
    //TODO: figure out way to get the locations of the markers on the map and find the closest one to the user
    //For now, user sets their "office", and markers are generated around that

    //the location of the nearest business will be stored in a variable called "nearest"
    //hardcoding this for now
    /*const nearest = useMemo<LatLngLiteral>(
      () => ({ lat: 45, lng: -81 }),
      []
    );*/

    //pan to the nearest business
    //somehow import data here?

    mapRef.current?.panTo(nearest); //pan to location
    
  }

  return (
    <div className="container">
      <div className="controls">
        <h1>Commute?</h1>
        <Places
          setOffice={(position) => {
            setOffice(position);
            mapRef.current?.panTo(position);
          }}
        />
        {!office && <p>Enter the address of your office.</p>}
        {directions && <Distance leg={directions.routes[0].legs[0]} />}
      </div>
      <div>
        <h1>{count}</h1>
        <button onClick={() => setPlaying(!isPlaying)}>
          {isPlaying ? 'pause' : 'play'}
        </button>
        <p>
          <label htmlFor="delay">Delay: </label>
          <input
            type="number"
            name="delay"
            onChange={handleChange}
            value={delay}
          />
        </p>
        <ToastContainer />
        {center.lat},{center.lng}
        <button onClick={goToNearest}>Go To Nearest Business</button>
      </div>
      <div className="map">
        <GoogleMap
          zoom={10}
          center={center}
          mapContainerClassName="map-container"
          options={options}
          onLoad={onLoad}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  zIndex: 50,
                  strokeColor: "#1976D2",
                  strokeWeight: 5,
                },
              }}
            />
          )}

          {office && (
            <>
              <Marker
                position={office}
                icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
              />

              <MarkerClusterer>
                {(clusterer) =>
                  houses.map((house) => (
                    <Marker
                      key={house.lat}
                      position={house}
                      clusterer={clusterer}
                      onClick={() => {
                        fetchDirections(house);
                      }}
                    />
                  ))
                }
              </MarkerClusterer>

              <Circle center={office} radius={15000} options={closeOptions} />
              <Circle center={office} radius={30000} options={middleOptions} />
              <Circle center={office} radius={45000} options={farOptions} />
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

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
