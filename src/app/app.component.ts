import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './navbar/navbar.component';

import { FooterComponent } from './footer/footer.component';

import { routeAnimations } from './animations/route-animation';
import { AlertComponent } from './components/alert/alert.component';
import { SocialSidebarComponent } from './social-sidebar/social-sidebar.component';


@Component({
  selector: 'app-root',

  standalone: true,

  imports: [RouterOutlet, NavbarComponent, FooterComponent,AlertComponent,SocialSidebarComponent],

  animations: [routeAnimations],

  templateUrl: './app.component.html',

  styleUrl: './app.component.css',
})
export class AppComponent {
  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }
}
