import {Component, computed, DestroyRef, inject, signal} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router'
import {interval, take} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private servis = inject(AuthService);
  private router = inject(Router)
  private destroyRef = inject(DestroyRef)



  isValid = signal<boolean | null>(null);//jos nije kliknuo ili jeste pa dobija vrednost
  showPass = signal(false)
  counter = signal(0)
  currentUser = this.servis.currentUser
  isLoading = signal(false)
  remainingSeconds = signal(0)
  totalSeconds = 30
  rememberMe = signal(localStorage.getItem('username') !== null)
  isLoaded = this.servis.isLoaded
  loadError = this.servis.loadError
  private fb = inject(FormBuilder)

  form = this.fb.nonNullable.group({
    username: [localStorage.getItem('username') ?? '', Validators.required],
    password: ['', Validators.required ],
  })
  /*
  brojac = signal(0);
  duplo = computed(() => {
    console.log('računam');
    console.log('racunam 2')
    return this.brojac() * 2;
  });

  constructor() {
    console.log(this.duplo())
    console.log(this.duplo())
    this.brojac.set(5)
    console.log(this.duplo())
  }
   */

  onClick(){
    this.isLoading.set(true);
    const { username, password } = this.form.getRawValue();
    this.servis.checkUser(username, password, this.rememberMe()).subscribe(ok => {
        this.isValid.set(ok)
        if(ok){
          this.counter.set(0);
          this.router.navigate(['/home']);
        }
        if(!ok){
          this.counter.update(v => v + 1)
          if(this.counter() >= 3){
            this.startLockout();
          }
        }
        this.isLoading.set(false);
    });
  }
  hideOrShow(){
    this.showPass.set(!this.showPass());
  }
  clean(){
    this.form.reset();
  }

  private startLockout(){
    this.remainingSeconds.set(this.totalSeconds);

    interval(1000).pipe(               // na svakih 1 sekundu emituje veci broj, opsirniije, emituje sekvencu brojeva od 0 do n
      takeUntilDestroyed(this.destroyRef),   // emituje complete u slucaju unistavanja komponeten pa se desva unsubscribe zavrsava se emitovanje
      take(this.totalSeconds)                     //definisemo koilika je sekvenca brojeva koju emituje interval
    ).subscribe(() => {
      this.remainingSeconds.update(v => v - 1);
      if (this.remainingSeconds() === 0) {
        this.counter.set(0);                 // otključaj ponovo
      }
    });
  }
  register(){
    this.router.navigate(["/register"])
  }
}
