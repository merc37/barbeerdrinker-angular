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
    MatSnackBarModule
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

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'drinkers', component: DrinkerComponent },
    { path: 'bars', component: BarsComponent },
    { path: 'beers', component: BeersComponent },
    { path: 'add-transaction', component: AddTransactionComponent },
    { path: '**', redirectTo: '/home' }
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        DrinkerComponent,
        BarsComponent,
        BeersComponent,
        AddTransactionComponent
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
        MatSnackBarModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
