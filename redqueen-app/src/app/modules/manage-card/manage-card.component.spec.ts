import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCardComponent } from './manage-card.component';

describe('ManageCardComponent', () => {
  let component: ManageCardComponent;
  let fixture: ComponentFixture<ManageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
