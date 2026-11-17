import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    @if (name === 'whatsapp-monochrome') {
      <span class="whatsapp-monochrome" [style.width.px]="size" [style.height.px]="size" aria-hidden="true"></span>
    } @else if (name === 'whatsapp' || name.startsWith('whatsapp-')) {
      <img [src]="whatsappAsset" [width]="size" [height]="size" alt="" aria-hidden="true" />
    } @else {
      <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true" focusable="false">
        <use [attr.href]="'assets/icons/services.svg#' + name" />
      </svg>
    }
  `,
  styles: `:host{display:inline-flex;flex-shrink:0;align-items:center;justify-content:center;vertical-align:middle}img,svg{display:block;max-width:none}.whatsapp-monochrome{display:block;background-color:currentColor;mask:url('/assets/brand/whatsapp-black.svg') center/contain no-repeat}`,
})
export class IconComponent {
  @Input() name = 'arrow-right';
  @Input() size = 22;

  get whatsappAsset(): string {
    const variant = this.name === 'whatsapp-black' ? 'black' : this.name === 'whatsapp-white' ? 'white' : 'green';
    return `assets/brand/whatsapp-${variant}.svg`;
  }
}
