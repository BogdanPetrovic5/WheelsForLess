import { createSelector } from "@ngrx/store";

export const selectFilterState = (state: any) => state.filters;

export const selectBrandFilter = createSelector(
  selectFilterState,
  (state) => state.brand
);

export const selectModelFilter = createSelector(
  selectFilterState,
  (state) => state.model
);

export const selectAllFilters = createSelector(
  selectFilterState,
  (state) => ({
    brand: state.brand,
    model: state.model
  })
);