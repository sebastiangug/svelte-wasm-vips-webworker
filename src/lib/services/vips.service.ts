import { browser } from '$app/environment';
import VipsWorker from '$lib/workers/vips.worker?worker';

class VipsService {
	private workers: Worker[] = [];
	private processing = new Map();

	constructor() {
		if (browser) {
			const worker = new VipsWorker({});
			worker.addEventListener('message', this.handler.bind(this));
			worker.onmessage = (event) => this.handler(event);
			this.workers.push(worker);
		}
	}

	async resize(file: File): Promise<Blob> {
		return new Promise((resolve, reject) => {
			const requestId = crypto.randomUUID();
			this.processing.set(requestId, {
				resolve,
				reject
			});

			console.log('RESIZE');

			this.workers[0].postMessage({ file, op: 'RESIZE', requestId });
		});
	}

	handler(event: MessageEvent) {
		console.log('RECEIVED EVENT FROM HANDLER', event);

		const req = this.processing.get(event.data.requestId);
		req.resolve(event.data.blob);
	}
}

export default new VipsService();
