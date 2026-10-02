<script lang="ts">
	import Icon from "@iconify/svelte";

	let {
		isOpen = $bindable(false),
		imageSrc,
		altText = 'Full-screen processed image'
	}: {
		isOpen: boolean;
		imageSrc: string;
		altText?: string;
	} = $props();

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') isOpen = false;
	};
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 sm:p-6" role="presentation">
		<button
			type="button"
			class="absolute inset-0 h-full w-full cursor-default"
			onclick={() => isOpen = false}
			aria-label="Close full-screen preview"
		></button>

		<div class="relative flex h-full w-full items-center justify-center" role="dialog" aria-modal="true" aria-label="Full-screen image preview">
			<img src={imageSrc} alt={altText} class="max-h-full max-w-full object-contain" />
			<button
				type="button"
				onclick={() => isOpen = false}
				class="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-lg bg-black/60 text-white transition hover:bg-black/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
				aria-label="Close full-screen preview"
				title="Close preview"
			>
				<Icon icon="mdi:close" class="text-2xl" />
			</button>
		</div>
	</div>
{/if}
