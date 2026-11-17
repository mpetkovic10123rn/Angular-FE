import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const servis = inject(AuthService)
  const router = inject(Router)
  if(servis.currentUser()){ // samo ako je korsnik ispravno unesen moze da se predje na home
    return true;
  }
  return router.createUrlTree(['/']);
};
