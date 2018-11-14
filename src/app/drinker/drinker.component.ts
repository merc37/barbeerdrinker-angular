import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { BarBeerDrinkerService } from '../barbeerdrinker.service';
import { MatTable } from '@angular/material';

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
    barChartOptions = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };

    beersOrderedMostData: any[] = [];
    beersOrderedMostLabels: string[] = [];

    constructor(private bbd: BarBeerDrinkerService) {
        bbd.query('SELECT * FROM Drinkers ORDER BY Rand() LIMIT 10').then((results) => {
            this.dataSource = results;
            this.columns = Object.keys(results[0]);
        }).catch((err) => {
            console.log(err);
        });
    }

    ngOnInit() {
    }

    onSubmit() {
        this.spinnerHidden = false;
        Promise.all([
            this.bbd.query('SELECT * FROM Bills b WHERE b.transactionID IN(SELECT transactionID FROM BillsOwed bo WHERE bo.drinker="'
                + this.drinkerValue + '") ORDER BY b.time LIMIT 250'),
            this.bbd.query('SELECT * FROM ItemsPurchased ip WHERE ip.bill IN(SELECT bill FROM BillsOwed bo WHERE bo.drinker="'
                + this.drinkerValue + '") AND ip.item IN(SELECT name FROM Items i WHERE i.type="beer") ORDER BY ip.quantity DESC LIMIT 10'),
        ]).then((results) => {
            const transactionResults = results[0];
            const beersOrderedResults = results[1];

            this.dataSource = transactionResults;
            this.columns = Object.keys(transactionResults[0]);
            this.tableRef.renderRows();

            if (beersOrderedResults.length !== 0) {
                const data = beersOrderedResults.map((result) => {
                    return result['quantity'];
                }).reverse();
                const labels = beersOrderedResults.map((result) => {
                    return result['item'];
                });
                this.beersOrderedMostData = [{
                    data: data, label: 'Beers Ordered'
                }];
                this.beersOrderedMostLabels = labels;
            } else {
                this.beersOrderedMostData = [];
                this.beersOrderedMostLabels = [];
            }

            this.spinnerHidden = true;
        }).catch((err) => {
            console.log(err);
            this.spinnerHidden = true;
        });
    }

}
