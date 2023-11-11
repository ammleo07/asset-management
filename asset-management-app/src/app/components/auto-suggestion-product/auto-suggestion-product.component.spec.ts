import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoSuggestionProductComponent } from './auto-suggestion-product.component';

describe('AutoSuggestionProductComponent', () => {
  let component: AutoSuggestionProductComponent;
  let fixture: ComponentFixture<AutoSuggestionProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoSuggestionProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoSuggestionProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
