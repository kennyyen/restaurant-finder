import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Circle,
} from "@react-google-maps/api";
import styles from "./Map.module.css";

// Typing
type LatLngLiteral = google.maps.LatLngLiteral;
// type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;
export default function Map() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: ["places"],
  });
  if (!isLoaded) return <div>Loading...</div>;
  return <CustomMap />;
}

let service;

function CustomMap() {
  const COGENT_OFFICE_POSITION = useMemo<LatLngLiteral>(
    () => ({
      lat: 35.6646782,
      lng: 139.7378198,
    }),
    []
  );
  const mapRef = useRef<GoogleMap>();
  const mapOptions = useMemo<MapOptions>(
    () => ({
      // disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );
  const getNearbyPlaces = (position: any, map: any) => {
    let request = {
      location: position,
      // rankBy: google.maps.places.RankBy.DISTANCE,
      keyword: "food",
      radius: 1000,
      type: "restaurant",
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, (res) => {
      console.log("RES: ", res);
    });
    // service.nearbySearch(request, nearbyCallback);
  };
  const [cogentOfficeKey, setCogentOfficeKey] = useState(
    `cogent-office-${Math.random()}`
  );
  const [cogentOfficeCircleKey, setCogentOfficeCircleKey] = useState(
    `cogent-office-circle-${Math.random()}`
  );
  useEffect(() => {
    setCogentOfficeKey(`cogent-office-${Math.random()}`);
    setCogentOfficeCircleKey(`cogent-office-circle-${Math.random()}`);
  }, []);
  const onLoad = useCallback(
    (map: any) => {
      getNearbyPlaces(COGENT_OFFICE_POSITION, map);
      return (mapRef.current = map);
    },
    [COGENT_OFFICE_POSITION]
  );
  // const icon = {
  //   url: "https://www.cogent.co.jp/wp-content/themes/cogentlabs/static/img/common/logo-en.png", // url
  //   scaledSize: new google.maps.Size(64, 27), // scaled size
  //   origin: new google.maps.Point(0, 0), // origin
  //   anchor: new google.maps.Point(0, 0), // anchor,
  // };
  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <h1>Commute?</h1>
        {/* <Places
          setOffice={(position) => {
            setOffice(position);
            mapRef.current?.panTo(position);
          }}
        />
        {!office && <p>Enter the address of your office.</p>}
        {directions && <Distance leg={directions.routes[0].legs[0]} />} */}
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
            // key={`cogent-office-${Math.random()}`}
            position={COGENT_OFFICE_POSITION}
            // icon={icon}
            label="C"
          />
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
