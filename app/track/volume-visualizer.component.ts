import { Component, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'volume-visualizer',
	templateUrl: 'tmpl/volume-visualizer.html'
})
export class VolumeVisualizerComponent implements AfterViewInit {
	@ViewChild('gainCanvas')
	gainCanvas: ElementRef;

	@Input()
	source: AudioNode;

	@Input()
	audioContext: AudioContext;

	@Input()
	volume: number;

	analyserNode: AnalyserNode;

	ngAfterViewInit(): void {
		this.analyserNode = this.audioContext.createAnalyser();

		this.analyserNode.minDecibels = -90;
		this.analyserNode.maxDecibels = -10;
		this.analyserNode.smoothingTimeConstant = 0.85;

		this.source.connect(this.analyserNode);

		this.visualizeGain();
	}

	visualizeGain() {
		let canvas = this.gainCanvas.nativeElement as HTMLCanvasElement;
		let context = canvas.getContext('2d');
		let analyser = this.analyserNode;

		const WIDTH = canvas.width;
		const HEIGHT = canvas.height;
		const FFT_SIZE = 32;
		const BAR_COLOR_OFFSET = 100;

		analyser.fftSize = FFT_SIZE;

		const BUFFER_LENGTH = analyser.frequencyBinCount;
		const BAR_WIDTH = WIDTH;

		let dataArray = new Uint8Array(BUFFER_LENGTH);

		context.clearRect(0, 0, WIDTH, HEIGHT);

		let draw = () => {
			requestAnimationFrame(draw);

			analyser.getByteFrequencyData(dataArray);

			context.fillStyle = 'rgb(0, 0, 0)';
			context.fillRect(0, 0, WIDTH, HEIGHT);

			let barHeight = Math.floor(Math.max.apply(Math, dataArray) * this.volume);

			context.fillStyle = 'rgb(' + (barHeight + BAR_COLOR_OFFSET) + ',50,50)';
			context.fillRect(0, HEIGHT - barHeight / 2, BAR_WIDTH, barHeight / 2);
		};

		draw();
	}
}
