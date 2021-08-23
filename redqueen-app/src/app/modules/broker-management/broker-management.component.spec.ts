import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerManagementComponent } from './broker-management.component';

describe('BrokerManagementComponent', () => {
  let component: BrokerManagementComponent;
  let fixture: ComponentFixture<BrokerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
