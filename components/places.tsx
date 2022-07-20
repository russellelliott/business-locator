import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

type PlacesProps = {
  setOffice: (position: google.maps.LatLngLiteral) => void;
};

export default function Places({ setOffice }: PlacesProps) {
  const {
    ready, 
    value, 
    setValue, 
    suggestions:{status, data}, 
    clearSuggestions
  } = usePlacesAutocomplete();

  //function called when user selects location
  const handleSelect = async(val: string) => {
    setValue(val, false); //get value, don't fetch data
    clearSuggestions(); //clear suggestions list

    const results = await getGeocode({address: val}); //result
    const {lat, lng} = await getLatLng(results[0]); //pass in first result
    setOffice({lat, lng}); //set office location
  }

  return <Combobox onSelect={handleSelect}>
    <ComboboxInput value={value}
    onChange={e => setValue(e.target.value)}
    disabled={!ready}
    className="combobox-input"
    placeholder="Search office address"
    />
    <ComboboxPopover>
      <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
    </ComboboxPopover>
  </Combobox>;
}
