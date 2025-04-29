export async function main(ns) {
  const tool = "BruteSSH.exe"
  ns.ui.openTail()
  ns.disableLog("ALL")
  while (true) {
    for (let i = 0; i < 1000000; i++) {
      ns.singularity.purchaseProgram(tool)
      ns.rm(tool)
    }
    await ns.sleep(1)
  }
}

