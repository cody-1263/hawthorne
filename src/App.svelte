<script lang="ts">
	
	import { ActivityDisplayItem, BungieApiActivityItem } from './ItemsContainer';
	import { BungieRequestHelper } from './BungieDataSources';
	
	export let name: string;
	
	
	
	let displayItems = new Array<ActivityDisplayItem>();
	displayItems.push(new ActivityDisplayItem(-10,11));
	displayItems.push(new ActivityDisplayItem(30,10));
	displayItems.push(new ActivityDisplayItem(50,30));
	
	
	function onBungieLoadClick() {
		let brh = new BungieRequestHelper();
	  brh.getActivities();
	}
	
	
</script>

<main>
	
	<button  on:click={onBungieLoadClick}>
		<div> Load bungie</div>
	</button>
	
	<div>{name}</div>
	
	<div class="bar-container">
		{#each displayItems as item}
			{#if item.marginLeft > 0}
				<div class="bar-item"  style="margin-left: {item.marginLeft}%; width: {item.width}%" ></div>
			{:else}
				<div class="bar-item"  style="margin-left: {item.marginLeft}%; width: {item.width}%; border-left: 0px" ></div>
			{/if}
		{/each}
	</div>
	
	<div class="bar-container">
		{#each displayItems as item}
			{#if item.marginLeft > 0}
				<div class="bar-item"  style="margin-left: {item.marginLeft}%; width: {item.width}%" ></div>
			{:else}
				<div class="bar-item"  style="margin-left: {item.marginLeft}%; width: {item.width}%; border-left: 0px" ></div>
			{/if}
		{/each}
	</div>
	
	<div class="bar-container">
		{#each displayItems as item}
			{#if item.marginLeft > 0}
				<div class="bar-item"  style="margin-left: {item.marginLeft}%; width: {item.width}%" ></div>
			{:else}
				<div class="bar-item"  style="margin-left: {item.marginLeft}%; width: {item.width}%; border-left: 0px" ></div>
			{/if}
		{/each}
	</div>
	
	
	
</main>

<style>
	
	.bar-container {
		margin-top: 32px;
		width: 320px;
		height: 16px;
		border: solid 1px #000;
		margin-left: auto;
		margin-right: auto;
		border-radius: 6px;
		overflow: hidden;
		background-color: #333;
		position: relative;
	}
	
	.bar-item {
		position: absolute;
		background: green;
		height: 100%;
		box-sizing: border-box;
		border-left : solid 1px #000;
		border-right : solid 1px #000;
		/* box-shadow: 0px 0px 5px #000; */
	}

	
	
	/* #bar-item-02 {
		position: absolute;
		background: blue;
		width: 20%;
		height: 100%;
		margin-left: 0%;
		border-right: solid 1px #000;
	}
	
	#bar-item-03 {
		position: absolute;
		background: green;
		width: 20%;
		height: 100%;
		margin-left: 50%;
		border-left: solid 1px #000;
		border-right: solid 1px #000;
	} */
	
	
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	/* h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	} */

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>