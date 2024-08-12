import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DashboardService } from "src/app/core/services/dashboard/dashboard.service";
import { loadAdvertisements, loadAdvertisementsFailure, loadAdvertisementsSuccess } from "./advertisement.action";
import { catchError, switchMap, map, of, tap } from "rxjs";
import { Injectable } from '@angular/core';

@Injectable()
export class AdvertisementEffects {
    loadAdvertisements$ = createEffect(() =>
        this.actions$.pipe(
          ofType(loadAdvertisements),
          tap(() => console.log('Load Advertisements Action Dispatched')),
          switchMap(({ brand, model, page }) => 
            this._dashService.filterAdvertisements(brand, model, page).pipe(
              map(advertisements => {
                console.log('Advertisements Fetched:', advertisements);
                return loadAdvertisementsSuccess({ advertisements });
              }),
              catchError(error => {
                console.error('Error Occurred:', error);  // Ensure errors are logged
                return of(loadAdvertisementsFailure({ error }));
              })
            )
          )
        )
      );

  constructor(
    private actions$: Actions,
    private _dashService: DashboardService
  ) {}
}