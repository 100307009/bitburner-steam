/*
  This file remains unchanged from the previous part, aside from updating the file paths.
  I didn't even bother removing the old comments.
*/

/** @param {NS} ns */

const tWeakenPath = "/botnet/tWeaken.js";
const tGrowPath = "/botnet/tGrow.js";
const tHackPath = "/botnet/tHack.js";

export async function main(ns) {
	ns.tprint("This is just a function library, it doesn't do anything.");
}


const COSTS = { hack: 1.7, weaken1: 1.75, grow: 1.75, weaken2: 1.75 };

// Job class - handles individual job data
export class Job {
	constructor(type, metrics, batch) {
		this.type = type;
		this.end = metrics.end;
		this.time = metrics.times[type];
		this.target = metrics.target;
		this.threads = metrics.threads[type];
		this.cost = this.threads * COSTS[type];
		this.server = "none";
		this.report = true;
		this.port = metrics.port;
		this.batch = batch;
	}
}

// Metrics class - handles server metrics and calculations
export class Metrics {
	constructor(ns, server) {
		this.target = server;
		this.maxMoney = ns.getServerMaxMoney(server);
		this.money = Math.max(ns.getServerMoneyAvailable(server), 1);
		this.minSec = ns.getServerMinSecurityLevel(server);
		this.sec = ns.getServerSecurityLevel(server);
		this.prepped = isPrepped(ns, server);
		this.chance = 0;
		this.wTime = 0;
		this.delay = 0;
		this.spacer = 5;
		this.greed = 0.1;
		this.depth = 0;

		this.times = { hack: 0, weaken1: 0, grow: 0, weaken2: 0 };
		this.end = 0;
		this.threads = { hack: 0, weaken1: 0, grow: 0, weaken2: 0 };
		this.port = ns.pid;
	}

	calculate(ns, greed = this.greed) {
		const server = this.target;
		const maxMoney = this.maxMoney;
		this.money = ns.getServerMoneyAvailable(server);
		this.sec = ns.getServerSecurityLevel(server);
		this.wTime = ns.getWeakenTime(server);
		this.times.weaken1 = this.wTime;
		this.times.weaken2 = this.wTime;
		this.times.hack = this.wTime / 4;
		this.times.grow = this.wTime * 0.8;

		const hPercent = ns.hackAnalyze(server);
		const amount = maxMoney * greed;
		const hThreads = Math.max(Math.floor(ns.hackAnalyzeThreads(server, amount)), 1);
		const tGreed = hPercent * hThreads;

		const gThreads = Math.ceil(ns.growthAnalyze(server, maxMoney / (maxMoney - maxMoney * tGreed)) * 1.01);
		this.threads.weaken1 = Math.max(Math.ceil(hThreads * 0.002 / 0.05), 1);
		this.threads.weaken2 = Math.max(Math.ceil(gThreads * 0.004 / 0.05), 1);
		this.threads.hack = hThreads;
		this.threads.grow = gThreads;
		this.chance = ns.hackAnalyzeChance(server);
	}
}

// RamNet class - handles RAM allocation and server management
export class RamNet {
	#blocks = [];
	#minBlockSize = Infinity;
	#maxBlockSize = 0;
	#totalRam = 0;
	#maxRam = 0;
	#prepThreads = 0;
	#index = new Map();

	constructor(ns, servers) {
		for (const server of servers) {
			if (ns.hasRootAccess(server)) {
				const maxRam = ns.getServerMaxRam(server);
				const usedRam = ns.getServerUsedRam(server);
				const ram = maxRam - usedRam;
				if (ram >= 1.60) {
					const block = { 
						server: server, 
						ram: ram,
						maxRam: maxRam,
						usedRam: usedRam
					};
					this.#blocks.push(block);
					if (ram < this.#minBlockSize) this.#minBlockSize = ram;
					if (ram > this.#maxBlockSize) this.#maxBlockSize = ram;
					this.#totalRam += ram;
					this.#maxRam += maxRam;
					this.#prepThreads += Math.floor(ram / 1.75);
				}
			}
		}
		this.#sort();
		this.#blocks.forEach((block, index) => this.#index.set(block.server, index));
	}

	#sort() {
		this.#blocks.sort((x, y) => {
			if (x.server === "home") return 1;
			if (y.server === "home") return -1;
			return x.ram - y.ram;
		});
	}

	get totalRam() { return this.#totalRam; }
	get maxRam() { return this.#maxRam; }
	get maxBlockSize() { return this.#maxBlockSize; }
	get prepThreads() { return this.#prepThreads; }

	getBlock(server) {
		if (this.#index.has(server)) {
			return this.#blocks[this.#index.get(server)];
		} else {
			throw new Error(`Server ${server} not found in RamNet.`);
		}
	}

	assign(job) {
		// Try to find a block that can fit the entire cost
		let block = this.#blocks.find(block => block.ram >= job.cost);
		if (block) {
			job.server = block.server;
			block.ram -= job.cost;
			this.#totalRam -= job.cost;
			return true;
		}

		// If we can't fit the entire cost, try to fragment it
		let remainingCost = job.cost;
		let assignedServers = [];
		let tempBlocks = this.#blocks.map(block => ({ ...block }));

		while (remainingCost > 0) {
			// Find the block with the most available RAM that can fit at least part of the operation
			block = tempBlocks.reduce((best, current) => {
				if (current.ram <= 0) return best;
				if (best.ram <= 0) return current;
				return current.ram > best.ram ? current : best;
			});
			
			if (block.ram <= 0) break; // No more RAM available
			
			const fragmentCost = Math.min(remainingCost, block.ram);
			block.ram -= fragmentCost;
			remainingCost -= fragmentCost;
			assignedServers.push(block.server);
		}
		
		if (remainingCost > 0) {
			// If we couldn't fit all fragments, roll back the changes
			for (const server of assignedServers) {
				const block = this.getBlock(server);
				block.ram += job.cost;
				this.#totalRam += job.cost;
			}
			return false;
		}

		// If we successfully assigned all fragments, update the job and RAM blocks
		job.server = assignedServers[0]; // Use the first server as the primary
		job.fragments = assignedServers.slice(1); // Store additional servers as fragments

		// Update the actual RAM blocks with the temporary ones
		for (const tempBlock of tempBlocks) {
			const block = this.getBlock(tempBlock.server);
			block.ram = tempBlock.ram;
		}

		return true;
	}

	finish(job) {
		const block = this.getBlock(job.server);
		block.ram += job.cost;
		this.#totalRam += job.cost;

		// If the job was fragmented, free up RAM on other servers
		if (job.fragments) {
			for (const server of job.fragments) {
				const fragmentBlock = this.getBlock(server);
				fragmentBlock.ram += job.cost;
				this.#totalRam += job.cost;
			}
		}
	}

	cloneBlocks() {
		return this.#blocks.map(block => ({ ...block }));
	}

	printBlocks(ns) {
		for (const block of this.#blocks) {
			ns.print(JSON.stringify({
				server: block.server,
				ram: block.ram,
				maxRam: block.maxRam,
				usedRam: block.usedRam
			}));
		}
	}

	/** @param {NS} ns */
	testThreads(ns, threadCosts) {
		const pRam = this.cloneBlocks();
		let batches = 0;
		let found = true;

		while (found) {
			found = false;
			const remainingCosts = [...threadCosts];
			const tempRam = pRam.map(block => ({ ...block }));

			// Try to assign each operation's threads
			for (let i = 0; i < remainingCosts.length; i++) {
				const cost = remainingCosts[i];
				if (cost <= 0) continue;

				// Try to find a block that can fit the entire cost
				let block = tempRam.find(block => block.ram >= cost);
				if (block) {
					block.ram -= cost;
					remainingCosts[i] = 0;
					continue;
				}

				// If we can't fit the entire cost, try to fragment it
				let remainingCost = cost;
				while (remainingCost > 0) {
					// Find the block with the most available RAM that can fit at least part of the operation
					block = tempRam.reduce((best, current) => {
						if (current.ram <= 0) return best;
						if (best.ram <= 0) return current;
						return current.ram > best.ram ? current : best;
					});
					
					if (block.ram <= 0) break; // No more RAM available
					
					const fragmentCost = Math.min(remainingCost, block.ram);
					block.ram -= fragmentCost;
					remainingCost -= fragmentCost;
				}
				
				if (remainingCost > 0) break; // Couldn't fit all fragments
			}

			// Check if we successfully assigned all operations
			if (remainingCosts.every(cost => cost === 0)) {
				batches++;
				found = true;
				// Update the actual RAM blocks with the temporary ones
				pRam.forEach((block, i) => {
					block.ram = tempRam[i].ram;
				});
			}
		}

		// Debug output
		if (batches === 0) {
			ns.tprint("Debug: Failed to assign threads");
			ns.tprint("Thread costs:", threadCosts);
			ns.tprint("Available RAM:", pRam.map(b => b.ram));
		}

		return batches;
	}
}

// The recursive server navigation algorithm. The lambda predicate determines which servers to add to the final list.
// You can also plug other functions into the lambda to perform other tasks that check all servers at the same time.
/** @param {NS} ns */
export function getServers(ns, lambdaCondition = () => true, hostname = "home", servers = [], visited = []) {
	if (visited.includes(hostname)) return;
	visited.push(hostname);
	if (lambdaCondition(hostname)) servers.push(hostname);
	const connectedNodes = ns.scan(hostname);
	if (hostname !== "home") connectedNodes.shift();
	for (const node of connectedNodes) getServers(ns, lambdaCondition, node, servers, visited);
	return servers;
}

// Here are a couple of my own getServers modules.
// This one finds the best target for hacking. It tries to balance expected return with time taken.
/** @param {NS} ns */
export function checkTarget(ns, server, target = "n00dles", forms = false) {
	if (!ns.hasRootAccess(server)) return target;
	const player = ns.getPlayer();
	const serverSim = ns.getServer(server);
	const pSim = ns.getServer(target);
	let previousScore;
	let currentScore;
	if (serverSim.requiredHackingSkill <= player.skills.hacking / (forms ? 1 : 2)) {
		if (forms) {
			serverSim.hackDifficulty = serverSim.minDifficulty;
			pSim.hackDifficulty = pSim.minDifficulty;
			previousScore = pSim.moneyMax / ns.formulas.hacking.weakenTime(pSim, player) * ns.formulas.hacking.hackChance(pSim, player);
			currentScore = serverSim.moneyMax / ns.formulas.hacking.weakenTime(serverSim, player) * ns.formulas.hacking.hackChance(serverSim, player);
		} else {
			previousScore = pSim.moneyMax / pSim.minDifficulty / ns.getWeakenTime(pSim.hostname);
			currentScore = serverSim.moneyMax / serverSim.minDifficulty / ns.getWeakenTime(serverSim.hostname);
		}
		if (currentScore > previousScore) target = server;
	}
	return target;
}

// A simple function for copying a list of scripts to a server.
/** @param {NS} ns */
export function copyScripts(ns, server, scripts, overwrite = false) {
	for (const script of scripts) {
		if ((!ns.fileExists(script, server) || overwrite) && ns.hasRootAccess(server)) {
			ns.scp(script, server);
		}
	}
}

// A generic function to check that a given server is prepped. Mostly just a convenience.
export function isPrepped(ns, server) {
	const tolerance = 0.0001;
	const maxMoney = ns.getServerMaxMoney(server);
	const money = ns.getServerMoneyAvailable(server);
	const minSec = ns.getServerMinSecurityLevel(server);
	const sec = ns.getServerSecurityLevel(server);
	const secFix = Math.abs(sec - minSec) < tolerance;
	return (money === maxMoney && secFix) ? true : false;
}

/*
	This prep function isn't part of the tutorial, but the rest of the code wouldn't work without it.
	I don't make any guarantees, but I've been using it and it's worked well enough. I'll comment it anyway.
	The prep strategy uses a modified proto-batching technique, which will be covered in part 2.
*/

class ThreadCalculator {
	constructor(ns, values, ramNet) {
		this.ns = ns;
		this.values = values;
		this.ramNet = ramNet;
		this.maxThreads = Math.floor(ramNet.maxBlockSize / 1.75);
		this.totalThreads = ramNet.prepThreads;
	}

	calculateThreads() {
		const { maxMoney, money, sec, minSec } = this.values;
		let wThreads1 = 0;
		let wThreads2 = 0;
		let gThreads = 0;
		let batchCount = 1;
		let mode;

		// Calculate minimum required threads
		const minWeakenThreads = 1;
		const minGrowThreads = 1;

		if (money < maxMoney) {
			// Calculate grow threads needed, but cap at a reasonable amount
			const rawGrowThreads = Math.ceil(this.ns.growthAnalyze(this.values.target, maxMoney / money));
			gThreads = Math.min(rawGrowThreads, Math.floor(this.maxThreads / 2));
			// Calculate weaken threads needed for grow, but ensure at least 1
			wThreads2 = Math.max(Math.ceil(this.ns.growthAnalyzeSecurity(gThreads) / 0.05), minWeakenThreads);
		}

		if (sec > minSec) {
			// Calculate weaken threads needed for security, but cap at a reasonable amount
			const rawWeakenThreads = Math.ceil((sec - minSec) * 20);
			wThreads1 = Math.min(rawWeakenThreads, Math.floor(this.maxThreads / 2));
			
			// Check if we can do everything in one batch
			if (wThreads1 + wThreads2 + gThreads <= this.maxThreads) {
				mode = 2;
			} else if (gThreads > 0) {
				mode = 1;
				const oldG = gThreads;
				// Use a more conservative ratio for grow/weaken
				wThreads2 = Math.max(Math.floor(this.maxThreads / 4), minWeakenThreads);
				gThreads = Math.floor(wThreads2 * 2);
				batchCount = Math.ceil(oldG / gThreads);
			} else {
				mode = 0;
				batchCount = Math.ceil(wThreads1 / this.maxThreads);
				if (batchCount > 1) wThreads1 = this.maxThreads;
			}
		} else if (gThreads > 0) {
			mode = 1;
			const oldG = gThreads;
			// Use a more conservative ratio for grow/weaken
			wThreads2 = Math.max(Math.floor(this.maxThreads / 4), minWeakenThreads);
			gThreads = Math.floor(wThreads2 * 2);
			batchCount = Math.ceil(oldG / gThreads);
		} else {
			mode = 2;
		}

		// Ensure we have at least the minimum threads
		wThreads1 = Math.max(wThreads1, minWeakenThreads);
		wThreads2 = Math.max(wThreads2, minWeakenThreads);
		gThreads = Math.max(gThreads, minGrowThreads);

		return { wThreads1, wThreads2, gThreads, batchCount, mode };
	}
}

class ScriptExecutor {
	constructor(ns, values, ramNet) {
		this.ns = ns;
		this.values = values;
		this.ramNet = ramNet;
		this.wTime = ns.getWeakenTime(values.target);
		this.gTime = this.wTime * 0.8;
	}

	createMetrics(type, time, end, report = false) {
		return {
			batch: "prep",
			target: this.values.target,
			type,
			time,
			end,
			port: this.ns.pid,
			log: this.values.log,
			report
		};
	}

	executeScript(block, script, metrics, threads) {
		metrics.server = block.server;
		const pid = this.ns.exec(script, block.server, { threads, temporary: true }, JSON.stringify(metrics));
		if (!pid) throw new Error("Unable to assign all jobs.");
		block.ram -= 1.75 * threads;
	}

	executeBatch(pRam, threadInfo) {
		let { wThreads1, wThreads2, gThreads, mode } = threadInfo;
		const wEnd1 = Date.now() + this.wTime + 1000;
		const gEnd = wEnd1 + this.values.spacer;
		const wEnd2 = gEnd + this.values.spacer;

		for (const block of pRam) {
			while (block.ram >= 1.75) {
				const bMax = Math.floor(block.ram / 1.75);
				let threads = 0;
				let script;
				let metrics;

				if (wThreads1 > 0) {
					script = tWeakenPath;
					metrics = this.createMetrics("pWeaken1", this.wTime, wEnd1, wThreads1 - threads <= 0);
					threads = Math.min(wThreads1, bMax);
					wThreads1 -= threads;
				} else if (wThreads2 > 0) {
					script = tWeakenPath;
					metrics = this.createMetrics("pWeaken2", this.wTime, wEnd2, wThreads2 - threads <= 0);
					threads = Math.min(wThreads2, bMax);
					wThreads2 -= threads;
				} else if (gThreads > 0 && mode === 1) {
					script = tGrowPath;
					metrics = this.createMetrics("pGrow", this.gTime, gEnd);
					threads = Math.min(gThreads, bMax);
					gThreads -= threads;
				} else if (gThreads > 0 && bMax >= gThreads) {
					script = tGrowPath;
					metrics = this.createMetrics("pGrow", this.gTime, gEnd);
					threads = gThreads;
					gThreads = 0;
				} else break;

				this.executeScript(block, script, metrics, threads);
			}
		}
	}
}

// ProgressMonitor class - handles progress monitoring and UI updates
export class ProgressMonitor {
	constructor(ns, values, ramNet = null) {
		this.ns = ns;
		this.values = values;
		this.ramNet = ramNet;
		this.mode = 'batcher'; // Default mode
	}

	setMode(mode) {
		this.mode = mode;
		return this;
	}

	startMonitoring(jobsOrInfo) {
		const timer = setInterval(() => {
			this.ns.clearLog();
			this.updateUI(jobsOrInfo);
		}, this.mode === 'batcher' ? 1000 : 200);
		this.ns.atExit(() => clearInterval(timer));
		return timer;
	}

	updateUI(data) {
		if (this.mode === 'batcher') {
			this.updateBatcherUI(data);
		} else {
			this.updatePrepUI(data);
		}
	}

	updateBatcherUI(jobs) {
		this.ns.print(`Hacking ~\$${this.ns.formatNumber(this.values.maxMoney * this.values.greed * this.values.depth * this.values.chance)} from ${this.values.target}`);
		this.ns.print(`Greed: ${Math.floor(this.values.greed * 1000) / 10}%`);
		this.ns.print(`Ram available: ${this.ns.formatRam(this.ramNet.totalRam)}/${this.ns.formatRam(this.ramNet.maxRam)}`);
		this.ns.print(`Total delay: ${this.values.delay}ms`);
		this.ns.print(`Active jobs remaining: ${jobs.length}`);
		this.ns.print(`ETA ${this.ns.tFormat(this.values.end - Date.now())}`);
	}

	updatePrepUI({ mode, tEnd, batchCount }) {
		const { target, sec, minSec, money, maxMoney } = this.values;
		switch (mode) {
			case 0:
				this.ns.print(`Weakening security on ${target}...`);
				break;
			case 1:
				this.ns.print(`Maximizing money on ${target}...`);
				break;
			case 2:
				this.ns.print(`Finalizing preparation on ${target}...`);
		}
		this.ns.print(`Security: +${this.ns.formatNumber(sec - minSec, 3)}`);
		this.ns.print(`Money: \$${this.ns.formatNumber(money, 2)}/${this.ns.formatNumber(maxMoney, 2)}`);
		const time = tEnd - Date.now();
		if (time > 0) {
			this.ns.print(`Estimated time remaining: ${this.ns.tFormat(time)}`);
			this.ns.print(`~${batchCount} ${(batchCount === 1) ? "batch" : "batches"}.`);
		} else {
			this.ns.print("Waiting for operations to complete...");
		}
	}
}

/** @param {NS} ns */
export async function prep(ns, values, ramNet) {
	const maxMoney = values.maxMoney;
	const minSec = values.minSec;
	let money = values.money;
	let sec = values.sec;
	while (!isPrepped(ns, values.target)) {
		const dataPort = ns.getPortHandle(ns.pid);
		dataPort.clear();

		const pRam = ramNet.cloneBlocks();
		const threadCalculator = new ThreadCalculator(ns, values, ramNet);
		const scriptExecutor = new ScriptExecutor(ns, values, ramNet);
		const progressMonitor = new ProgressMonitor(ns, values).setMode('prep');

		const threadInfo = threadCalculator.calculateThreads();
		scriptExecutor.executeBatch(pRam, threadInfo);

		const wEnd1 = Date.now() + scriptExecutor.wTime + 1000;
		const gEnd = wEnd1 + values.spacer;
		const wEnd2 = gEnd + values.spacer;
		const tEnd = ((threadInfo.mode === 0 ? wEnd1 : wEnd2) - Date.now()) * threadInfo.batchCount + Date.now();
		const timer = progressMonitor.startMonitoring({ mode: threadInfo.mode, tEnd, batchCount: threadInfo.batchCount });

		do await dataPort.nextWrite(); while (!dataPort.read().startsWith("pWeaken"));
		clearInterval(timer);
		await ns.sleep(100);

		money = ns.getServerMoneyAvailable(values.target);
		sec = ns.getServerSecurityLevel(values.target);
		values.money = money;
		values.sec = sec;
	}
	return true;
}