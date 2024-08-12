import { Expansion } from "@angular/compiler"
import { createReducer, on } from "@ngrx/store"
import { decrementMessages, incrementMessages } from "./messages.actions"

export const initialState = 0;

const _messagesReducer = createReducer(
    initialState,
    on(incrementMessages, state => state + 1),
    on(decrementMessages, (state, { amount }) => state - (amount || 1))
)
export function messageReducer(state:any, action:any){
    return _messagesReducer(state, action)
}