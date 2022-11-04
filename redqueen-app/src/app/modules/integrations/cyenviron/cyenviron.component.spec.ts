import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyenvironComponent } from './cyenviron.component';

describe('CyenvironComponent', () => {
  let component: CyenvironComponent;
  let fixture: ComponentFixture<CyenvironComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyenvironComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyenvironComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
