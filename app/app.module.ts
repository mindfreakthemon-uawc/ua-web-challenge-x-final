import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { routing } from './app.routing';
import { MainComponent } from './main/main.component';
import { NavBarComponent } from './navbar/navbar.component';
import { RootComponent } from './root/root.component';

@NgModule({
	imports: [
		routing,
		BrowserModule,
		FormsModule
	],

	declarations: [
		RootComponent,
		MainComponent,
		NavBarComponent
	],

	bootstrap: [
		RootComponent
	]
})
export class AppModule {
}
