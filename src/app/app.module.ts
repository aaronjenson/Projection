import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatCardModule,
  MatCheckboxModule,
  MatDividerModule,
  MatExpansionModule,
  MatInputModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatToolbarModule
} from '@angular/material';
import {SvgComponent} from './svg/svg.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';

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
    MatCardModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatDividerModule,
    MatExpansionModule,
    MatSliderModule,
    FormsModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
