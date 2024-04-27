import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import User from '../../models/User.interface';
import { Observable, catchError, tap } from 'rxjs';
import { AdminService } from '../../service/admin.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-admin-edit-user',
  standalone: true,
  imports: [
    RouterLink,
    AdminHeaderComponent,
    ReactiveFormsModule
  ],
  templateUrl: './admin-edit-user.component.html',
  styleUrl: './admin-edit-user.component.css'
})
export class AdminEditUserComponent {
  private userId: string = '';
  previewImg: string = '';
  public userData!: User;
  public editUserForm!: FormGroup;
  private profileImgFileObj: File | string = '';
  isFormSubmited: boolean = false;

  constructor(private route: ActivatedRoute, private adminService: AdminService, private router: Router) {
    this.editUserForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      confirmPassword: new FormControl(''),
      profileImg: new FormControl('')
    });
    this.userId = route.snapshot.params['userId'];
    this.adminService.getUserDetails(this.userId).pipe(
      tap((res) => {
        if(res.userData){
          this.userData = res.userData as User;
          
          this.previewImg = this.userData.profileImg as string;
          this.editUserForm = new FormGroup({
            name: new FormControl(this.userData.name, [Validators.required]),
            email: new FormControl(this.userData.email, [Validators.required, Validators.email, Validators.pattern(/^[A-Za-z0-9]+@gmail\.com$/)]),
            password: new FormControl(''),
            confirmPassword: new FormControl(''),
            profileImg: new FormControl('')
          });
        }
      }),
      catchError((err: any) => {
        console.error(err);
        return [];
      })
    ).subscribe();
    
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
        this.editUserForm.get('profileImg')?.setErrors({typeErr: true});
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
    this.isPassChanging();
    
    if(!this.editUserForm.valid || this.isFormSubmited) {
      return this.editUserForm.markAllAsTouched();
    };

    this.isFormSubmited = true;
    
    const { name, email, password, confirmPassword, profileImg } = this.editUserForm.value;

    const data: User = {
      name,
      email,
      password,
      confirmPassword,
      profileImg: this.previewImg
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

    const response$ = this.adminService.updateUser(this.userId, data);

    response$.pipe(
      tap((res) => {
        this.isFormSubmited = false;
        console.log(res,'update success');
        this.router.navigate(['/admin/home']);
      }),
      catchError((err: any) => {
        this.isFormSubmited = false;
        if(!err?.error) return [];
        const errFieldObj: { [key: string]: boolean } = {};
        const fieldName = err.error.errOpt as string; 
        errFieldObj[fieldName] = true;
        this.editUserForm.get(err.error.err)?.setErrors(errFieldObj);
        console.error(err);
        return [];
      })
    ).subscribe();
  }

  isPassChanging(): void {
    const {password, confirmPassword} = this.editUserForm.value;

    if(password && confirmPassword){
      if(password !== confirmPassword)this.editUserForm.get('confirmPassword')?.setErrors({notMatch: true});
      return;
    }

    if(password || confirmPassword){
      this.editUserForm.get('password')?.setErrors({err: this.isRequired(password)});
      this.editUserForm.get('confirmPassword')?.setErrors({err: this.isRequired(confirmPassword)});
    } 
  }

  isRequired(pass: string): boolean | null{
    if(pass){
      return null;
    }
    return true;
  }
}
