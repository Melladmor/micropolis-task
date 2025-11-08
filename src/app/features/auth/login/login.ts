import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { Spinner } from '../../../components/spinner/spinner';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Spinner],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);

  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  loading() {
    return this.auth.loading;
  }
  error = this.auth.error;

  onSubmit() {
    if (this.form.invalid) {
      this.markFormTouched(this.form);
      return;
    }
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
    });
  }
  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
  markFormTouched(form: FormGroup) {
    Object.values(form.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
}
