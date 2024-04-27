import { Component } from '@angular/core';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import User from '../../models/User.interface';
import { AdminService } from '../../service/admin.service';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    AdminHeaderComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  addUserForm!: FormGroup;
  profileImgFileObj: string | File = '';
  previewImg = '';
  isFormSubmited: boolean = false;

  constructor(private router: Router, private adminService: AdminService) {
    this.addUserForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(/^[A-Za-z0-9]+@gmail\.com$/)]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      profileImg: new FormControl('')
    });
  }

  loadFile(event: any): void {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;

    if (files && (files.length > 0 && files.length < 2)) {
      const ImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const validImageExtensions = new Set(ImageExtensions);
      const exec = files[0].name.substring(files[0].name.lastIndexOf('.'));
      if(!validImageExtensions.has(exec)){
        target.value ='';
        this.addUserForm.get('profileImg')?.setErrors({required: true});
        //`Please select images Only`
        this.addUserForm.get('profileImg')?.setErrors({typeErr: true});
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

  isPassMatch(): void {
    const { password, confirmPassword } = this.addUserForm.value;

    if(password && confirmPassword && (password !== confirmPassword)){
      this.addUserForm.get('confirmPassword')?.setErrors({notMatch: true});
    }
  }

  async onSubmit(): Promise<void> {
    this.isPassMatch();
    
    if(!this.addUserForm.valid || this.isFormSubmited){
      return this.addUserForm.markAllAsTouched();
    }

    this.isFormSubmited = true;

    const { name, email, password, confirmPassword } = this.addUserForm.value;

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

    const response$ = this.adminService.addUser(data);

    response$.pipe(
      tap((res) => {
        this.isFormSubmited = false;
        console.log(res,'update success');
        this.router.navigate(['/admin/home']);
      }),
      catchError((err: any) => {
        this.isFormSubmited = false;
        console.error(err);
        return [];
      })
    ).subscribe();
  }
}
