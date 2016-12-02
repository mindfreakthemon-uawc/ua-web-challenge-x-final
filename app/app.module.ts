import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { routing } from './app.routing';
import { MainComponent } from './main/main.component';
import { RootComponent } from './root/root.component';
import { TrackComponent } from './track/track.component';
import { MainControlComponent } from './track/main-control.component';
import { VolumeVisualizerComponent } from './track/volume-visualizer.component';
import { FrequencyVisualizerComponent } from './track/frequency-visualizer.component';
import { UploaderComponent } from './track/uploader.component';
import { AudioListComponent } from './track/audio-list.component';
import { FrequencyEqualizerComponent } from './track/frequency-equalizer.component';

@NgModule({
	imports: [
		routing,
		BrowserModule,
		FormsModule
	],

	declarations: [
		RootComponent,
		MainComponent,
		TrackComponent,
		UploaderComponent,
		VolumeVisualizerComponent,
		FrequencyVisualizerComponent,
		MainControlComponent,
		FrequencyEqualizerComponent,
		AudioListComponent
	],

	bootstrap: [
		RootComponent
	]
})
export class AppModule {
}
