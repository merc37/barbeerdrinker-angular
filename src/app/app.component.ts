import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MatToolbar, MatButton, MatMenu } from '@angular/material';

import { environment } from '../environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app';

    constructor(private httpClient: HttpClient) {
        // const httpOptions = {
        //     body: JSON.stringify({
        //         query: 'SELECT * FROM Bars'
        //     }),
        //     headers: new HttpHeaders({
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json',
        //         'Access-Control-Allow-Origin': '*'
        //     }),
        // };

        // httpClient.post(environment.apiUrl, httpOptions).toPromise().then((response) => {
        //     console.log('WORKED:');
        //     console.log(response);
        // }).catch((response) => {
        //     console.log('ERROR:');
        //     console.log(response);
        // });
    }
}
