<script lang="ts">
	
	import { ActivityDisplayItem, BungieApiActivityItem } from './ItemsContainer';
	import { BungieRequestHelper } from './BungieDataSources';
	import { ActivityDensityTimeline } from './ActivityDensityTimeline';
	import { ActivityAnalyst, ActivityDay, ActivityItem } from './ActivityAnalyst';
	
	
	
	let displayItems = new Array<ActivityDisplayItem>();
	displayItems.push(new ActivityDisplayItem(-10,11));
	displayItems.push(new ActivityDisplayItem(30,10));
	displayItems.push(new ActivityDisplayItem(50,30));
	
	let activityDayItems = new Array<ActivityDay>();
	let activityDensity = new ActivityDensityTimeline(true);
	
	let densityLegendItems = [ '12am', '2am', '4am','6am','8am','10am','12pm','2pm','4pm','6pm','8pm','10pm','12am',];
	
	async function onBungieLoadClick() {
		
		let act = new ActivityAnalyst();
		// activityDayItems = await act.createActivityData();
		activityDensity = await act.createDensityData();
		console.log(activityDensity.timeline);
	}
	
	
</script>

<main>
	
	<button  on:click={onBungieLoadClick}>
		<div> Load bungie</div>
	</button>
	
	<div style="height: 4rem;"></div>
	
	{#each activityDayItems as dayItem}
		<div style="color: #ddd;">{dayItem.caption}</div>
		<div class="bar-container">
			{#each dayItem.activities as item}
				<div class="bar-item"  style="margin-left: {item.startPercent * 100}%; width: {item.durationPercent * 100}%" ></div>
			{/each}
		</div>
	{/each}
	
	<div class="density-container">
		{#each activityDensity.timeline as itemNum}
			<div class="density-item"  style="height: {itemNum * 4}px;"></div>
		{/each}
	</div>
	<div class="density-legend">
		{#each densityLegendItems as legendItemText}
			<div>{legendItemText}</div>
		{/each}
	</div>
	
</main>

<style>
	
	.bar-container {
		margin-top: 8px;
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
		border-left : solid 0px #000;
		border-right : solid 0px #000;
		/* box-shadow: 0px 0px 5px #000; */
	}
	
	.density-container {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: flex-end;
		height: 320px;
		border: solid 1px #000;
		background-color: #223344;
		margin-top: 32px;
		margin-left: 0;
		margin-right: 0;
		border-radius: 0px;
	}
	
	.density-item {
		background-color: green;
		width: 4px;
	}
	
	.density-legend {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: flex-end;
		margin-top: 4px;
		margin-left: 0;
		margin-right: 0;
	}
	
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>