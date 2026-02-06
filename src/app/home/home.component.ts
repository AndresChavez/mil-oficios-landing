import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  private http = inject(HttpClient);

  loading = signal(false);
  okMsg = signal<string | null>(null);
  errMsg = signal<string | null>(null);
  form;

  constructor(private fb: FormBuilder, private https: HttpClient) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      specialty: ['', Validators.required],
      numberDocument: [''],
      district: ['', Validators.required],
      phone: ['', Validators.required],
      consent: [false, Validators.requiredTrue],
    });
  }
  showError(field: string): boolean {
        const control = this.form?.get(field);
        return !!(control && control.touched && control.invalid);
  }

  submit() {
    this.okMsg.set(null);
    this.errMsg.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errMsg.set('Por favor completa los campos obligatorios.');
      return;
    }

    const payload = this.form.getRawValue();

    this.loading.set(true);
    this.form.disable(); // deshabilita inputs + checkbox

    this.http
      .post<{ message: string }>(environment.preRegisterEndpoint, payload)
      .pipe(
        finalize(() => {
          this.loading.set(false);
          this.form.enable(); // vuelve a habilitar
        })
      )
      .subscribe({
        next: (res) => {
          this.okMsg.set(res?.message ?? '¡Listo! Te contactaremos pronto.');
          this.form.reset({
            fullName: '',
            specialty: '',
            numberDocument: '',
            district: '',
            phone: '',
            consent: false,
          });
        },
        error: (err) => {
          this.errMsg.set(err?.error?.message ?? 'No se pudo enviar. Intenta nuevamente.');
        },
      });
  }
}
