import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AdminService } from '../service/admin.service';
import { catchError, map, of } from 'rxjs';

export const isAdminGuard: CanActivateChildFn = (childRoute, state) => {
  const adminService = inject(AdminService);
  const token: string | null = localStorage.getItem('token');
  const route: Router = inject(Router);
  const routes: string[] = ['/admin/login'];

  if(!token && !routes.includes(state.url)){
    route.navigate(['/admin/login'])
    return false;
  }else if(token && routes.includes(state.url)){
    route.navigate(['/admin/home']);
    return false;
  }else if(!token && routes.includes(state.url)){
    return true;
  }
  return adminService.verifyToken()
  .pipe(
    map(response => {
      if (!response.invalidToken) {
        return true;
      }

      localStorage.removeItem('token');
      route.navigate(['/admin/login']);
      return false;
    }),
    catchError(error => {
      localStorage.removeItem('token');
      route.navigate(['/admin/login']);
      return of(false);
    })
  );
};
