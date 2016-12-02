import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'audio-list',
	templateUrl: 'tmpl/audio-list.html'
})
export class AudioListComponent {
	@Input()
	files: HTMLAudioElement[];

	@Input()
	active: HTMLAudioElement;

	shown: boolean = true;

	@Output()
	selectBeacon = new EventEmitter<HTMLAudioElement>();
}
