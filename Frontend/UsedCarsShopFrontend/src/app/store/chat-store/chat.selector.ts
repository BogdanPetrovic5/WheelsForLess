import { createSelector } from "@ngrx/store"

export const seletChatState = (state:any) => state.url
export const selectUrl = createSelector(
    seletChatState,
    (state) => state.url
)