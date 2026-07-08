import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatricesList } from './matrices-list';

describe('MatricesList', () => {
  let component: MatricesList;
  let fixture: ComponentFixture<MatricesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatricesList],
    }).compileComponents();

    fixture = TestBed.createComponent(MatricesList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
