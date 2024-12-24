<script lang="ts">
	import { VipsService } from '$lib';
	let img: HTMLImageElement = $state()!;

	const onchange = async (e: any) => {
		const file = e.currentTarget.files?.[0];
		img.src = URL.createObjectURL(await VipsService.resize(file));
	};
</script>

<input type="file" {onchange} />

<img bind:this={img} alt="converted" />
