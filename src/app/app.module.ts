import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule, MatSelectModule, MatToolbarModule} from '@angular/material';
import {SvgComponent} from './svg/svg.component';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    AppComponent,
    SvgComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSelectModule,
    MatInputModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
