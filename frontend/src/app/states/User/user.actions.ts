import { createAction, props } from "@ngrx/store";
import { UserData, UserLogin } from "../Models/User.interface";

export const login = createAction(
    '[User Component] Login',
    props<{ formData: UserLogin }>()
);

export const loginSuccess = createAction(
    '[User Component] Login Success',
    props<{ user: UserData, token: string }>()
);

export const loginFailure = createAction(
    '[User Component] Login Failure',
    props<{ error: any }>()
);

export const getUserData = createAction(
    '[User Home Component] Get User Data'
);

export const getUserDataSuccess = createAction(
    '[User Home Component] Get User Data Success',
    props<{user: UserData}>()
);

export const getUserDataFailure = createAction(
    '[User Home Component] Get User Data Failure',
    props<{ error: any }>()
);