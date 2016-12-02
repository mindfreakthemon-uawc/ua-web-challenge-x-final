import { Component, Input, OnInit } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'frequency-equalizer',
	templateUrl: 'tmpl/frequency-equalizer.html'
})
export class FrequencyEqualizerComponent implements OnInit {
	@Input()
	audioContext: AudioContext;

	frequencies: number[] = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

	filters: BiquadFilterNode[];

	get last(): BiquadFilterNode {
		return this.filters[this.filters.length - 1];
	}

	createFilter(frequency): BiquadFilterNode {
		let filter = this.audioContext.createBiquadFilter();

		filter.type = 'peaking';
		filter.frequency.value = frequency;
		filter.Q.value = 1;
		filter.gain.value = 0;

		return filter;
	}

	createFilters(): void {
		this.filters = this.frequencies.map((frequency) => this.createFilter(frequency));

		this.filters.reduce((previous, current) => {
			previous.connect(current);

			return current;
		});
	}

	ngOnInit(): void {
		this.createFilters();
	}
}
