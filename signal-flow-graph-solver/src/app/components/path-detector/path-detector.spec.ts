import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathDetector } from './path-detector';

describe('PathDetector', () => {
  let component: PathDetector;
  let fixture: ComponentFixture<PathDetector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PathDetector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PathDetector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
