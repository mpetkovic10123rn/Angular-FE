import {computed, inject, Injectable, signal} from '@angular/core';
import {catchError, delay, Observable, of, tap} from 'rxjs';
import {User, UserWithPassword} from '../models/user';

import {RegisterResult} from '../models/RegisterResult';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _currentUser = signal<User | null>(null)
  currentUser = this._currentUser.asReadonly()
  private httpClient = inject(HttpClient);
  private _usersWithPassword = signal<UserWithPassword[]>([]);
  isLoaded = signal(false)
  loadError = signal('')
  constructor() {
    this.httpClient.get<UserWithPassword[]>(('/users.json')).pipe(
      tap((users) => {
        this.isLoaded.set(true);
      }),
      catchError(() =>{
        this.loadError.set('Korisnici nisu dobro ucitani')
        return of([] as UserWithPassword[]);
      })
      ).subscribe(lista => {
        this._usersWithPassword.set(lista)
      });
  }

  users = computed<User[]>(() => this._usersWithPassword().map(
    ({password, ...safe}) => safe));


  checkUser(username: string, password: string, rememberMe: boolean): Observable<boolean>{
    let found = false
    let user1: User | null = null
    for (const user of this._usersWithPassword()){
        if(username === user.username && password === user.password){
          found = true;
          const { password: _pw, ...safeUser } = user;
          user1 = safeUser
          break
        }
    }
    return of(found).pipe(delay(800), tap(ok => {
      if (!ok) return;
      if (ok)
        this._currentUser.set(user1)
      if(rememberMe){
        localStorage.setItem("username", username)
      }else{
        localStorage.removeItem("username")
      }
    }));
  }
  logout(){
    this._currentUser.set(null);
  }
  checkUserForRegister(username: string, password: string, confirmPassword: string): Observable<RegisterResult>{
    if(password !== confirmPassword){
      return of({success: false, message:"Lozinke se ne poklapaju"})
    }
    for (const user of this._usersWithPassword()){
      if(username === user.username){
        return of({success: false, message:"Korisnik sa datim imenom vec postoji"})
      }
    }
    const noviKorisnik: UserWithPassword = {
      id: Math.max(0, ...this._usersWithPassword().map(u => u.id)) + 1,
      username: username,
      role: 'user',
      password: password,
    };

    this._usersWithPassword.update(list => [...list, noviKorisnik]);
    const { password: _pw, ...safeUser } = noviKorisnik
    return of({success: true, message:"Uspesno ste se registrovali"}).pipe(delay(2000), tap(result => {
        if (result.success) {
          this._currentUser.set(safeUser)
        }
    }))
  }
  obrisiKorisnika(korisnik: User){
    this._usersWithPassword.update(() => this._usersWithPassword().filter((u: UserWithPassword) => u.id !== korisnik.id))
  }

  getKorisnikById(id: number): User | null{
    for(const u of this.users()){
      if(u.id === id){
        return u;
      }
    }
    return null;
  }
}
