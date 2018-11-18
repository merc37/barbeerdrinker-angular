import { Component, OnInit, HostBinding } from '@angular/core';
import { BarBeerDrinkerService } from '../barbeerdrinker.service';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-beers',
    templateUrl: './beers.component.html',
    styleUrls: ['./beers.component.css']
})
export class BeersComponent implements OnInit {

    @HostBinding('class.d-flex') dFlex = 'd-flex';
    @HostBinding('class.flex-column') flexColumn = 'flex-column';
    @HostBinding('class.flex-grow-1') flexGrow = 'flex-grow-1';

    dataSource: Array<Object> = [];
    columns: string[] = [];
    beerValue = '';
    spinnerHidden = true;

    chartTypeBar = 'bar';

    beerSellsMostData: any[] = [];
    beerSellsMostLabels: string[] = [];
    beerSellsMostOptions = {
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

    biggestConsumerData: any[] = [];
    biggestConsumerLabels: string[] = [];
    biggestConsumerOptions = {
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

    beerTimeDistData: any[] = [];
    beerTimeDistLabels: string[] = [];
    beerTimeDistOptions = {
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
        bbd.query('SELECT * FROM Items WHERE type="beer" ORDER BY Rand() LIMIT 10').then((results) => {
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
            this.bbd.query('SELECT bi.bar, SUM(ip.quantity) as number FROM Items i, BillsIssued bi, ItemsPurchased ip WHERE ' +
                'i.type="beer" AND i.name=ip.item AND i.name = "' + this.beerValue + '" AND bi.bill = ip.bill' +
                ' GROUP BY bi.bar ORDER BY number DESC'),
            this.bbd.query('SELECT bo.drinker, SUM(ip.quantity) as number FROM Items i, BillsOwed bo, ' +
                'ItemsPurchased ip WHERE i.type="beer" AND i.name=ip.item AND i.name="' + this.beerValue + '" ' +
                'AND bo.bill=ip.bill GROUP BY bo.drinker ORDER BY number DESC'),
            this.bbd.query('SELECT SUM(ip.quantity) as quantity, DATE_FORMAT(b.time, "%b. %Y") as time, ip.item, i.name FROM Bills b, ' +
                'ItemsPurchased ip, Items i WHERE b.transactionID=ip.bill AND ip.item="' + this.beerValue + '" ' +
                'AND i.name=ip.item AND i.type="beer" GROUP BY MONTH(b.time), YEAR(b.time) ORDER BY MONTH(b.time), YEAR(b.time)'),
        ]).then((results) => {
            const beerSellsMostResults = results[0];
            const biggestConsumerResults = results[1];
            const beerTimeDistResults = results[2];

            if (beerSellsMostResults.length === 0) {
                this.snackBar.open('This query returned No Results', null, {
                    duration: 4000
                });
            }

            if (beerSellsMostResults.length !== 0) {
                const data = beerSellsMostResults.map((result) => {
                    return result['number'];
                }).reverse();
                const labels = beerSellsMostResults.map((result) => {
                    return result['bar'];
                }).reverse();

                this.beerSellsMostData = [
                    { data: data, label: 'Number of Beers Sold' }
                ];
                this.beerSellsMostLabels = labels;
                this.beerSellsMostOptions.title.text = 'Where ' + this.beerValue + ' Sells the Most';
            } else {
                this.beerSellsMostData = [];
                this.beerSellsMostLabels = [];
            }

            if (biggestConsumerResults.length !== 0) {
                const data = biggestConsumerResults.map((result) => {
                    return result['number'];
                }).reverse();
                const labels = biggestConsumerResults.map((result) => {
                    return result['drinker'];
                }).reverse();

                this.biggestConsumerData = [
                    { data: data, label: 'Number of Beers Bought' }
                ];
                this.biggestConsumerLabels = labels;
                this.biggestConsumerOptions.title.text = 'Who drank ' + this.beerValue + ' the Most';
            } else {
                this.biggestConsumerData = [];
                this.biggestConsumerLabels = [];
            }

            if (beerTimeDistResults.length !== 0) {
                const data = beerTimeDistResults.map((result) => {
                    return result['quantity'];
                });
                const labels = beerTimeDistResults.map((result) => {
                    return result['time'];
                });

                this.beerTimeDistData = [
                    { data: data, label: 'Number of Beers Bought in that Month' }
                ];
                this.beerTimeDistLabels = labels;
                this.beerTimeDistOptions.title.text = 'When ' + this.beerValue + ' Sells the Most';
            } else {
                this.beerTimeDistData = [];
                this.beerTimeDistLabels = [];
            }
            this.spinnerHidden = true;
        }).catch((err) => {
            console.log(err);
            this.snackBar.open('An error occurred. See console for details.', null, {
                duration: 4000
            });
            this.biggestConsumerData = [];
            this.biggestConsumerLabels = [];
            this.beerSellsMostData = [];
            this.beerSellsMostLabels = [];
            this.spinnerHidden = true;
        });
    }

}
