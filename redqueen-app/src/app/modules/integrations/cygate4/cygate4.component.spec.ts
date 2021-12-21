import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cygate4Component } from './cygate4.component';

describe('Cygate4Component', () => {
  let component: Cygate4Component;
  let fixture: ComponentFixture<Cygate4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Cygate4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Cygate4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
