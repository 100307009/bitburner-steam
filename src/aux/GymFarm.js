/** @param {NS} ns **/
export async function main(ns) {
	ns.tail()
	const stats = ['strength', 'defense', 'dexterity', 'agility'];

	const TARGET_LEVEL = ns.args[0] || 100;
	const FOCUSED = ns.singularity.getOwnedAugmentations(true).includes("Neuroreceptor Management Implant") || false;

	while (stats.some(stat => ns.getPlayer().skills[stat] < TARGET_LEVEL)) {
		//ns.tprint("Training...")
		// Find the stat with the lowest value
		const player = ns.getPlayer();
		const lowestStat = stats.reduce((lowest, current) => 
			player.skills[current] < player.skills[lowest] ? current : lowest
		);
		
		const statName = lowestStat.charAt(0).toUpperCase() + lowestStat.slice(1);
		ns.singularity.gymWorkout('powerhouse gym', statName, FOCUSED);
		await ns.sleep(1000);
	}
	ns.toast("Training Complete")
}