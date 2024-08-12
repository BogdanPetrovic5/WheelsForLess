import { createAction, props } from "@ngrx/store";

export const updateBrandFilter = createAction(
    '[Filter] Update Brand Filter',
    props<{brand:string | null}>()
)
export const updateModelFilter = createAction(
    '[Filter] Update Model Filter',
    props<{model:string | null}>()

)
export const applyFilters = createAction(
    '[Filter] Apply Filters'
)