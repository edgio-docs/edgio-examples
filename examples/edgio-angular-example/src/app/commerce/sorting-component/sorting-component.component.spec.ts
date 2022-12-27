import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SortingComponentComponent } from './sorting-component.component'

describe('SortingComponentComponent', () => {
  let component: SortingComponentComponent
  let fixture: ComponentFixture<SortingComponentComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SortingComponentComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(SortingComponentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
