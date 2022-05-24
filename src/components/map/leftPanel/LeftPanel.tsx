/**
 * The Left side control panel of the application
 */
import usePlacesAutocomplete, { getGeocode } from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import styles from "./LeftPanel.module.css";
import InfoPanel from "./infoPanel/InfoPanel";
import { setSelectedRestaurant, selectMapState } from "../mapSlice";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";

export default function LeftPanel() {
  const mapState = useAppSelector(selectMapState);
  const dispatch = useAppDispatch();
  const {
    selectedRestaurant,
    searchRestaurantResults,
    COGENT_OFFICE_POSITION,
  } = mapState;
  /**
   * Places Auto complete service, gives input suggestions while
   * user is typing
   */
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["restaurant", "food"],
      componentRestrictions: { country: "jp" },
      language: "ja",
      location: new google.maps.LatLng(COGENT_OFFICE_POSITION),
      radius: 1000,
    },
  });

  /**
   * Gets the geolocation from address and update selectedRestaurant state
   * @param val the selected automcomplete suggestion value(address of location)
   */
  const handleSelect = async (val: string) => {
    setValue(val, false);
    clearSuggestions();

    const results = await getGeocode({ address: val });
    dispatch(setSelectedRestaurant(results[0]));
  };
  /**
   * Suggest a random restaurant from the nearby list,
   * update the selectedRestaurant state
   */
  const handleSuggestRestaurant = () => {
    dispatch(
      setSelectedRestaurant(
        searchRestaurantResults[
          Math.floor(Math.random() * searchRestaurantResults.length)
        ]
      )
    );
  };
  return (
    <div className={styles.leftPanelContainer}>
      <h1>Restaurant Finder</h1>
      <h3>Search</h3>
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          className="combobox-input"
          placeholder="Search Restaurant"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
      <h3>OR</h3>
      <button className={styles.suggestBtn} onClick={handleSuggestRestaurant}>
        Suggest a Restaurant
      </button>
      {Object.keys(selectedRestaurant).length ? <InfoPanel /> : null}
    </div>
  );
}
