import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraphGui } from './graph-gui';

describe('GraphGui', () => {
  let component: GraphGui;
  let fixture: ComponentFixture<GraphGui>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphGui]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphGui);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
