import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

type PlaceResultType = google.maps.places.PlaceResult;
type PlaceResultArrType = PlaceResultType[];

export interface MapState {
  value: number;
  status: "idle" | "loading" | "failed";
  selectedRestaurant: PlaceResultType;
  selectedRestaurantDetail: PlaceResultType;
  searchRestaurantResults: PlaceResultArrType;
  isLoading: boolean;
  COGENT_OFFICE_POSITION: google.maps.LatLngLiteral;
}

const initialState: MapState = {
  value: 0,
  selectedRestaurant: {},
  selectedRestaurantDetail: {},
  searchRestaurantResults: [],
  status: "idle",
  isLoading: false,
  COGENT_OFFICE_POSITION: {
    lat: 35.6646782,
    lng: 139.7378198,
  },
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setSearchRestaurantResult: (
      state,
      action: PayloadAction<PlaceResultArrType>
    ) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.searchRestaurantResults = state.searchRestaurantResults.concat(
        action.payload
      );
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSelectedRestaurant: (state, action: PayloadAction<PlaceResultType>) => {
      state.selectedRestaurant = action.payload;
    },
    setSelectedRestaurantDetail: (
      state,
      action: PayloadAction<PlaceResultType>
    ) => {
      state.selectedRestaurantDetail = action.payload;
    },
  },
});

export const {
  setSearchRestaurantResult,
  setIsLoading,
  setSelectedRestaurant,
  setSelectedRestaurantDetail,
} = mapSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.mapState)`
export const selectMapState = (state: RootState) => state.mapState;

export default mapSlice.reducer;
