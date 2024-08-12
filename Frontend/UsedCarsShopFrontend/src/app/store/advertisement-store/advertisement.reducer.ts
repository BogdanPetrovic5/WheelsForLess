import { Action, createReducer, on } from "@ngrx/store";
import { loadAdvertisements, loadAdvertisementsSuccess, loadAdvertisementsFailure } from "./advertisement.action";

export interface AdvertisementState {
  advertisements: any[];
  loading: boolean;
  error: any;
}

export const initialState: AdvertisementState = {
  advertisements: [],
  loading: false,
  error: null
};

const _advertisementsReducer = createReducer(
  initialState,
  on(loadAdvertisements, (state) => ({
    ...state,
    loading: true
  })),
  on(loadAdvertisementsSuccess, (state, { advertisements }) => ({
    ...state,
    loading: false,
    advertisements
  })),
  on(loadAdvertisementsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

export function advertisementReducer(state: AdvertisementState | undefined, action: Action) {
  return _advertisementsReducer(state, action);
}