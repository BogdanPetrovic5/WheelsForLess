import { Action, createReducer, on } from "@ngrx/store";
import { updateBrandFilter, updateModelFilter, applyFilters } from "./filter.action";

export interface FilterState {
  brand: string | null;
  model: string | null;
}

export const initialState: FilterState = {
  brand: null,
  model: null
};

const _filterReducer = createReducer(
  initialState,
  on(updateBrandFilter, (state, { brand }) => ({ ...state, brand })),
  on(updateModelFilter, (state, { model }) => ({ ...state, model })),
  on(applyFilters, (state) => state)
);

export function filterReducer(state: FilterState | undefined, action: Action) {
  return _filterReducer(state, action);
}