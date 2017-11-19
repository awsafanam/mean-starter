import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';

import {GlobalService} from './global.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Router} from '@angular/router';

import {Observable} from 'rxjs/Observable';
import {JwtHelperService} from '@auth0/angular-jwt';

interface AuthResponse {
    user: string,
    success: boolean;
    token: string;
}

@Injectable()
export class UserService {
    private loggedIn = false;
    public redirectURL = '/auth/login';
    public jwtHelper: JwtHelperService = new JwtHelperService({});

    constructor(private _globalService: GlobalService,
                private _router: Router,
                private _http: HttpClient) {
        this.loggedIn = this.isLoggedIn();
    }

    public login(username, password) {
        const headers = new HttpHeaders().set( 'Content-Type', 'application/json; charset=UTF-8');
        return this._http
            .post(
                this._globalService.apiHost + '/account/login',
                {
                    'email': username,
                    'password': password
                },
                { headers }
            )
            .map((response: AuthResponse) => {
                if (response.success) {
                    localStorage.setItem('access_token', response.token);
                    this.loggedIn = true;
                } else {
                    localStorage.removeItem('access_token');
                    this.loggedIn = false;
                }
                return response;
            })
            .catch(this.handleError);
    }

    public signup(email, password) {
        const headers = new HttpHeaders().set( 'Content-Type', 'application/json; charset=UTF-8');

        return this._http
            .post(
                this._globalService.apiHost + '/account/register',
                {
                    'email': email,
                    'password': password
                },
                { headers }
            )
            .map((response: AuthResponse) => {
                return response;
            })
            .catch(this.handleError);
    }

    public signupConfirm(id, auth_key) {
        return this._http
            .post(
                this._globalService.apiHost + '/account/confirm',
                JSON.stringify({
                    'SignupConfirmForm': {
                        'id': id,
                        'auth_key': auth_key,
                    }
                })
            )
            .map((response: AuthResponse) => {
                if (response.success) {
                } else {
                }
                return response;
            })
            .catch(this.handleError);
    }

    public passwordResetRequest(email) {
        return this._http
            .post(
                this._globalService.apiHost + '/account/password-reset-request',
                JSON.stringify({
                    'PasswordResetRequestForm': {
                        'email': email
                    }
                })
            )
            .map((response: AuthResponse) => {
                if (response.success) {
                } else {
                }
                return response;
            })
            .catch(this.handleError);
    }


    public passwordResetTokenVerification(token) {
        return this._http
            .post(
                this._globalService.apiHost + '/account/password-reset-token-verification',
                JSON.stringify({
                    'PasswordResetTokenVerificationForm': {
                        'token': token,
                    }
                }),
            )
            .map((response: AuthResponse) => {
                if (response.success) {
                } else {
                }
                return response;
            })
            .catch(this.handleError);
    }

    public passwordReset(token, password) {
        return this._http
            .post(
                this._globalService.apiHost + '/account/password-reset',
                JSON.stringify({
                    'PasswordResetForm': {
                        'token': token,
                        'password': password
                    }
                })
            )
            .map((response: AuthResponse) => {
                if (response.success) {
                } else {
                }
                return response;
            })
            .catch(this.handleError);
    }

    public logout(): void {
        localStorage.removeItem('access_token');
        this.loggedIn = false;
    }

    public getToken(): any {
        return localStorage.getItem('access_token');
    }

    private checkToken(): any {
        return !!localStorage.getItem('access_token');
    }

    public unauthorizedAccess(error: any): void {
        this.logout();
        this._router.navigate(['/login']);
    }

    public isLoggedIn(): boolean {
        return this.checkToken() && !this.jwtHelper.isTokenExpired(localStorage.getItem('access_token'));
    }

    public getJWTValue(): any {
        if (this.isLoggedIn()) {
            const token = this.getToken();
            return this.jwtHelper.decodeToken(token);
        } else {
            return null;
        }
    }

    private handleError(error: HttpResponse<any> | any) {

        let errorMessage: any = {};
        // Connection error
        if (error.status === 0) {
            errorMessage = {
                success: false,
                status: 0,
                data: 'Sorry, there was a connection error occurred. Please try again.',
            };
        } else {
            errorMessage = error.json();
        }
        return Observable.throw(errorMessage);
    }
}
