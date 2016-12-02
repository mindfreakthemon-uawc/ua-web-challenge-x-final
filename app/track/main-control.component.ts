import { Component, Input, AfterViewInit } from '@angular/core';
import { TrackComponent } from './track.component';

@Component({
	moduleId: module.id,
	selector: 'main-control',
	templateUrl: 'tmpl/main-control.html'
})
export class MainControlComponent implements AfterViewInit {
	@Input()
	trackOne: TrackComponent;

	@Input()
	trackTwo: TrackComponent;

	@Input()
	audioContext: AudioContext;

	gainNode: GainNode;

	centralFade: number = 0;

	gainFadeNodeOne: GainNode;

	gainFadeNodeTwo: GainNode;

	setVolume(volume: number): void {
		this.gainNode.gain.value = volume;
	}

	setCentralFade(centralFade: number): void {
		this.centralFade = centralFade;

		this.gainFadeNodeOne.gain.value = Math.abs(centralFade - 50) / 100;
		this.gainFadeNodeTwo.gain.value = Math.abs(centralFade + 50) / 100;
	}

	ngAfterViewInit(): void {
		let destination = this.audioContext.destination;

		this.setUpGain();
		this.setUpGainFadeOne();
		this.setUpGainFadeTwo();

		this.gainFadeNodeOne.connect(this.gainNode);
		this.gainFadeNodeTwo.connect(this.gainNode);

		this.gainNode.connect(destination);
	}

	setUpGain() {
		this.gainNode = this.audioContext.createGain();
		this.gainNode.gain.value = 1;
	}

	setUpGainFadeOne() {
		this.gainFadeNodeOne = this.audioContext.createGain();
		this.gainFadeNodeOne.gain.value = 0.5;

		this.trackOne.sourceBeacon
			.subscribe((source) => source.connect(this.gainFadeNodeOne));
	}

	setUpGainFadeTwo() {
		this.gainFadeNodeTwo = this.audioContext.createGain();
		this.gainFadeNodeTwo.gain.value = 0.5;

		this.trackTwo.sourceBeacon
			.subscribe((source) => source.connect(this.gainFadeNodeTwo));
	}
}
