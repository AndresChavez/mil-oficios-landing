import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RegistrationApiService, RegistrationPayload } from './registration-api.service';
import { environment } from '../../environments/environment';

describe('RegistrationApiService', () => {
  let api: RegistrationApiService;
  let http: HttpTestingController;
  const payload: RegistrationPayload = { fullName: 'Persona de prueba', phone: '900000000', numberDocument: '00000000', specialty: 'Gasfitería, Electricidad', district: 'Lima', consent: true, documentType: 'DNI', description: '' };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    api = TestBed.inject(RegistrationApiService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('sends specialty and no alias to the configured endpoint', () => {
    let confirmed = false;
    api.submit(payload).subscribe(() => confirmed = true);
    const request = http.expectOne(environment.preRegisterEndpoint);
    expect(request.request.method).toBe('POST');
    expect(request.request.body.specialty).toBe('Gasfitería, Electricidad');
    expect(request.request.body).not.toHaveProperty('speciality');
    expect(confirmed).toBe(false);
    request.flush({ message: 'Registro exitoso' });
    expect(confirmed).toBe(true);
  });

  it('rejects an unexpected response and does not retry a failed submission', () => {
    let error: Error | undefined;
    api.submit(payload).subscribe({ error: value => error = value });
    http.expectOne(environment.preRegisterEndpoint).flush({});
    expect(error?.message).toBe('invalid-response');
    http.expectNone(environment.preRegisterEndpoint);
  });
});

