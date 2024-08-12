import { createAction, props } from '@ngrx/store';
export const loadAdvertisements = createAction(
    '[Advertisement] Load Advertisements',
    props<{ brand: string | null; model: string | null; page: number }>()
);
  
export const loadAdvertisementsSuccess = createAction(
'[Advertisement] Load Advertisements Success',
props<{ advertisements: any[] }>()
);

export const loadAdvertisementsFailure = createAction(
'[Advertisement] Load Advertisements Failure',
props<{ error: any }>()
);