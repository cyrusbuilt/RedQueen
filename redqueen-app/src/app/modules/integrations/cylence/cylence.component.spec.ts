import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CylenceComponent } from './cylence.component';

describe('CylenceComponent', () => {
  let component: CylenceComponent;
  let fixture: ComponentFixture<CylenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CylenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CylenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
