/** @param {NS} ns */

export async function AutobuyServers(ns) {
	const maxServers = 25;//ns.getPurchasedServerLimit();
	const ownedServers = ns.getPurchasedServers();
	const maxSize = ns.getPurchasedServerMaxRam();
	const money = ns.getPlayer().money;

	// If we have less than max servers, try to buy a new one
	if (ownedServers.length < maxServers) {
		// Find the maximum RAM we can afford
		let ram = 1;
		while (ram * 2 <= maxSize && ns.getPurchasedServerCost(ram * 2) < money) {
			ram *= 2;
		}

		if (ram >= 2) {
			const serverName = `pserv-${ownedServers.length}`;
			ns.purchaseServer(serverName, ram);
			ns.toast(`Purchased new server ${serverName} with ${ram}GB RAM`);
		}
		return;
	}

	// If we have max servers, find the one with lowest RAM and try to upgrade it
	let minRamServer = null;
	let minRam = maxSize;
	let minRamIndex = -1;

	for (let i = 0; i < ownedServers.length; i++) {
		const server = ownedServers[i];
		const serverRam = ns.getServerMaxRam(server);
		if (serverRam < minRam) {
			minRam = serverRam;
			minRamServer = server;
			minRamIndex = i;
		}
	}

	// Find the maximum RAM we can afford
	let newRam = minRam;
	while (newRam * 2 <= maxSize && ns.getPurchasedServerCost(newRam * 2) < money) {
		newRam *= 2;
	}

	// If we can upgrade to a higher RAM level
	if (newRam > minRam) {
		// First upgrade the server
		ns.upgradePurchasedServer(minRamServer, newRam);
		
		// Then rename it
		const newServerName = `pserv-${newRam}GB-${minRamIndex}`;
		ns.toast(`Upgraded server ${minRamServer} from ${minRam}GB to ${newRam}GB RAM`);
	}
}

export async function AutoUpgradeHome(ns) {
    const homeRam = ns.getServerMaxRam("home");
    const homeCost = ns.getPurchasedServerCost(homeRam);
    const money = ns.getPlayer().money;

    if (money > homeCost) {	
		ns.upgradePurchasedServer("home", homeRam * 2);	
		ns.toast(`Upgraded home from ${homeRam}GB to ${homeRam * 2}GB RAM`);
	}
	
}


export async function main(ns) {
    while(true) {
        await AutobuyServers(ns)
        await ns.sleep(1000)
    }
}