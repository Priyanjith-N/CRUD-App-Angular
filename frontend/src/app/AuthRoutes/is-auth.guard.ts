import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../service/user.service';
import { catchError, map, of, tap } from 'rxjs';

export const isAuthGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const userService = inject(UserService);
  const token: string | null = localStorage.getItem('token');
  const route: Router = inject(Router);
  const routes: string[] = ['/login', '/register'];
  if(!token && !routes.includes(state.url)){
    route.navigate(['/login'])
    return false;
  }else if(token && routes.includes(state.url)){
    route.navigate(['/']);
    return false;
  }else if(!token && routes.includes(state.url)){
    return true;
  }
  
  return userService.verifyToken()
    .pipe(
      map(response => {
        if (!response.invalidToken) {
          return true;
        }

        localStorage.removeItem('token');
        route.navigate(['/login']);
        return false;
      }),
      catchError(error => {
        localStorage.removeItem('token');
        route.navigate(['/login']);
        return of(false);
      })
    );
};