import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessControlUserManagementComponent } from './access-control-user-management.component';

describe('AccessControlUserManagementComponent', () => {
  let component: AccessControlUserManagementComponent;
  let fixture: ComponentFixture<AccessControlUserManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessControlUserManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessControlUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
