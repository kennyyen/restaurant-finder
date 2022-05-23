/**
 * Display the detail information of the Restaurant
 * on the left side panel
 */
import { useAppSelector } from "../../../../app/hooks";
import { selectMapState } from "../../mapSlice";
import styles from "./InfoPanel.module.css";

export default function InfoPanel() {
  const mapState = useAppSelector(selectMapState);
  const { selectedRestaurantDetail } = mapState;
  const {
    name,
    opening_hours,
    business_status,
    formatted_address,
    vicinity,
    formatted_phone_number,
    rating,
    photos,
    reviews,
  } = selectedRestaurantDetail;
  return (
    <div className={styles.infoPanelContainer}>
      <div>
        <h2>{name}</h2>
      </div>
      {opening_hours && (
        <div>
          <b>{opening_hours.isOpen() ? "Open now" : "Closed"}</b>
        </div>
      )}
      <div>{business_status}</div>
      <div>
        <b>Address: </b>
        {formatted_address}
      </div>
      <div>
        <b>Address: </b>
        {vicinity}
      </div>
      <div>
        <b>Number: </b>
        {formatted_phone_number}
      </div>
      <div>
        <b>Ratings: </b>
        {rating}
      </div>

      <h3>Hours: </h3>
      {opening_hours && (
        <div>{opening_hours.isOpen() ? "Open now" : "Closed"}</div>
      )}
      {opening_hours && opening_hours.weekday_text && (
        <div>
          {opening_hours.weekday_text?.map((day, index) => (
            <div key={`info-hours-${index}`}>{day}</div>
          ))}
        </div>
      )}
      <h3>Comments: </h3>
      {reviews?.map((review, index) => {
        const { author_name, rating, relative_time_description, text } = review;
        return (
          <div
            className={styles.infoCommentsContainer}
            key={`info-review-${index}`}
          >
            <div>{`Name: ${author_name}`}</div>
            <div>{`Rating: ${rating}`}</div>
            <div>{`Comment Time: ${relative_time_description}`}</div>
            <p>{`Commet: ${text}`}</p>
          </div>
        );
      })}
      {photos?.map((photo, index) => (
        <img
          key={`info-photo-${index}`}
          className={styles.infoPanelImg}
          src={photo.getUrl()}
          alt="restaurant icon"
        ></img>
      ))}
    </div>
  );
}
