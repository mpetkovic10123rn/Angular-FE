import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {authGuard} from './guard/auth.guard';
import {RegisterComponent} from './register/register.component';
import {UserListComponent} from './user-list/user-list.component';
import {adminGuard} from './guard/admin.guard';
import {UserInfoComponent} from './user-info/user-info.component';

export const routes: Routes = [
  {path: '',
   component: LoginComponent
  },{
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },{
    path: 'register',
    component: RegisterComponent
  },{
    path: 'user-list',
    component: UserListComponent,
    canActivate: [adminGuard]
  },{
    path: 'user-list/:id',
    component: UserInfoComponent,
    canActivate: [adminGuard]
  }
];
