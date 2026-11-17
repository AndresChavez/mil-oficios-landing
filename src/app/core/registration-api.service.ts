import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, timeout } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RegistrationPayload {
  fullName: string;
  phone: string;
  numberDocument: string;
  specialty: string;
  district: string;
  consent: boolean;
  documentType: 'DNI' | 'CE';
  description: string;
}

export interface RegistrationResponse { message: string; }

@Injectable({ providedIn: 'root' })
export class RegistrationApiService {
  private readonly http = inject(HttpClient);

  submit(payload: RegistrationPayload): Observable<RegistrationResponse> {
    // append is not idempotent: never retry a request automatically.
    return this.http.post<unknown>(environment.preRegisterEndpoint, payload).pipe(
      timeout({ first: 15_000 }),
      map((response) => {
        if (!response || typeof response !== 'object' ||
            !('message' in response) || typeof response.message !== 'string' || !response.message.trim()) {
          throw new Error('invalid-response');
        }
        return { message: response.message };
      }),
    );
  }
}
