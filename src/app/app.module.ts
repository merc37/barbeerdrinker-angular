import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatToolbarModule, MatButtonModule, MatMenuModule } from '@angular/material';

import { HttpClientModule } from '@angular/common/http/';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DrinkerComponent } from './drinker/drinker.component';

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'drinker', component: DrinkerComponent },
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
        RouterModule.forRoot(appRoutes),
        HttpClientModule,
        MatToolbarModule,
        MatButtonModule,
        MatMenuModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
