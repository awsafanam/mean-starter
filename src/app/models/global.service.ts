import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';


@Injectable()
export class GlobalService {

    public setting: any = {};
    public apiHost: string;

    constructor() {
        if (environment.production === true) {
            this.apiHost = '/v1';
        } else {
            this.apiHost = '/v1';
        }
    }

    loadGlobalSettingsFromLocalStorage(): void {
        if (localStorage.getItem('web-setting') != null) {
            this.setting = JSON.parse(localStorage.getItem('web-setting'));
        }
    }
}
