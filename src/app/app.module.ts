import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {HomeComponent} from './pages/home.component';
import {JwtModule} from '@auth0/angular-jwt';
import {HttpClientModule} from '@angular/common/http';
import {P404Component} from './pages/404.component';
import {AppRoutingModule} from './app.routing';
import {UserService} from './models/user.service';
import {GlobalService} from './models/global.service';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthGuard} from './models/auth.guard';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        P404Component,
        DashboardComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: () => {
                    return localStorage.getItem('access_token');
                },
                whitelistedDomains: ['localhost:3001'],
                throwNoTokenError: false
            }
        })
    ],
    providers: [GlobalService, UserService, AuthGuard],
    bootstrap: [AppComponent]
})
export class AppModule {
}
