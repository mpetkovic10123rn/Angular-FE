import {Component, inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private servis = inject(AuthService)
  private router = inject(Router)
  currentUser = this.servis.currentUser
  logout(){
    this.servis.logout();
    this.router.navigate([''])
  }
}
