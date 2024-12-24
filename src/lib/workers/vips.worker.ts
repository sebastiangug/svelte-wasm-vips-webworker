/// <reference lib="webworker" />

import type Vips from 'wasm-vips';

let vips: any;

self.onmessage = async (e: MessageEvent) => {
	if (!vips) {
		await import('wasm-vips').then(async (m) => {
			console.log('AWAITED IMPORTING OF VIPS');
			vips = await m.default();
			console.log('AWAITED ASSIGNING VIPS');
		});
	}

	console.log('MESSAGE RECEIVED', e);

	// if (!vips) {
	// 	vips = await Vips();
	// }

	await resizeVariant(e.data.file, e.data.requestId);
};

const resizeVariant = async (file: File, requestId: string) => {
	const resized = vips.Image.newFromBuffer(await file.arrayBuffer())
		.resize(0.1)
		.jpegsaveBuffer({ Q: 88 });

	const blob = new Blob([resized], { type: 'image/jpeg' });

	self.postMessage({
		type: 'success',
		requestId,
		blob
		//		potato: PotatoEnum.Potato
	});
};
