import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import User from '../../models/User.interface';
import { Store, select } from '@ngrx/store';
import { selectError, selectIsLoading, selectUser } from '../../states/User/user.selectors';
import * as UserActions from '../../states/User/user.actions';
import { UpdateUserData } from '../../states/Models/User.interface';
import { UserService } from '../../service/user.service';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'app-edit-profile-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit-profile-form.component.html',
  styleUrl: './edit-profile-form.component.css'
})
export class EditProfileFOrmComponent {
  @Output() closeEditProfileForm: EventEmitter<boolean> = new EventEmitter<boolean>();
  isFormSubmited: boolean = false;

  user$ = this.store.pipe(select(selectUser));
  isLoading$ = this.store.pipe(select(selectIsLoading));
  error$ = this.store.pipe(select(selectError));

  private profileImgFileObj: File | string = '';
  previewImg: string = ''
  editProfileForm!: FormGroup;
  constructor(private store: Store<any>, private userService: UserService){
    this.editProfileForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(/^[A-Za-z0-9]+@gmail\.com$/)]),
      currentPass: new FormControl(''),
      newPass: new FormControl(''),
      confirmPass: new FormControl(''),
      profileImg: new FormControl('')
    });
    this.store.dispatch(UserActions.getUserData());
    this.user$.subscribe((res) => {
      if(this.isFormSubmited){
        this.onClick();
      }
      this.isFormSubmited = false;
      if(res){
        this.editProfileForm.get('name')?.setValue(res.name);
        this.editProfileForm.get('email')?.setValue(res.email);
        this.previewImg = res.profileImg;
      }
    });
    this.error$.subscribe((res) => {
      if(res?.error){

      }
    })
  }


  loadFile(event: any): void {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;

    if (files && (files.length > 0 && files.length < 2)) {
      const ImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const validImageExtensions = new Set(ImageExtensions);
      const exec = files[0].name.substring(files[0].name.lastIndexOf('.'));
      if(!validImageExtensions.has(exec)){
        //`Please select images Only`
        this.editProfileForm.get('profileImg')?.setErrors({typeErr: true});
        target.value = '';
      }else{
        const file = files[0];
        this.profileImgFileObj = file;
        this.previewImg = URL.createObjectURL(file);
      }
    } else {
      this.profileImgFileObj = '';
      this.previewImg = '';
    }
  }

  async onSubmit(): Promise<void> {
    this.isPassChanging()
    if(!this.editProfileForm.valid || this.isFormSubmited){
      return this.editProfileForm.markAllAsTouched();
    }

    this.isFormSubmited = true;

    const { name, email, currentPass, newPass, confirmPass, profileImg } = this.editProfileForm.value;

    const data: UpdateUserData = {
      name,
      email,
      currentPass,
      newPass,
      confirmPass,
    };

    if(this.profileImgFileObj){
      await new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(this.profileImgFileObj as File);
        fileReader.onload = () => {
            data.profileImg = fileReader.result as string;
            resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
            reject(error);
        };
      });
    }

    this.userService.updateUser(data).pipe(
      tap((res) => {
        if(res){
          this.store.dispatch(UserActions.getUserData());
        }
      }),
      catchError((err: any) => {
        if(err.error){
          const errFieldObj: { [key: string]: boolean } = {};
          const fieldName = err.error.errOpt as string; 
          errFieldObj[fieldName] = true;
          this.editProfileForm.get(err.error.err)?.setErrors(errFieldObj); 
          this.isFormSubmited = false;         
        }
        return []
      })
    ).subscribe();
  }

  isPassChanging(): void {
    const {currentPass, newPass, confirmPass} = this.editProfileForm.value;

    if(currentPass && newPass && confirmPass){
      if(newPass !== confirmPass)this.editProfileForm.get('confirmPass')?.setErrors({notMatch: true});
      return;
    }

    if(currentPass || newPass || confirmPass){
      this.editProfileForm.get('currentPass')?.setErrors({err: this.isRequired(currentPass)});
      this.editProfileForm.get('newPass')?.setErrors({err: this.isRequired(newPass)});
      this.editProfileForm.get('confirmPass')?.setErrors({err: this.isRequired(confirmPass)});
    }
  }

  isRequired(pass: string): boolean{
    if(pass){
      return false;
    }

    return true;
  }

  onClick(): void{
    this.closeEditProfileForm.emit(false);
  }
}
