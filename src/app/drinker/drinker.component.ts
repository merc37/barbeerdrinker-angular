/*tslint:disable:max-line-length*/

import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { BarBeerDrinkerService } from '../barbeerdrinker.service';
import { MatTable, MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-drinker',
    templateUrl: './drinker.component.html',
    styleUrls: ['./drinker.component.css'],
})
export class DrinkerComponent implements OnInit {

    @HostBinding('class.d-flex') dFlex = 'd-flex';
    @HostBinding('class.flex-column') flexColumn = 'flex-column';
    @HostBinding('class.flex-grow-1') flexGrow = 'flex-grow-1';

    @ViewChild('table') tableRef: MatTable<Object>;

    dataSource: Array<Object> = [];
    columns: string[] = [];
    drinkerValue = '';
    spinnerHidden = true;

    chartTypeBar = 'bar';

    beersOrderedMostData: any[] = [];
    beersOrderedMostLabels: string[] = [];
    beersOrderedMostOptions = {
        title: {
            display: true,
            text: ''
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };

    spendingTimeBarData: any[] = [];
    spendingTimeBarLabels: string[] = [];
    spendingTimeBarOptions = {
        title: {
            display: true,
            text: ''
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };

    constructor(private bbd: BarBeerDrinkerService, private snackBar: MatSnackBar) {
        this.spinnerHidden = false;
        bbd.query('SELECT * FROM Drinkers ORDER BY Rand() LIMIT 10').then((results) => {
            this.dataSource = results;
            this.columns = Object.keys(results[0]);
            if (this.dataSource.length === 0) {
                snackBar.open('This query returned No Results', null, {
                    duration: 4000
                });
            }
            this.spinnerHidden = true;
        }).catch((err) => {
            console.log(err);
            snackBar.open('An error occurred. See console for details.', null, {
                duration: 4000
            });
            this.spinnerHidden = true;
        });
    }

    ngOnInit() {
    }

    onSubmit() {
        this.spinnerHidden = false;
        Promise.all([
            this.bbd.query('SELECT B.transactionID, DATE_FORMAT(B.time, \'%Y %D %M %h:%i:%s\') as time, B.total + B.Tip as spending,\
                BI.bar, BO.drinker FROM BarBeerDrinker.Bills as B, BarBeerDrinker.BillsIssued as BI, BarBeerDrinker.BillsOwed as BO where B.transactionID='
                + 'BI.bill AND B.transactionID = BO.bill AND BO.drinker = "' + this.drinkerValue + '" order by BI.bar, B.time'),
            this.bbd.query('SELECT * FROM ItemsPurchased ip WHERE ip.bill IN(SELECT bill FROM BillsOwed bo WHERE bo.drinker="'
                + this.drinkerValue + '") AND ip.item IN(SELECT name FROM Items i WHERE i.type="beer") ORDER BY ip.quantity DESC'),
            this.bbd.query('SELECT tab1.spending, tab1.bar, DATE_FORMAT(tab1.time, \'%b. %Y\') AS time FROM (SELECT B.transactionID' +
                ', B.time, B.total + B.Tip AS spending, BI.bar, BO.drinker FROM BarBeerDrinker.Bills AS B, BarBeerDrinker.BillsIssued AS BI' +
                ', BarBeerDrinker.BillsOwed AS BO WHERE B.transactionID = BI.bill AND B.transactionID = BO.bill' +
                ' AND BO.drinker = "' + this.drinkerValue + '") tab1 GROUP BY MONTH(tab1.time), YEAR(tab1.time), tab1.bar ORDER BY YEAR(tab1.time)' +
                ', MONTH(tab1.time)'),
        ]).then((results) => {
            const transactionResults = results[0];
            const beersOrderedMostResults = results[1];
            const spendingTimeBarResults = results[2];

            this.dataSource = transactionResults;
            this.columns = Object.keys(transactionResults[0]);
            this.tableRef.renderRows();

            if (this.dataSource.length === 0) {
                this.snackBar.open('This query returned No Results', null, {
                    duration: 4000
                });
            }

            if (beersOrderedMostResults.length !== 0) {
                const data = beersOrderedMostResults.map((result) => {
                    return result['quantity'];
                }).reverse();
                const labels = beersOrderedMostResults.map((result) => {
                    return result['item'];
                }).reverse();
                this.beersOrderedMostData = [{
                    data: data, label: 'Number of Beers Ordered'
                }];
                this.beersOrderedMostLabels = labels;
                this.beersOrderedMostOptions.title.text = 'Beers ' + this.drinkerValue + ' Orders the Most';
            } else {
                this.beersOrderedMostData = [];
                this.beersOrderedMostLabels = [];
            }

            if (spendingTimeBarResults.length !== 0) {
                const data = spendingTimeBarResults.map((result) => {
                    return result['spending'];
                });
                const labels = spendingTimeBarResults.map((result) => {
                    return result['bar'] + ' ' + result['time'];
                });
                this.spendingTimeBarData = [{
                    data: data, label: 'Spending in Month at Bar'
                }];
                this.spendingTimeBarLabels = labels;
                this.spendingTimeBarOptions.title.text = this.drinkerValue + '\'s Spending at Different Bars per Month';
            } else {
                this.spendingTimeBarData = [];
                this.spendingTimeBarLabels = [];
            }

            this.spinnerHidden = true;
        }).catch((err) => {
            console.log(err);
            this.snackBar.open('An error occurred. See console for details.', null, {
                duration: 4000
            });
            this.dataSource = [];
            this.beersOrderedMostData = [];
            this.beersOrderedMostLabels = [];
            this.spendingTimeBarData = [];
            this.spendingTimeBarLabels = [];
            this.spinnerHidden = true;
        });
    }

}
