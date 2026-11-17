import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';

describe('Home FAQ', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  function renderFaq() {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const section = (fixture.nativeElement as HTMLElement).querySelector('#preguntas-frecuentes')!;
    const triggers = Array.from(section.querySelectorAll<HTMLButtonElement>('.faq-trigger'));
    const panelFor = (trigger: HTMLButtonElement) => section.querySelector<HTMLElement>(`#${trigger.getAttribute('aria-controls')}`)!;
    return { fixture, section, triggers, panelFor };
  }

  it('starts with eight closed accordions and unique, linked controls and panels', () => {
    const { triggers, panelFor } = renderFaq();
    expect(triggers).toHaveLength(8);
    expect(new Set(triggers.map(trigger => trigger.id)).size).toBe(8);
    expect(new Set(triggers.map(trigger => trigger.getAttribute('aria-controls'))).size).toBe(8);
    for (const trigger of triggers) {
      expect(trigger.type).toBe('button');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(panelFor(trigger).hidden).toBe(true);
      expect(panelFor(trigger).getAttribute('aria-labelledby')).toBe(trigger.id);
    }
  });

  it('keeps another answer open when a question is opened or closed', () => {
    const { fixture, triggers, panelFor } = renderFaq();
    triggers[0].click();
    triggers[1].click();
    fixture.detectChanges();
    expect(panelFor(triggers[0]).hidden).toBe(false);
    expect(panelFor(triggers[1]).hidden).toBe(false);
    expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
    expect(triggers[1].getAttribute('aria-expanded')).toBe('true');

    triggers[0].click();
    fixture.detectChanges();
    expect(panelFor(triggers[0]).hidden).toBe(true);
    expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
    expect(panelFor(triggers[1]).hidden).toBe(false);
    expect(panelFor(triggers[2]).hidden).toBe(true);
  });

});
