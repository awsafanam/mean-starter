import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

// Layouts
import {P404Component} from './pages/404.component';

import {AuthGuard} from './models/auth.guard';
import {AppComponent} from './app.component';
import {HomeComponent} from './pages/home.component';
import {DashboardComponent} from "./dashboard/dashboard.component";

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        pathMatch: 'full',
    },
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadChildren: 'app/auth/login/login.module#LoginModule'
            },
            {
                path: 'logout',
                loadChildren: 'app/auth/logout/logout.module#LogoutModule'
            },
            {
                path: 'register',
                loadChildren: 'app/auth/signup/signup.module#SignupModule'
            }
        ],
        data: {
            title: 'Home'
        },
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        // canActivate: [AuthGuard],
    },
    // otherwise redirect to home
    { path: '**', component: P404Component }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
