import { useLoadScript } from "@react-google-maps/api";
import Map from "../components/map";

export default function Home() {
  const {isLoaded} = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, //get the API key from .env.local
    libraries: ["places"], //Google Places used to find locations
  });

  //check if the script above has finished loading
  if(!isLoaded) return <div>Loading...</div> //display when the map is loading
  return <div>Map</div>; //when done loading, display the map
}
