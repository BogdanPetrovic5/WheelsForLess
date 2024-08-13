import { createAction, props } from "@ngrx/store";

export const setNewChat = createAction(
    '[New Chat] Set new chat',
    props<{url:string | null}>()
)