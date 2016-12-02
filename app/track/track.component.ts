import { Component, Input, AfterViewInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FrequencyEqualizerComponent } from './frequency-equalizer.component';

@Component({
	moduleId: module.id,
	selector: 'track',
	templateUrl: 'tmpl/track.html',
	styleUrls: ['styles/track.css']
})
export class TrackComponent implements AfterViewInit {
	@Input()
	audioContext: AudioContext;

	source: MediaElementAudioSourceNode;

	gainNode: GainNode;

	position: number = 0;

	playbackRate: number = 1;

	audio: HTMLAudioElement;

	sources = new WeakMap<HTMLAudioElement, MediaElementAudioSourceNode>();

	gainMap = new WeakMap<HTMLAudioElement, number>();

	filterMap = new WeakMap<HTMLAudioElement, number[]>();

	files: HTMLAudioElement[] = [];

	get volume() {
		return Math.floor(this.gainNode.gain.value * 100);
	}

	get status() {
		let playedMin = Math.floor(this.position / 60);
		let playedSec = Math.floor(this.position % 60);
		let durationMin = Math.floor(this.audio.duration / 60);
		let durationSec = Math.floor(this.audio.duration % 60);

		return `${playedMin}:${(playedSec < 10 ? '0' : '') + playedSec}/${durationMin}:${(durationSec < 10 ? '0' : '') + durationSec}`;
	}

	@ViewChild(FrequencyEqualizerComponent)
	frequencyEqualizer: FrequencyEqualizerComponent;

	@Output()
	sourceBeacon = new EventEmitter<MediaElementAudioSourceNode>();

	ngAfterViewInit(): void {
		this.setUpGain();

		setTimeout(() => this.sourceBeacon.emit(this.gainNode));
	}

	setUpSource() {
		this.source = this.audioContext.createMediaElementSource(this.audio);
		this.source.connect(this.gainNode);
	}

	setUpGain() {
		this.gainNode = this.audioContext.createGain();
	}

	setVolume(volume: number): void {
		this.gainNode.gain.value = volume;
	}

	setTempo(tempo: number): void {
		this.playbackRate = tempo;

		this.audio.playbackRate = tempo;
	}

	setPosition(position: number): void {
		this.audio.currentTime = position;
	}

	setTrack(audio: HTMLAudioElement): void {
		this.clear();

		audio.addEventListener('timeupdate', () => {
			this.position = this.audio.currentTime;
		});

		audio.addEventListener('ended', () => this.next());

		if (this.sources.has(audio)) {
			this.source = this.sources.get(audio);
		} else {
			this.source = this.audioContext.createMediaElementSource(audio);
			this.sources.set(audio, this.source);
		}

		if (this.gainMap.has(audio)) {
			this.gainNode.gain.value = this.gainMap.get(audio);
		} else {
			// leave as is
		}

		if (this.filterMap.has(audio)) {
			this.filterMap.get(audio)
				.forEach((value, index) => this.frequencyEqualizer.filters[index].gain.value = value);
		} else {
			// leave as is
		}

		this.source.connect(this.frequencyEqualizer.filters[0]);
		this.frequencyEqualizer.last.connect(this.gainNode);

		this.audio = audio;

		this.playbackRate = this.audio.playbackRate;

		audio.play();
	}

	togglePlayPause() {
		if (this.audio.paused) {
			this.audio.play();
		} else {
			this.audio.pause();
		}
	}

	rewind() {
		this.audio.currentTime = 0;
	}

	previous() {
		let index = this.files.indexOf(this.audio);

		if (index < 1) {
			index = this.files.length - 1;
		} else {
			index -= 1;
		}

		this.setTrack(this.files[index]);
	}

	next() {
		let index = this.files.indexOf(this.audio);

		if (index + 1 >= this.files.length) {
			index = 0;
		} else {
			index += 1;
		}

		this.setTrack(this.files[index]);
	}

	clear() {
		if (this.audio) {
			// save current gain value
			this.gainMap.set(this.audio, this.gainNode.gain.value);

			// save current filter values
			this.filterMap.set(this.audio, this.frequencyEqualizer.filters.map((filter) => filter.gain.value));

			this.audio.pause();
			this.audio.removeEventListener('timeupdate');
			this.audio.removeEventListener('ended');
		}

		if (this.source) {
			this.source.disconnect();
		}
	}
}
