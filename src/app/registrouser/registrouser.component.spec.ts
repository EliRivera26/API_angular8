import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrouserComponent } from './registrouser.component';

describe('RegistrouserComponent', () => {
  let component: RegistrouserComponent;
  let fixture: ComponentFixture<RegistrouserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrouserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrouserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
