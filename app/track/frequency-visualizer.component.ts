import { Component, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'frequency-visualizer',
	templateUrl: 'tmpl/frequency-visualizer.html'
})
export class FrequencyVisualizerComponent implements AfterViewInit {
	@ViewChild('outputCanvas')
	outputCanvas: ElementRef;

	@Input()
	source: AudioNode;

	@Input()
	audioContext: AudioContext;

	analyserNode: AnalyserNode;

	ngAfterViewInit(): void {
		this.analyserNode = this.audioContext.createAnalyser();

		this.analyserNode.minDecibels = -90;
		this.analyserNode.maxDecibels = -10;
		this.analyserNode.smoothingTimeConstant = 0.85;

		this.source.connect(this.analyserNode);

		this.visualizeOutput();
	}

	visualizeOutput() {
		let canvas = this.outputCanvas.nativeElement as HTMLCanvasElement;
		let context = canvas.getContext('2d');
		let analyser = this.analyserNode;

		const WIDTH = canvas.width;
		const HEIGHT = canvas.height;
		const FFT_SIZE = 256;
		const BAR_COLOR_OFFSET = 100;

		analyser.fftSize = FFT_SIZE;

		const BUFFER_LENGTH = analyser.frequencyBinCount;
		const BAR_WIDTH = (WIDTH / BUFFER_LENGTH) * 2.5;

		let dataArray = new Uint8Array(BUFFER_LENGTH);

		context.clearRect(0, 0, WIDTH, HEIGHT);

		let draw = () => {
			requestAnimationFrame(draw);

			analyser.getByteFrequencyData(dataArray);

			context.fillStyle = 'rgb(0, 0, 0)';
			context.fillRect(0, 0, WIDTH, HEIGHT);

			for (let i = 0; i < BUFFER_LENGTH; i++) {
				let barHeight = dataArray[i];

				context.fillStyle = 'rgb(' + (barHeight + BAR_COLOR_OFFSET) + ',50,50)';
				context.fillRect(BAR_WIDTH * i + i, HEIGHT - barHeight / 2, BAR_WIDTH, barHeight / 2);
			}
		};

		draw();
	}
}
