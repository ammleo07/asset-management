import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetLogComponent } from './asset-log.component';

describe('AssetLogComponent', () => {
  let component: AssetLogComponent;
  let fixture: ComponentFixture<AssetLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
