import {Component, Input} from '@angular/core';
import {Output,  EventEmitter} from '@angular/core';
import {User} from '../models/user';
@Component({
  selector: '[app-user-card]',
  imports: [],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css'
})
export class UserCardComponent {
  /*napravili smo komponentu koja moze posebno da se testira
    i da se iskoristi za neke druge potrebe
    cime smo olaksali teret iz user liste
   */
  @Input({required: true}) user!: User;
  @Output() deleteClicked = new EventEmitter<User>()

  obrisiKorisnika(event: Event) {
    event.stopPropagation();
    this.deleteClicked.emit(this.user)
  }

}
