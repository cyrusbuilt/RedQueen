import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CylightsComponent } from './cylights.component';

describe('CylightsComponent', () => {
  let component: CylightsComponent;
  let fixture: ComponentFixture<CylightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CylightsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CylightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
