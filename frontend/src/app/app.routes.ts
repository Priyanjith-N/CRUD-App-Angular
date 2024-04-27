import { Routes } from '@angular/router';
import { UserSideComponentComponent } from './pages/user-side-component/user-side-component.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { isAuthGuard } from './AuthRoutes/is-auth.guard';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { AdminSideComponent } from './pages/admin-side/admin-side.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminEditUserComponent } from './components/admin-edit-user/admin-edit-user.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { isAdminGuard } from './AuthRoutes/is-admin.guard';

export const routes: Routes = [
    {
        path: '',
        component: UserSideComponentComponent,
        title: 'Home',
        canActivateChild: [isAuthGuard],
        children: [
            {
                path: '',
                title: 'Home',
                component: HomeComponent,
            },
            {
                path: 'login',
                title: 'Login',
                component: LoginComponent
            },
            {
                path: 'register',
                title: 'register',
                component: RegisterComponent
            }
        ]
    },
    {
        path: 'admin',
        component: AdminSideComponent,
        title: 'Admin',
        canActivateChild: [isAdminGuard],
        children: [
            {
                path: 'login',
                component: AdminLoginComponent,
                title: 'Admin Login'
            },
            {
                path: 'home',
                component: AdminHomeComponent,
                title: 'Admin Home'
            },
            {
                path: 'editUser/:userId',
                component: AdminEditUserComponent,
                title: 'Edit User'
            },
            {
                path: 'addUser',
                component: AddUserComponent,
                title: 'Add User'
            }
        ]
    },
    {
        path: '**',
        title: '404 Page Not Found',
        component: NotFoundPageComponent
    }
];
