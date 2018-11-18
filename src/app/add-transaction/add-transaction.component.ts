import { Component, OnInit, HostBinding } from '@angular/core';
import { BarBeerDrinkerService } from '../barbeerdrinker.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ErrorDialogComponent } from '../modify/modify.component';

@Component({
    selector: 'app-transaction',
    templateUrl: './add-transaction.component.html',
    styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent implements OnInit {

    @HostBinding('class.d-flex') dFlex = 'd-flex';
    @HostBinding('class.flex-column') flexColumn = 'flex-column';
    @HostBinding('class.flex-grow-1') flexGrow = 'flex-grow-1';

    dataSource: Array<Object> = [];
    columns: string[] = [];
    IDValue = 'UNIQUEID1';
    timeValue = '2018-11-19T15:53:00';
    totalValue = '120';
    tipValue = '56.74';
    barValue = 'Fay Inc';
    drinkerValue = 'Jerald Feeney';
    spinnerHidden = true;

    constructor(private bbd: BarBeerDrinkerService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

    ngOnInit() {
    }

    onSubmit() {
        this.spinnerHidden = false;
        this.bbd.query('INSERT INTO BarBeerDrinker.Bills' +
            ' VALUES ("' + this.IDValue + '","' + this.timeValue + '",' + this.totalValue + ',' + this.tipValue + ')').then(() => {
                return Promise.all([
                    this.bbd.query('INSERT INTO BarBeerDrinker.BillsIssued (bill, bar)' +
                        ' VALUES ("' + this.IDValue + '","' + this.barValue + '")'),
                    this.bbd.query('INSERT INTO BarBeerDrinker.BillsOwed (bill, drinker)' +
                        ' VALUES ("' + this.IDValue + '","' + this.drinkerValue + '")'),
                ]).then((results) => {
                    this.snackBar.open('Bill Added');
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

                    this.bbd.query('DELETE FROM Bills b WHERE b.transactionID="' + this.IDValue + '"');
                });
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
