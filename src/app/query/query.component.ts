import { Component, OnInit, HostBinding } from '@angular/core';
import { BarBeerDrinkerService } from '../barbeerdrinker.service';
import { MatSnackBar } from '@angular/material';

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
  queryValue = '';
  spinnerHidden = true;
// 'SELECT * FROM Items WHERE type="beer" ORDER BY Rand() LIMIT 10'

  constructor(private bbd: BarBeerDrinkerService, private snackBar: MatSnackBar) {}

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
      console.log(err);
      this.snackBar.open('An error occurred. See console for details.', null, {
          duration: 4000
      });

      this.spinnerHidden = true;
  });

}

}
