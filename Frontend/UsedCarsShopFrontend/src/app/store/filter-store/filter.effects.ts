
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { applyFilters } from "./filter.action";
import { combineLatest, of, switchMap } from "rxjs";
import { selectBrandFilter, selectModelFilter } from "./filter.selector";
import { loadAdvertisements } from "../advertisement-store/advertisement.action";


@Injectable()
export class FilterEffects {
  applyFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(applyFilters),
      switchMap(() => 
        combineLatest([
          this.store.pipe(select(selectBrandFilter)),
          this.store.pipe(select(selectModelFilter))
        ]).pipe(
          switchMap(([brand, model]) =>
            of(loadAdvertisements({ brand, model, page: 1 }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store
  ) {}
}