import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {inject} from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const servis = inject(AuthService)
  const router = inject(Router)
  if(servis.currentUser()?.role === 'admin'){
    return true;
  }
  return router.createUrlTree(['/home']);
};
