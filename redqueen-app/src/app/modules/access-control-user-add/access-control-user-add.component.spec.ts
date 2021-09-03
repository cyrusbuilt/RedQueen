import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessControlUserAddComponent } from './access-control-user-add.component';

describe('AccessControlUserAddComponent', () => {
  let component: AccessControlUserAddComponent;
  let fixture: ComponentFixture<AccessControlUserAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessControlUserAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessControlUserAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
