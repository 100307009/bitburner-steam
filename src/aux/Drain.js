import { RunScript } from "./RunScript.js"

export async function Drain(ns) {
  ns.ui.openTail()
  const servers = new Set(["n00dles", "sigma-cosmetics", "joesguns", "nectar-net", "hong-fang-tea", "harakiri-sushi"])
  const MONEY_THRESHOLD = 10000
  const SLEEP_TIME = 10

  for (const server of servers) {
    if (!ns.hasRootAccess(server)) {
      if (ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel()) {
        ns.nuke(server)
        if (!ns.hasRootAccess(server)) {
          ns.toast(`Failed to nuke ${server}`, "error")
          continue
        }
      } else {
        ns.toast(`Cannot nuke ${server} - hacking level too low`, "warning")
        continue
      }
    }

    while (ns.getServerMoneyAvailable(server) > MONEY_THRESHOLD) {
      await RunScript(ns, "../basic/hack.js", server, 4)
      await ns.sleep(SLEEP_TIME)
    }
    ns.toast(`Drained ${server}`)
  }
}

// param {NS} ns
export async function main(ns) {
  await Drain(ns)
}
