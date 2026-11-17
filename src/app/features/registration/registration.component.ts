import { Component, DestroyRef, ElementRef, HostListener, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, CanDeactivateFn, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, TimeoutError } from 'rxjs';
import { RegistrationApiService, RegistrationPayload } from '../../core/registration-api.service';
import { LIMA_DISTRICTS, SPECIALITIES } from '../../core/catalogs';
import { IconComponent } from '../../shared/icon.component';

const nonBlank = (control: AbstractControl): ValidationErrors | null =>
  typeof control.value === 'string' && control.value.trim().length >= 3 ? null : { nonBlank: true };

const selectedFrom = (catalog: readonly string[]) => (control: AbstractControl): ValidationErrors | null =>
  Array.isArray(control.value) && control.value.length > 0 &&
  control.value.every((value: unknown) => typeof value === 'string' && catalog.includes(value))
    ? null : { selection: true };

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, IconComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent {
  private readonly api = inject(RegistrationApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly initialSpecialities = inject(ActivatedRoute).snapshot.queryParamMap.getAll('speciality');

  readonly specialities = SPECIALITIES;
  readonly districts = LIMA_DISTRICTS;
  readonly step = signal<1 | 2>(1);
  readonly loading = signal(false);
  readonly submitted = signal(false);
  readonly errorMessage = signal('');
  readonly submissionBlocked = signal(false);
  readonly districtSearch = signal('');
  readonly helpUrl = 'https://wa.me/51980941418?text=Hola%2C%20quisiera%20consultar%20el%20estado%20de%20mi%20solicitud%20como%20especialista.';

  readonly form = new FormGroup({
    fullName: new FormControl('', { nonNullable: true, validators: [nonBlank, Validators.maxLength(120)] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^9\d{8}$/)] }),
    specialities: new FormControl<string[]>(
      this.initialSpecialities.length === 1 && SPECIALITIES.includes(this.initialSpecialities[0]) ? [...this.initialSpecialities] : [],
      { nonNullable: true, validators: [selectedFrom(SPECIALITIES)] },
    ),
    otherSpeciality: new FormControl('', { nonNullable: true }),
    districts: new FormControl<string[]>([], { nonNullable: true, validators: [selectedFrom(LIMA_DISTRICTS)] }),
    documentType: new FormControl<'DNI' | 'CE'>('DNI', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^(DNI|CE)$/)] }),
    numberDocument: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{8}$/)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(1000)] }),
    consent: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });

  constructor() {
    const updateOtherSpeciality = () => {
      const control = this.form.controls.otherSpeciality;
      control.setValidators(this.hasOtherSpeciality ? [nonBlank, Validators.maxLength(80)] : []);
      control.updateValueAndValidity({ emitEvent: false });
    };
    updateOtherSpeciality();
    this.form.controls.specialities.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(updateOtherSpeciality);
    this.form.controls.documentType.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(type => {
      this.form.controls.numberDocument.setValidators([
        Validators.required,
        Validators.pattern(type === 'DNI' ? /^\d{8}$/ : /^[a-zA-Z0-9]{9,12}$/),
      ]);
      this.form.controls.numberDocument.updateValueAndValidity();
    });
  }

  get firstStepValid(): boolean {
    const controls = this.form.controls;
    return controls.fullName.valid && controls.phone.valid && controls.specialities.valid && controls.otherSpeciality.valid;
  }

  get hasOtherSpeciality(): boolean {
    return this.form.controls.specialities.value.includes('Otro');
  }

  get filteredDistricts(): readonly string[] {
    const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
    const search = normalize(this.districtSearch().trim());
    if (!search) return [];
    return this.districts.filter(district => normalize(district).includes(search));
  }

  invalid(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.invalid && control.touched;
  }

  toggleSelection(field: 'specialities' | 'districts', value: string, event: Event): void {
    if (this.loading() || this.submissionBlocked()) return;
    const control = this.form.controls[field];
    const checked = (event.target as HTMLInputElement).checked;
    control.setValue(checked ? [...new Set([...control.value, value])] : control.value.filter(item => item !== value));
    control.markAsDirty();
    control.markAsTouched();
    if (field === 'districts' && checked) {
      this.districtSearch.set('');
      this.focus('#district-search');
    }
  }

  searchDistricts(event: Event): void {
    this.districtSearch.set((event.target as HTMLInputElement).value);
  }

  removeDistrict(district: string): void {
    if (this.loading() || this.submissionBlocked()) return;
    const control = this.form.controls.districts;
    control.setValue(control.value.filter(value => value !== district));
    control.markAsDirty();
    control.markAsTouched();
    this.focus('#district-search');
  }

  nextStep(): void {
    if (this.loading() || this.submissionBlocked()) return;
    for (const key of ['fullName', 'phone', 'specialities'] as const) this.form.controls[key].markAsTouched();
    if (this.hasOtherSpeciality) this.form.controls.otherSpeciality.markAsTouched();
    if (!this.firstStepValid) {
      this.focus('[aria-invalid="true"]');
      return;
    }
    this.errorMessage.set('');
    this.step.set(2);
    this.focus('#registration-title');
  }

  previousStep(): void {
    if (this.loading() || this.submissionBlocked()) return;
    this.errorMessage.set('');
    this.step.set(1);
    this.focus('#registration-title');
  }

  submit(): void {
    if (this.loading() || this.submitted() || this.submissionBlocked()) return;
    if (this.step() === 1) {
      this.nextStep();
      return;
    }
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      if (!this.firstStepValid) this.step.set(1);
      this.focus('[aria-invalid="true"]');
      return;
    }
    const value = this.form.getRawValue();
    const payload: RegistrationPayload = {
      fullName: value.fullName.trim(), phone: value.phone,
      documentType: value.documentType, numberDocument: value.numberDocument.trim(),
      specialty: value.specialities.map(speciality => speciality === 'Otro' ? `Otro: ${value.otherSpeciality.trim()}` : speciality).join(', '),
      district: value.districts.join(', '),
      description: value.description.trim(), consent: value.consent,
    };
    this.errorMessage.set('');
    this.loading.set(true);
    this.form.disable();
    this.api.submit(payload).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.loading.set(false);
        if (!this.submitted() && !this.submissionBlocked()) this.form.enable();
      }),
    ).subscribe({
      next: () => {
        this.submitted.set(true);
        this.form.reset();
        this.form.disable();
        this.districtSearch.set('');
        this.focus('#registration-success');
      },
      error: (error: unknown) => {
        this.handleError(error);
        this.focus('#registration-error');
      },
    });
  }

  private handleError(error: unknown): void {
    const status = error instanceof HttpErrorResponse ? error.status : 0;
    if (status === 400 || status === 422) {
      this.errorMessage.set('No pudimos validar los datos. Revisa tu información en ambos pasos y vuelve a enviarla.');
    } else if (status === 409) {
      this.submissionBlocked.set(true);
      this.errorMessage.set('Ya existe una solicitud con estos datos. Consulta su estado por WhatsApp antes de enviar otra.');
    } else if (status === 429) {
      this.errorMessage.set('Se han realizado demasiados intentos. Espera unos minutos antes de volver a enviar tu solicitud.');
    } else if (error instanceof TimeoutError || status === 0 || status >= 500) {
      this.submissionBlocked.set(true);
      this.errorMessage.set('No pudimos confirmar si recibimos tu solicitud. Conservamos tus datos en esta pantalla. Consulta por WhatsApp antes de volver a enviarla para evitar duplicados.');
    } else {
      this.errorMessage.set('No pudimos procesar la solicitud. Puedes consultar por WhatsApp para recibir ayuda.');
    }
  }

  canLeave(): boolean {
    return this.submitted() || (!this.form.dirty && !this.loading()) ||
      globalThis.confirm('Tienes un registro sin completar. Si sales, perderás los datos de esta pantalla. ¿Quieres salir?');
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnload(event: BeforeUnloadEvent): void {
    if (!this.submitted() && (this.form.dirty || this.loading())) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  private focus(selector: string): void {
    setTimeout(() => this.host.nativeElement.querySelector<HTMLElement>(selector)?.focus(), 0);
  }
}

export const registrationCanDeactivate: CanDeactivateFn<RegistrationComponent> = component => component.canLeave();
