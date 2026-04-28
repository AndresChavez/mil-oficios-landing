import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { form } from '@angular/forms/signals';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private readonly whatsappNumber = '51980941418';

  specialistForm: FormGroup;

  loading = signal(false);
  private readonly okMessage = signal('');
  private readonly errMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.specialistForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      celular: ['', [Validators.required, Validators.minLength(9)]],
      docIdentidad: ['', [Validators.required, Validators.minLength(8)]],
      especialidad: ['', [Validators.required, Validators.minLength(3)]],
      zona: ['', [Validators.required, Validators.minLength(2)]],
      experiencia: [''],
      consent: [false, [Validators.requiredTrue]]
    });
  }

  buildWhatsAppUrl(message: string): string {
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  goToWhatsApp(): void {
    const url = this.buildWhatsAppUrl(
      'Hola, necesito un especialista de Mil Oficios'
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  okMsg(): string {
    return this.okMessage();
  }

  errMsg(): string {
    return this.errMessage();
  }

  fieldInvalid(fieldName: string): boolean {
    const field = this.specialistForm.get(fieldName);
    return !!field && field.invalid && (field.touched || field.dirty);
  }

  private clearMessageAfterDelay(): void {
    setTimeout(() => {
      this.okMessage.set('');
      this.errMessage.set('');
    }, 5000);
  }

  private setSuccess(message: string): void {
    this.errMessage.set('');
    this.okMessage.set(message);
    this.clearMessageAfterDelay();
  }

  private setError(message: string): void {
    this.okMessage.set('');
    this.errMessage.set(message);
    this.clearMessageAfterDelay();
  }

  private validatePhone(value: string): boolean {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.length >= 9;
  }

  submitForm(): void {
    this.clearMessageAfterDelay();

    if (this.specialistForm.invalid) {
      this.specialistForm.markAllAsTouched();
      this.setError('Completa correctamente los campos obligatorios.');
      return;
    }

    const formValue = this.specialistForm.getRawValue();

    if (!this.validatePhone(formValue.celular)) {
      this.setError('Ingresa un número de celular válido.');
      return;
    }

    const payload = {
      fullName: formValue.nombre,
      phone: formValue.celular,
      numberDocument: formValue.docIdentidad,
      speciality: formValue.especialidad,
      district: formValue.zona,
      //experiencia: formValue.experiencia,
      consent: formValue.consent,
      //source: 'miloficios-landing',
      //createdAt: new Date().toISOString()
    };

    this.loading.set(true);
    this.specialistForm.disable();

    this.http
      .post<{ message: string }>(environment.preRegisterEndpoint, payload)
      .pipe(
        finalize(() => {
          this.loading.set(false);
          this.specialistForm.enable();
        })
      )
      .subscribe({
        next: (res) => {
          this.setSuccess('Gracias, recibimos tu registro y te contactaremos pronto.');

          this.specialistForm.reset({
            nombre: '',
            celular: '',
            docIdentidad: '',
            especialidad: '',
            zona: '',
            experiencia: '',
            consent: false
          });
        },
        error: (err) => {
          this.setError(
            err?.error?.message ?? 'No se pudo enviar. Intenta nuevamente.'
          );
        }
      });
  }
}