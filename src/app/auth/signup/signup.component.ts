import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';

import {UserService} from '../../models/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
    private _signupForm: FormGroup;
    private _formErrors: any;
    private _submitted = false;
    private _errorMessage = '';
    public _showConfirmation = false;

    constructor(private _userService: UserService,
                private _router: Router,
                private _formBuilder: FormBuilder) {

        const password = new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]));
        const passwordConfirm = new FormControl('', Validators.compose([Validators.required, CustomValidators.equalTo(password)]));

        this._signupForm = _formBuilder.group({
            email: ['', Validators.compose([
                Validators.required,
                CustomValidators.email,
            ])],
            password: password,
            password_confirm: passwordConfirm,      // use standalone variable to use equalTo
        });

        this._signupForm.valueChanges
            .subscribe(data => this.onValueChanged(data));

    }

    private _setFormErrors(errorFields:any):void{
        for (const key in errorFields) {
            // skip loop if the property is from prototype
            if (!errorFields.hasOwnProperty(key)) {
                continue;
            }

            const message = errorFields[key];
            this._formErrors[key].valid = false;
            this._formErrors[key].message = message;
        }
    }

    private _resetFormErrors():void{
        this._formErrors = {
            username: {valid: true, message: ''},
            email: {valid: true, message: ''},
            password: {valid: true, message: ''},
            password_confirm: {valid: true, message: ''},
        };
    }

    private _isValid(field):boolean {
        let isValid:boolean = false;

        // If the field is not touched and invalid, it is considered as initial loaded form. Thus set as true
        if(this._signupForm.controls[field].touched == false) {
            isValid = true;
        }
        // If the field is touched and valid value, then it is considered as valid.
        else if(this._signupForm.controls[field].touched == true && this._signupForm.controls[field].valid == true) {
            isValid = true;
        }
        return isValid;
    }

    public onValueChanged(data?: any) {
        if (!this._signupForm) { return; }
        const form = this._signupForm;
        for (let field in this._formErrors) {
            // clear previous error message (if any)
            let control = form.get(field);
            if (control && control.dirty) {
                this._formErrors[field].valid = true;
                this._formErrors[field].message = '';
            }
        }
    }

    ngOnInit() {
        this._resetFormErrors();
        this._userService.logout();
    }

    public onSubmit(elementValues: any) {
        this._submitted = true;
        this._userService.signup(elementValues.email, elementValues.password)
            .subscribe(
                result => {
                    if (result.success) {
                        // show confirmation dialog
                        this._showConfirmation = true;
                    } else {
                        this._errorMessage = 'Registration is failed. Please check and try again.';
                        this._submitted = false;
                    }
                },
                error => {
                    this._submitted = false;
                    // Validation error
                    if(error.status === 422) {
                        this._resetFormErrors();
                        // this._errorMessage = "There was an error on submission. Please check again.";
                        const errorFields = JSON.parse(error.data.message);
                        this._setFormErrors(errorFields);
                    } else {
                        this._errorMessage = error.data;
                    }
                }
            );
    }
}
