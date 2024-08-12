import { createFeatureSelector, createSelector } from "@ngrx/store";

const selectMessagesState = createFeatureSelector<number>('messages')

export const selectMessageCount = createSelector(
    selectMessagesState,
    (state:number) => state
)