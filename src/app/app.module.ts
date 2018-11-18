import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatTableModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
} from '@angular/material';
import { ChartsModule } from 'ng2-charts';

import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http/';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DrinkerComponent } from './drinker/drinker.component';
import { BarsComponent } from './bars/bars.component';
import { BeersComponent } from './beers/beers.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { ModifyComponent, ErrorDialogComponent } from './modify/modify.component';
import { QueryComponent } from './query/query.component';

const appRoutes: Routes = [
    { path: 'query', component: QueryComponent },
    { path: 'home', component: HomeComponent },
    { path: 'drinkers', component: DrinkerComponent },
    { path: 'bars', component: BarsComponent },
    { path: 'beers', component: BeersComponent },
    { path: 'add-transaction', component: AddTransactionComponent },
    { path: 'modify', component: ModifyComponent },
    { path: '**', redirectTo: '/home' }
];

@NgModule({
    entryComponents: [
        ErrorDialogComponent
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        DrinkerComponent,
        BarsComponent,
        BeersComponent,
        AddTransactionComponent,
        QueryComponent,
        AddTransactionComponent,
        ModifyComponent,
        ErrorDialogComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(appRoutes),
        HttpClientModule,
        MatToolbarModule,
        MatButtonModule,
        MatMenuModule,
        MatTableModule,
        MatInputModule,
        MatProgressSpinnerModule,
        ChartsModule,
        MatSnackBarModule,
        MatDialogModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
