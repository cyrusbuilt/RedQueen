import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CygarageComponent } from './cygarage.component';

describe('CygarageComponent', () => {
  let component: CygarageComponent;
  let fixture: ComponentFixture<CygarageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CygarageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CygarageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
