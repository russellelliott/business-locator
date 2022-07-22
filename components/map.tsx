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
  // Dynamic delay (user inputs seconds; converted to miliseconds)
  const [delay, setDelay] = useState<number>(5)
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
      if(office){
        //display distance only if office exists. if not, distance is undefined
        toast.info("The nearest marker to you is " + distance?.toFixed(1) + " km away.");
      }
    },
    // Delay in milliseconds or null to stop it
    //multiply by 1000; user inputs it as seconds
    isPlaying ? delay*1000 : null,
  )

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDelay(Number(event.target.value))
  }

  function getMiles(office: any, lat: any, lng: any){
    //distance from office to a given location in miles
    var distLat = 69; //distance of one degree of latitude in miles
    var distLng = 54.6; //distance of one degree of latitude in miles
    var diffLat = (lat - office.lat)*distLat;
    var diffLng = (lng - office.lng)*distLng;
    //pythagorean theorem
    var distance = Math.sqrt(Math.pow(diffLat, 2)+Math.pow(diffLng, 2)); //smallest distance = closest
    return distance*1.60934; //convert to km because distance component is in km
  }
  function getNearest(){
    if(!office){
      toast.error("Office not set.")
      return;
    }
    var minDistance = Infinity; //max positive number in javascript
    if(!office){ //need office location to get nearest location
      toast.error("No locations available. Please select your location in the searchbox.");
    }else{
      toast.success("Locations available!");
      houses.forEach(function (value){
        //toast(value.lat); //iterate through all the houses
        //find the closest by comparing latitiude and longitude to that of the user's location
        /*var distLat = 69; //distance of one degree of latitude in miles
        var distLng = 54.6; //distance of one degree of latitude in miles
        var diffLat = (value.lat - office.lat)*distLat;
        var diffLng = (value.lng - office.lng)*distLng;
        //pythagorean theorem
        var distance = Math.sqrt(Math.pow(diffLat, 2)+Math.pow(diffLng, 2)); //smallest distance = closest*/
        var distance = getMiles(office, value.lat, value.lng);
        if(distance < minDistance){
          minDistance = distance; //set min distance
        }
      });
    }
    return minDistance; //return the minimum distance, whatever that may be.
  }

  function goToNearest(){
    if(!office){
      toast.error("Office not set.")
      return;
    }
    toast.info("Here is the closest business to your location.")
    var minDistance = getNearest();
    houses.forEach(function (value){
      //find house with correct distance
      var distance = getMiles(office, value.lat, value.lng);
      if(distance == minDistance){
        mapRef.current?.panTo(value); //pan to nearest business
      }
    });
    
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
        <h1>Fetch Data</h1>
        <button onClick={() => setPlaying(!isPlaying)}>
          {isPlaying ? 'Stop' : 'Start'}
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
