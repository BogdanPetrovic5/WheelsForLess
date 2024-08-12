import { createAction, props } from "@ngrx/store";

export const incrementMessages = createAction(
    '[Messages] Increment new messages'
)
export const decrementMessages = createAction(
    '[Messages] Decrement new messages',
    props<{ amount: number | null}>() 

)