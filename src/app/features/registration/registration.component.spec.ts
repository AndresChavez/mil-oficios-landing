import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Subject, throwError } from 'rxjs';
import { RegistrationApiService } from '../../core/registration-api.service';
import { SPECIALITIES, LIMA_DISTRICTS } from '../../core/catalogs';
import { RegistrationComponent } from './registration.component';

describe('RegistrationComponent', () => {
  let fixture: ComponentFixture<RegistrationComponent>;
  let component: RegistrationComponent;
  let response: Subject<{ message: string }>;
  const api = { submit: vi.fn() };

  beforeEach(async () => {
    response = new Subject<{ message: string }>();
    api.submit.mockReset().mockReturnValue(response.asObservable());
    await TestBed.configureTestingModule({
      imports: [RegistrationComponent],
      providers: [provideRouter([]), { provide: RegistrationApiService, useValue: api }],
    }).compileComponents();
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => { vi.restoreAllMocks(); });

  function completeForm(): void {
    component.form.setValue({
      fullName: 'Persona de prueba', phone: '999999999',
      specialities: SPECIALITIES.slice(0, 2), otherSpeciality: '', districts: LIMA_DISTRICTS.slice(0, 2),
      documentType: 'DNI', numberDocument: '12345678', description: 'Experiencia de prueba', consent: true,
    });
    component.form.markAsDirty();
    component.nextStep();
  }

  it('requires a valid first step, accepts exact Peruvian mobile format and preserves data when going back', () => {
    component.nextStep();
    expect(component.step()).toBe(1);
    expect(component.form.controls.fullName.touched).toBe(true);
    completeForm();
    expect(component.step()).toBe(2);
    component.previousStep();
    expect(component.form.controls.fullName.value).toBe('Persona de prueba');
    for (const invalidPhone of ['199999999', '9999999999', '999 99999', 'abcdefghi']) {
      component.form.controls.phone.setValue(invalidPhone);
      expect(component.firstStepValid).toBe(false);
    }
    component.form.controls.phone.setValue('999999999');
    expect(component.firstStepValid).toBe(true);
  });

  it('validates document type and requires affirmative consent', () => {
    completeForm();
    component.form.controls.documentType.setValue('CE');
    expect(component.form.controls.numberDocument.invalid).toBe(true);
    component.form.controls.numberDocument.setValue('ABC123456');
    expect(component.form.valid).toBe(true);
    component.form.controls.documentType.setValue('DNI');
    expect(component.form.controls.numberDocument.invalid).toBe(true);
    component.form.controls.numberDocument.setValue('12345678');
    component.form.controls.consent.setValue(false);
    component.submit();
    expect(api.submit).not.toHaveBeenCalled();
    expect(component.form.controls.consent.touched).toBe(true);
  });

  it('sends the agreed multi-selection payload once and confirms only after a positive response', () => {
    completeForm();
    component.submit();
    component.submit();
    expect(api.submit).toHaveBeenCalledTimes(1);
    expect(api.submit).toHaveBeenCalledWith({
      fullName: 'Persona de prueba', phone: '999999999', numberDocument: '12345678',
      documentType: 'DNI', specialty: SPECIALITIES.slice(0, 2).join(', '),
      district: LIMA_DISTRICTS.slice(0, 2).join(', '), description: 'Experiencia de prueba', consent: true,
    });
    expect(component.loading()).toBe(true);
    expect(component.submitted()).toBe(false);
    response.next({ message: 'Recibido' });
    response.complete();
    expect(component.submitted()).toBe(true);
    expect(component.canLeave()).toBe(true);
    expect(component.form.controls.phone.value).toBe('');
  });

  it.each([0, 500, 503])('preserves data and blocks blind resubmission after uncertain HTTP %s', status => {
    api.submit.mockReturnValue(throwError(() => new HttpErrorResponse({ status, error: { message: 'sensitive server detail' } })));
    completeForm();
    component.submit();
    expect(component.submitted()).toBe(false);
    expect(component.submissionBlocked()).toBe(true);
    expect(component.form.controls.phone.value).toBe('999999999');
    expect(component.errorMessage()).not.toContain('sensitive server detail');
    component.submit();
    expect(api.submit).toHaveBeenCalledTimes(1);
  });

  it('does not treat an invalid 200 response as success', () => {
    api.submit.mockReturnValue(throwError(() => new Error('invalid-response')));
    completeForm();
    component.submit();
    expect(component.submitted()).toBe(false);
    expect(component.submissionBlocked()).toBe(true);
  });

  it.each([400, 429])('allows a deliberate correction or later retry after definite rejection %s', status => {
    api.submit.mockReturnValue(throwError(() => new HttpErrorResponse({ status })));
    completeForm();
    component.submit();
    expect(component.submissionBlocked()).toBe(false);
    expect(component.form.enabled).toBe(true);
    expect(component.form.controls.phone.value).toBe('999999999');
    expect(component.errorMessage()).toBeTruthy();
  });

  it('keeps a duplicate separate from success and directs the user to consult', () => {
    api.submit.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 409 })));
    completeForm();
    component.submit();
    expect(component.submitted()).toBe(false);
    expect(component.submissionBlocked()).toBe(true);
    expect(component.errorMessage()).toContain('Ya existe');
  });

  it('warns before abandoning dirty data and protects refresh without storing it', () => {
    expect(component.canLeave()).toBe(true);
    completeForm();
    const confirm = vi.spyOn(globalThis, 'confirm').mockReturnValue(false);
    expect(component.canLeave()).toBe(false);
    expect(confirm).toHaveBeenCalledOnce();
    const event = new Event('beforeunload', { cancelable: true }) as BeforeUnloadEvent;
    component.beforeUnload(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('searches districts without accents while retaining selected districts', () => {
    component.form.controls.districts.setValue(LIMA_DISTRICTS.slice(0, 1));
    expect(component.filteredDistricts).toEqual([]);
    component.districtSearch.set('SUR');
    expect(component.filteredDistricts).toEqual(['Santiago de Surco', 'Surquillo']);
    component.districtSearch.set(' surc ');
    expect(component.filteredDistricts).toEqual(['Santiago de Surco']);
    component.districtSearch.set('jesus');
    expect(component.filteredDistricts).toEqual(['Jesús María']);
    component.districtSearch.set('no-such-district');
    expect(component.filteredDistricts).toHaveLength(0);
    expect(component.form.controls.districts.value).toEqual(LIMA_DISTRICTS.slice(0, 1));
  });

  it('clears district matches after selection without losing previously chosen zones', () => {
    component.form.controls.districts.setValue(['Miraflores']);
    component.districtSearch.set('sur');
    component.toggleSelection('districts', 'Santiago de Surco', { target: { checked: true } } as unknown as Event);
    expect(component.districtSearch()).toBe('');
    expect(component.filteredDistricts).toEqual([]);
    expect(component.form.controls.districts.value).toEqual(['Miraflores', 'Santiago de Surco']);
    component.districtSearch.set('jesus');
    component.toggleSelection('specialities', 'Pintura', { target: { checked: true } } as unknown as Event);
    expect(component.districtSearch()).toBe('jesus');
  });

  it('keeps selected district chips when the search changes and exposes a remove action', () => {
    completeForm();
    component.form.controls.districts.setValue(['Santiago de Surco']);
    component.districtSearch.set('sur');
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('.district-option')).toHaveLength(2);
    component.districtSearch.set('jesus');
    fixture.detectChanges();
    expect(root.querySelectorAll('.district-option')).toHaveLength(1);
    const remove = root.querySelector<HTMLButtonElement>('button[aria-label="Quitar Santiago de Surco"]')!;
    expect(remove).not.toBeNull();
    remove.click();
    expect(component.form.controls.districts.value).toEqual([]);
    expect(component.form.controls.districts.invalid).toBe(true);
    expect(component.form.controls.districts.dirty).toBe(true);
  });

  it('removes only the chosen district and protects selection during submission', () => {
    component.form.controls.districts.setValue(['Santiago de Surco', 'Surquillo']);
    component.loading.set(true);
    component.removeDistrict('Surquillo');
    expect(component.form.controls.districts.value).toHaveLength(2);
    component.loading.set(false);
    component.submissionBlocked.set(true);
    component.removeDistrict('Surquillo');
    expect(component.form.controls.districts.value).toHaveLength(2);
    component.submissionBlocked.set(false);
    component.removeDistrict('Surquillo');
    expect(component.form.controls.districts.value).toEqual(['Santiago de Surco']);
  });

  it('requires a meaningful custom trade only when Otro is selected and associates its error', () => {
    component.form.patchValue({ fullName: 'Persona de prueba', phone: '999999999', specialities: ['Otro'] });
    component.nextStep();
    fixture.detectChanges();
    expect(component.step()).toBe(1);
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('#other-speciality')!;
    expect(input.required).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toContain('other-speciality-error');
    for (const value of ['', '   ', ' A ', 'ab', 'x'.repeat(81)]) {
      component.form.controls.otherSpeciality.setValue(value);
      expect(component.firstStepValid).toBe(false);
    }
    for (const value of ['Carpintería', 'x'.repeat(80)]) {
      component.form.controls.otherSpeciality.setValue(value);
      expect(component.firstStepValid).toBe(true);
    }
    component.form.controls.specialities.setValue(['Pintura']);
    component.form.controls.otherSpeciality.setValue('x'.repeat(81));
    fixture.detectChanges();
    expect(component.firstStepValid).toBe(true);
    expect((fixture.nativeElement as HTMLElement).querySelector('#other-speciality')).toBeNull();
  });

  it('retains a custom trade between steps and when Otro is unchecked and selected again', () => {
    completeForm();
    component.previousStep();
    component.form.controls.specialities.setValue(['Otro']);
    component.form.controls.otherSpeciality.setValue('Carpintería');
    component.nextStep();
    component.previousStep();
    expect(component.form.controls.otherSpeciality.value).toBe('Carpintería');
    component.toggleSelection('specialities', 'Otro', { target: { checked: false } } as unknown as Event);
    component.toggleSelection('specialities', 'Otro', { target: { checked: true } } as unknown as Event);
    expect(component.form.controls.otherSpeciality.value).toBe('Carpintería');
    expect(component.firstStepValid).toBe(true);
  });

  it('sends the trimmed custom trade through specialty and clears it after success', () => {
    completeForm();
    component.form.patchValue({ specialities: ['Gasfitería', 'Otro'], otherSpeciality: '  Carpintería  ' });
    component.submit();
    const payload = api.submit.mock.calls[0][0];
    expect(payload.specialty).toBe('Gasfitería, Otro: Carpintería');
    expect(payload.description).toBe('Experiencia de prueba');
    expect(payload).not.toHaveProperty('otherSpeciality');
    expect(payload).not.toHaveProperty('speciality');
    response.next({ message: 'Recibido' });
    response.complete();
    expect(component.form.controls.otherSpeciality.value).toBe('');
  });

  it('excludes an unselected custom trade from the request', () => {
    completeForm();
    component.form.controls.otherSpeciality.setValue('Carpintería');
    component.submit();
    expect(api.submit.mock.calls[0][0].specialty).toBe(SPECIALITIES.slice(0, 2).join(', '));
    expect(api.submit.mock.calls[0][0]).not.toHaveProperty('otherSpeciality');
  });

  it('retains the custom trade and its validation after a definite server rejection', () => {
    api.submit.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 422 })));
    completeForm();
    component.form.patchValue({ specialities: ['Otro'], otherSpeciality: 'Carpintería' });
    component.submit();
    expect(component.submitted()).toBe(false);
    expect(component.form.controls.otherSpeciality.value).toBe('Carpintería');
    expect(component.form.controls.otherSpeciality.enabled).toBe(true);
    component.previousStep();
    component.form.controls.otherSpeciality.setValue('');
    expect(component.firstStepValid).toBe(false);
  });
});

describe('Registration speciality entry links', () => {
  const api = { submit: vi.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'especialistas/registro', component: RegistrationComponent }]),
        { provide: RegistrationApiService, useValue: api },
      ],
    }).compileComponents();
  });

  async function open(query = ''): Promise<RegistrationComponent> {
    const harness = await RouterTestingHarness.create();
    return harness.navigateByUrl('/especialistas/registro' + query, RegistrationComponent);
  }

  it.each(SPECIALITIES)('preselects the catalog option %s without modifying consent or marking data dirty', async speciality => {
    const component = await open('?speciality=' + encodeURIComponent(speciality));
    expect(component.form.controls.specialities.value).toEqual([speciality]);
    expect(component.form.controls.consent.value).toBe(false);
    expect(component.form.pristine).toBe(true);
    expect(component.canLeave()).toBe(true);
    if (speciality === 'Otro') {
      expect(component.hasOtherSpeciality).toBe(true);
      expect(component.form.controls.otherSpeciality.invalid).toBe(true);
    }
  });

  it.each(['', '?speciality=desconocida', '?speciality=', '?speciality=Gasfiter%C3%ADa&speciality=Pintura', '?specialty=Pintura'])('ignores missing, unknown, ambiguous or obsolete parameters: %s', async query => {
    const component = await open(query);
    expect(component.form.controls.specialities.value).toEqual([]);
    expect(component.form.controls.specialities.invalid).toBe(true);
  });

  it('allows removing the initial option and adding others, preserving choices between steps', async () => {
    const component = await open('?speciality=Otro');
    component.toggleSelection('specialities', 'Pintura', { target: { checked: true } } as unknown as Event);
    component.toggleSelection('specialities', 'Otro', { target: { checked: false } } as unknown as Event);
    component.form.controls.fullName.setValue('Persona de prueba');
    component.form.controls.phone.setValue('999999999');
    component.nextStep();
    expect(component.step()).toBe(2);
    component.previousStep();
    expect(component.form.controls.specialities.value).toEqual(['Pintura']);
    expect(component.form.controls.fullName.value).toBe('Persona de prueba');
  });
});
