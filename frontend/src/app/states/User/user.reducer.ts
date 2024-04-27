import { createReducer, on } from "@ngrx/store";
import { UserData } from "../Models/User.interface";
import * as UserActions from './user.actions';

export interface UserState {
    user: UserData | null;
    isLoading: boolean;
    error: any | null;
}

export const initialState: UserState = {
    user: null,
    isLoading: false,
    error: null,
}

export const userReducer = createReducer(
    initialState,
    on(UserActions.login, (state: UserState) => ({
        ...state, 
        isLoading: true, 
        error: null
    })),
    on(UserActions.loginSuccess, (state: UserState, action: { user: UserData, token: string }) => ({
        ...state,
        user: action.user,
        isLoading: false,
        error: null
    })),
    on(UserActions.loginFailure, (state: UserState, action: { error: any }) => ({
        ...state,
        isLoading: false,
        error: action.error
    })),


    on(UserActions.getUserData, (state: UserState) => ({
        ...state,
        isLoading: true,
        error: null
    })),
    on(UserActions.getUserDataSuccess, (state: UserState, action: { user: UserData}) => {
        return {
            ...state,
            isLoading: false,
            user: action.user,
            error: null
        }
    }),
    on(UserActions.getUserDataFailure, (state: UserState, action: { error: any }) => {
        return {
            ...state,
            isLoading: false,
            user: null,
            error: action.error
        }
    })
);