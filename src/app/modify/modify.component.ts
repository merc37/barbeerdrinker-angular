import { Component, OnInit, Inject } from '@angular/core';
import { BarBeerDrinkerService } from '../barbeerdrinker.service';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-modify',
    templateUrl: './modify.component.html',
    styleUrls: ['./modify.component.css']
})
export class ModifyComponent implements OnInit {

    modifyValue = 'INSERT INTO Items (name, manufacturer, type) VALUES("New Beer","Company","beer")';
    spinnerHidden = true;

    constructor(private bbd: BarBeerDrinkerService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

    ngOnInit() {
    }

    onSubmit() {
        this.spinnerHidden = false;
        this.bbd.query(this.modifyValue).then((result) => {
            this.snackBar.open('Modification Complete', null, {
                duration: 4000
            });
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

export interface DialogData {
    message: string;
}

@Component({
    selector: 'app-error-dialog',
    templateUrl: 'error-dialog.html',
})
export class ErrorDialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}
