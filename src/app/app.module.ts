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
} from '@angular/material';
import { ChartsModule } from 'ng2-charts';

import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http/';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DrinkerComponent } from './drinker/drinker.component';

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'drinkers', component: DrinkerComponent },
    { path: '**', redirectTo: '/home' }
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        DrinkerComponent
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
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
