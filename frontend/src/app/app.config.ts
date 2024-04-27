import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { initialState, userReducer } from './states/User/user.reducer';
import { UserEffects } from './states/User/user.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
     provideHttpClient(), 
     provideStore(),
     provideStore({user: userReducer}),
     provideState({name: 'user', reducer: userReducer}),
     provideEffects(UserEffects)
    ]
};
