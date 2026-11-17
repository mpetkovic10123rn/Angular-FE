import {Component, inject, signal} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

export const lozinkeSePoklapaju: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { mismatch: true };
};

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
    private servis = inject(AuthService);
    private router = inject(Router)

    username = signal('')
    password = signal('')
    confirmPassword = signal('')
    showPass = signal(false)
    isLoading = signal(false)
    poruka = signal('')

  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group(
    {
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: lozinkeSePoklapaju }
  );

  onClick(){

    const { username, password, confirmPassword } = this.form.getRawValue();
    this.isLoading.set(true);


    this.servis.checkUserForRegister(username,password, confirmPassword).subscribe(ok => {
    if(ok.success){
      this.router.navigate(['/home'])
    }else{
      this.poruka.set(ok.message)
    }
    this.isLoading.set(false);
    });
  }
  hideOrShow(){
    this.showPass.set(!this.showPass());
  }
  clean() {
    this.form.reset();
  }

}
