/**
 * Map.tsx - the main application file
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Circle,
} from "@react-google-maps/api";
import {
  setIsLoading,
  setSelectedRestaurant,
  selectMapState,
  setSearchRestaurantResult,
  setSelectedRestaurantDetail,
} from "./mapSlice";
import styles from "./Map.module.css";
import "./Map.module.css";
import LeftPanel from "./leftPanel/LeftPanel";
import { useAppSelector, useAppDispatch } from "../../app/hooks";

// Typing
// type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;
type LibrariesOptions = (
  | "places"
  | "drawing"
  | "geometry"
  | "localContext"
  | "visualization"
)[];
type PlaceResult = google.maps.places.PlaceResult;
type PlaceResultArray = PlaceResult[] | null;
type NearbyCallbackOptions = (
  res: PlaceResultArray,
  status: google.maps.places.PlacesServiceStatus,
  pagination: google.maps.places.PlaceSearchPagination | null
) => void;

const libraries = ["places"] as LibrariesOptions;

/**
 * Main Map component
 * @returns {React.ReactElement}
 */
export default function Map(): React.ReactElement {
  const { isLoaded } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
  });
  if (!isLoaded) return <div>Loading...</div>;
  return <CustomMap />;
}

// Map service insatnce, for all map api services calls
let service: google.maps.places.PlacesService;

/**
 * Google map component
 * @returns {React.ReactElement}
 */
function CustomMap(): React.ReactElement {
  const mapState = useAppSelector(selectMapState);
  const {
    searchRestaurantResults,
    selectedRestaurant,
    selectedRestaurantDetail,
    COGENT_OFFICE_POSITION,
  } = mapState;
  const dispatch = useAppDispatch();
  const mapRef = useRef<GoogleMap>();
  const mapOptions = useMemo<MapOptions>(
    () => ({
      clickableIcons: false,
    }),
    []
  );
  const [cogentOfficeKey, setCogentOfficeKey] = useState(
    `cogent-office-${Math.random()}`
  );
  const [cogentOfficeCircleKey, setCogentOfficeCircleKey] = useState(
    `cogent-office-circle-${Math.random()}`
  );
  /**
   * The Google Map Marker and Circle component requires a new key on every refresh
   * to show properly, this useEffect will assign a new random key to the component
   */
  useEffect(() => {
    setCogentOfficeKey(`cogent-office-${Math.random()}`);
    setCogentOfficeCircleKey(`cogent-office-circle-${Math.random()}`);
  }, []);
  /**
   * Handles the nearby service callback, query for next page
   * if available
   */
  const nearbyCallback: NearbyCallbackOptions = useCallback(
    (res, status, pagination) => {
      if (status === "OK") {
        dispatch(setSearchRestaurantResult(res || []));
        if (pagination?.hasNextPage) {
          pagination.nextPage();
        } else {
          dispatch(setIsLoading(false));
        }
      } else {
        dispatch(setIsLoading(false));
      }
    },
    [dispatch]
  );
  /**
   * Gets the nearby restaurants around the center
   */
  const getNearbyPlaces = useCallback(
    (position: google.maps.LatLng | google.maps.LatLngLiteral) => {
      let request = {
        location: position,
        radius: 1000,
        type: "restaurant",
        opennow: true,
      };
      dispatch(setIsLoading(true));
      service.nearbySearch(request, nearbyCallback);
    },
    [dispatch, nearbyCallback]
  );
  /**
   * Google map onLoad callback, set up mapReft for childcomponent
   * to perform action on the map
   */
  const onLoad = useCallback(
    (map: any) => {
      // create listener after the load library is loaded
      // want to wait until the map is stable before fetching for places
      google.maps.event.addListenerOnce(map, "tilesloaded", function () {
        service = new google.maps.places.PlacesService(map);
        getNearbyPlaces(COGENT_OFFICE_POSITION);
      });
      return (mapRef.current = map);
    },
    [COGENT_OFFICE_POSITION, getNearbyPlaces]
  );
  /**
   * Get the location detail of selected restaurant,
   * update global store selectedRestaurantDetail for display use
   */
  const getDetail = useCallback(
    (
      restaurant: PlaceResult,
      position: google.maps.LatLngLiteral | google.maps.LatLng
    ) => {
      const { place_id } = restaurant;
      const request = {
        placeId: place_id || "",
      };
      service.getDetails(request, (res) => {
        if (res) dispatch(setSelectedRestaurantDetail(res));
        mapRef.current?.panTo(position);
      });
    },
    [dispatch]
  );
  /**
   * Listening on selectedRestuarant change, grab the detail info
   * of the restaurant when updated
   */
  useEffect(() => {
    if (
      selectedRestaurant &&
      selectedRestaurant.geometry &&
      selectedRestaurant.geometry.location
    ) {
      const lat = selectedRestaurant.geometry.location.lat();
      const lng = selectedRestaurant.geometry.location.lng();
      getDetail(selectedRestaurant, { lat, lng });
    }
  }, [getDetail, selectedRestaurant]);
  /**
   * Display the info window above the selected Marker
   * @returns {React.ReactElement}
   */
  const getInfoWindow = (): React.ReactElement => {
    return (
      <InfoWindow
        position={selectedRestaurant.geometry?.location}
        onCloseClick={() => {
          dispatch(setSelectedRestaurant({}));
        }}
      >
        <div className={styles.infoWindowChild}>
          <h2>{selectedRestaurantDetail.name}</h2>
          {selectedRestaurantDetail.photos?.map((photo, index) => (
            <img
              key={`info-window-detail-photo-${index}`}
              className={styles.infoPanelImg}
              src={photo.getUrl()}
              alt="restaurant icon"
            ></img>
          ))}
        </div>
      </InfoWindow>
    );
  };
  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <LeftPanel />
      </div>
      <div className={styles.map}>
        <GoogleMap
          zoom={15}
          center={COGENT_OFFICE_POSITION}
          mapContainerClassName={styles.mapContainer}
          options={mapOptions}
          onLoad={onLoad}
        >
          <Marker
            options={{ opacity: 1.0 }}
            key={cogentOfficeKey}
            position={COGENT_OFFICE_POSITION}
            label="C"
          />
          {searchRestaurantResults &&
            searchRestaurantResults?.length > 0 &&
            searchRestaurantResults.map(
              (restaurant) =>
                restaurant.geometry?.location && (
                  <Marker
                    key={`marker-${restaurant.place_id}`}
                    position={restaurant.geometry?.location}
                    icon={{
                      scaledSize: new window.google.maps.Size(30, 30),
                      url: "./images/food-location.svg",
                    }}
                    onClick={() => {
                      dispatch(setSelectedRestaurant(restaurant));
                    }}
                  >
                    {selectedRestaurant === restaurant && getInfoWindow()}
                  </Marker>
                )
            )}
          {!(
            searchRestaurantResults &&
            searchRestaurantResults.find(
              (restaurant) =>
                restaurant.place_id === selectedRestaurant.place_id
            )
          ) &&
            selectedRestaurant.geometry &&
            selectedRestaurant.geometry.location && (
              <Marker
                key={`marker-detail-${selectedRestaurant.place_id}`}
                position={selectedRestaurant.geometry?.location}
                icon={{
                  scaledSize: new window.google.maps.Size(30, 30),
                  url: "./images/food-location.svg",
                }}
              >
                <InfoWindow
                  position={selectedRestaurant.geometry?.location}
                  onCloseClick={() => {
                    dispatch(setSelectedRestaurant({}));
                  }}
                >
                  <div className={styles.infoWindowChild}>
                    <h2>{selectedRestaurantDetail.name}</h2>
                    {selectedRestaurantDetail.photos?.map((photo, index) => (
                      <img
                        key={`detail-img-${index}`}
                        className={styles.infoPanelImg}
                        src={photo.getUrl()}
                        alt="restaurant icon"
                      ></img>
                    ))}
                  </div>
                </InfoWindow>
              </Marker>
            )}
          <Circle
            key={cogentOfficeCircleKey}
            center={COGENT_OFFICE_POSITION}
            radius={1000}
            options={circleOptions}
          />
        </GoogleMap>
      </div>
    </div>
  );
}

// the Circle component options
const circleOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};
