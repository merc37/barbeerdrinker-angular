import { Component, OnInit, HostBinding } from '@angular/core';
import { BarBeerDrinkerService } from '../barbeerdrinker.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ErrorDialogComponent } from '../modify/modify.component';

@Component({
    selector: 'app-query',
    templateUrl: './query.component.html',
    styleUrls: ['./query.component.css']
})
export class QueryComponent implements OnInit {

    @HostBinding('class.d-flex') dFlex = 'd-flex';
    @HostBinding('class.flex-column') flexColumn = 'flex-column';
    @HostBinding('class.flex-grow-1') flexGrow = 'flex-grow-1';

    dataSource: Array<Object> = [];
    columns: string[] = [];
    queryValue = 'SELECT * FROM Beers LIMIT 20';
    spinnerHidden = true;

    constructor(private bbd: BarBeerDrinkerService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

    ngOnInit() {
    }

    onSubmit() {
        this.spinnerHidden = false;
        this.bbd.query(this.queryValue).then((results) => {
            this.dataSource = results;
            this.columns = Object.keys(results[0]);

            if (this.dataSource.length === 0) {
                this.snackBar.open('This query returned No Results', null, {
                    duration: 4000
                });
            }
            this.spinnerHidden = true;
        }).catch((err) => {
            if (err['error']) {
                err = err['error'];
                if (err['sqlMessage']) {
                    err = err['sqlMessage'];
                }
            }
            this.dialog.open(ErrorDialogComponent, {
                data: { message: err },
            });
            this.spinnerHidden = true;
        });

    }

}
