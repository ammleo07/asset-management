import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LOVComponent } from './lov.component';

describe('LOVComponent', () => {
  let component: LOVComponent;
  let fixture: ComponentFixture<LOVComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LOVComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LOVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
