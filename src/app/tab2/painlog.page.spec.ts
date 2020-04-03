import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { PainLogPage } from './painlog.page';

describe('PainLogPage', () => {
  let component: PainLogPage;
  let fixture: ComponentFixture<PainLogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PainLogPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PainLogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
