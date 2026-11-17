import {Component, computed, inject, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {map} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-user-info',
  imports: [
    RouterLink
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  id = toSignal(
    this.route.paramMap.pipe(map(p => Number(p.get('id')))),
    { initialValue: 0 }
  );
  ime = signal('')
  role = signal('')
  korisnik = computed(() => this.authService.getKorisnikById(this.id()));

}
