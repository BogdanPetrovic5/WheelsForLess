import { createSelector } from "@ngrx/store";

export const selectAdvertisementState = (state: any) => state.advertisements;

export const selectAdvertisements = createSelector(
  selectAdvertisementState,
  (state) => state.advertisements
);

export const selectLoading = createSelector(
  selectAdvertisementState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectAdvertisementState,
  (state) => state.error
);
