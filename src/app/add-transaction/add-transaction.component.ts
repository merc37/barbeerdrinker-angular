import { Component, OnInit, HostBinding } from '@angular/core';
import { BarBeerDrinkerService } from '../barbeerdrinker.service';
import { MatSnackBar } from '@angular/material';

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
  IDValue = '' ;
  timeValue = '';
  totalValue = '';
  tipValue = '';
  barValue = '';
  drinkerValue = '';
  spinnerHidden = true;

// 'SELECT * FROM Items WHERE type="beer" ORDER BY Rand() LIMIT 10'

  constructor(private bbd: BarBeerDrinkerService, private snackBar: MatSnackBar) {}

  ngOnInit() {
  }

  onSubmit() {
    this.spinnerHidden = false;
      Promise.all([
        this.bbd.query('INSERT INTO BarBeerDrinker.BillsIssued (bill, bar)' +
        ' VALUES (' + this.IDValue + ',' + this.barValue + ')'),
        this.bbd.query('INSERT INTO BarBeerDrinker.BillsOwed (bill, drinker)' +
        ' VALUES (' + this.IDValue + ',' + this.drinkerValue + ')'),
        this.bbd.query('INSERT INTO BarBeerDrinker.Bills (transactionID, time, total, tip)' +
        ' VALUES (' + this.IDValue + ',' + this.timeValue + ',' + this.totalValue + ',' + this.tipValue + ')')
      ]).then((results) => {
        this.spinnerHidden = true;
      }).catch((err) => {
        console.log();
      });

    }

}
