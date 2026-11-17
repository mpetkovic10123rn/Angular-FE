import {Component, computed, inject, signal} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {User} from '../models/user';
import {UserCardComponent} from '../user-card/user-card.component';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'app-user-list',
  imports: [
    UserCardComponent,
    RouterLink
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  private servis = inject(AuthService);

  //currentUser = this.servis.currentUser;
  users = this.servis.users
  pretraga = signal('')



  filtriraniKorisnici = computed(() => {
    const tekst = this.pretraga().trim().toLowerCase();
    return this.users().filter(u => u.username.toLowerCase().includes(tekst));
  });

  obrisiKorisnika(korisnik: User){
    this.servis.obrisiKorisnika(korisnik)
  }
}
