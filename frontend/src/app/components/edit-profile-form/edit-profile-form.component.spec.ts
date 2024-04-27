import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileFOrmComponent } from './edit-profile-form.component';

describe('EditProfileFOrmComponent', () => {
  let component: EditProfileFOrmComponent;
  let fixture: ComponentFixture<EditProfileFOrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProfileFOrmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditProfileFOrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
