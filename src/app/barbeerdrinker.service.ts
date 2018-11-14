import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class BarBeerDrinkerService {

    constructor(public httpClient: HttpClient) { }

    query(queryString: String): Promise<Array<Object>> {
        return new Promise((resolve, reject) => {
            const body = {
                query: queryString
            };
            return this.httpClient.post(environment.apiUrl, body).toPromise().then((response) => {
                if (response['statusCode'] === 200) {
                    return resolve(JSON.parse(response['body'])['results']);
                } else {
                    return reject(response);
                }
            }).catch((response) => {
                return reject(response);
            });
        });
    }

}
