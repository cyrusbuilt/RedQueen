import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArdudeskComponent } from './ardudesk.component';

describe('ArdudeskComponent', () => {
  let component: ArdudeskComponent;
  let fixture: ComponentFixture<ArdudeskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArdudeskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArdudeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
