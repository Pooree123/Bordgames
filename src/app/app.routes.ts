import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      animation: 'HomePage',
    },
  },

  {
    path: 'login',
    component: LoginComponent,
    data: {
      animation: 'LoginPage',
    },
  },

  {
    path: 'register',
    component: RegisterComponent,
    data: {
      animation: 'RegisterPage',
    },
  },
];
