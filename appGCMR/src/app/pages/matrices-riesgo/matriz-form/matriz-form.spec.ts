import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizForm } from './matriz-form';

describe('MatrizForm', () => {
  let component: MatrizForm;
  let fixture: ComponentFixture<MatrizForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrizForm],
    }).compileComponents();

    fixture = TestBed.createComponent(MatrizForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
