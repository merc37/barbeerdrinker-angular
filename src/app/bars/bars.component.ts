import { Component, OnInit, HostBinding } from '@angular/core';
import { BarBeerDrinkerService } from '../barbeerdrinker.service';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-bars',
    templateUrl: './bars.component.html',
    styleUrls: ['./bars.component.css']
})
export class BarsComponent implements OnInit {

    @HostBinding('class.d-flex') dFlex = 'd-flex';
    @HostBinding('class.flex-column') flexColumn = 'flex-column';
    @HostBinding('class.flex-grow-1') flexGrow = 'flex-grow-1';

    dataSource: Array<Object> = [];
    columns: string[] = [];
    barValue = '';
    spinnerHidden = true;

    chartTypeBar = 'bar';

    topSpendersData: any[] = [];
    topSpendersLabels: string[] = [];
    topSpendersOptions = {
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

    mostPopularBeersData: any[] = [];
    mostPopularBeersLabels: string[] = [];
    mostPopularBeersOptions = {
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

    manufacturersData: any[] = [];
    manufacturersLabels: string[] = [];
    manufacturersOptions = {
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
        bbd.query('SELECT * FROM Bars ORDER BY Rand() LIMIT 10').then((results) => {
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
            this.bbd.query('select tab1.drinker, (tab1.spending) from ( SELECT B.transactionID, B.time, ' +
                'B.total + B.Tip as spending, BI.bar, BO.drinker FROM BarBeerDrinker.Bills as B, ' +
                'BarBeerDrinker.BillsIssued as BI, BarBeerDrinker.BillsOwed as BO where B.transactionID = ' +
                'BI.bill AND B.transactionID = BO.bill AND BI.bar = "' + this.barValue + '" ) ' +
                'tab1 group by tab1.drinker Order by tab1.spending DESC limit 10'),
            this.bbd.query('SELECT ip.item, SUM(ip.quantity) as number, i.manufacturer FROM ItemsPurchased ip, BillsIssued bi, ' +
                'Items i WHERE ip.bill=bi.bill AND bi.bar="' + this.barValue + '" AND ' +
                'ip.item=i.name AND i.type="beer" GROUP BY ip.item ORDER BY number DESC'),
        ]).then((results) => {
            const topSpenderResults = results[0];
            const mostPopularBeersResults = results[1];
            const manufacturersResults = results[1];

            if (topSpenderResults.length === 0) {
                this.snackBar.open('This query returned No Results', null, {
                    duration: 4000
                });
            }

            if (topSpenderResults.length !== 0) {
                const data = topSpenderResults.map((result) => {
                    return result['spending'];
                }).reverse();
                const labels = topSpenderResults.map((result) => {
                    return result['drinker'];
                }).reverse();

                this.topSpendersData = [
                    { data: data, label: 'Amount Spent' }
                ];
                this.topSpendersLabels = labels;
                this.topSpendersOptions.title.text = this.barValue + '\'s Top Drinkers';
            } else {
                this.topSpendersData = [];
                this.topSpendersLabels = [];
            }

            if (mostPopularBeersResults.length !== 0) {
                const data = mostPopularBeersResults.map((result) => {
                    return result['number'];
                }).reverse();
                const labels = mostPopularBeersResults.map((result) => {
                    return result['item'];
                }).reverse();

                this.mostPopularBeersData = [
                    { data: data, label: 'Number of Beers Sold' }
                ];
                this.mostPopularBeersLabels = labels;
                this.mostPopularBeersOptions.title.text = this.barValue + '\'s Most Popular Beers';
            } else {
                this.mostPopularBeersData = [];
                this.mostPopularBeersLabels = [];
            }

            if (manufacturersResults.length !== 0) {
                const data = manufacturersResults.map((result) => {
                    return result['number'];
                }).reverse();
                const labels = manufacturersResults.map((result) => {
                    return result['manufacturer'];
                }).reverse();

                this.manufacturersData = [
                    { data: data, label: 'Number of Beers Sold' }
                ];
                this.manufacturersLabels = labels;
                this.manufacturersOptions.title.text = this.barValue + '\'s Manufacturers Who Sell the Most';
            } else {
                this.manufacturersData = [];
                this.manufacturersLabels = [];
            }
            this.spinnerHidden = true;
        }).catch((err) => {
            console.log(err);
            this.snackBar.open('An error occurred. See console for details.', null, {
                duration: 4000
            });
            this.topSpendersData = [];
            this.topSpendersLabels = [];
            this.mostPopularBeersData = [];
            this.mostPopularBeersLabels = [];
            this.manufacturersData = [];
            this.manufacturersLabels = [];
            this.spinnerHidden = true;
        });
    }

}
