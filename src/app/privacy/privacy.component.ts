import { Component } from '@angular/core';
import { BUSINESS_IDENTITY } from '../core/business-identity';

@Component({
  selector: 'app-privacy',
  standalone: true,
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.css'
})
export class PrivacyComponent {
  readonly businessIdentity = BUSINESS_IDENTITY;
}
