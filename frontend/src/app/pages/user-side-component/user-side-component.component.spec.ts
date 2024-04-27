import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSideComponentComponent } from './user-side-component.component';

describe('UserSideComponentComponent', () => {
  let component: UserSideComponentComponent;
  let fixture: ComponentFixture<UserSideComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSideComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserSideComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
