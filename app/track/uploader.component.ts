import { Component, ChangeDetectorRef, Input } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'uploader',
	templateUrl: 'tmpl/uploader.html'
})
export class UploaderComponent {
	@Input()
	files: HTMLAudioElement[];

	error: string;

	loading: boolean = false;

	shown: boolean = false;

	constructor(private changeDetectorRef: ChangeDetectorRef) {
	}

	handleError(error: string) {
		this.error = error;
		this.loading = false;

		this.changeDetectorRef.detectChanges();
	}

	handleFileSelect(event: Event) {
		let input = event.target as HTMLInputElement;
		let file = input.files[0];
		let url = URL.createObjectURL(file);

		this.upload(url, file.name)
			.then(() => this.close())
			.catch((error) => this.handleError(error));

		this.loading = true;
	}

	close() {
		this.loading = false;
		this.shown = false;
	}

	upload(url: string, name: string): Promise<any> {
		return new Promise((resolve, reject) => {
			let audio = new Audio();
			let files = this.files;

			audio.autoplay = false;
			audio.preload = 'auto';
			audio.dataset['name'] = name;

			audio.setAttribute('crossOrigin', 'anonymous');
			audio.addEventListener('canplay', function event() {
				audio.removeEventListener('canplay', event);

				files.push(audio);

				resolve();
			});

			audio.addEventListener('error', () => {
				reject('network');
			});

			audio.src = url;
		});
	}
}
