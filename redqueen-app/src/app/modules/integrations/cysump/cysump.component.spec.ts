import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CysumpComponent } from './cysump.component';

describe('CysumpComponent', () => {
  let component: CysumpComponent;
  let fixture: ComponentFixture<CysumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CysumpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CysumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
