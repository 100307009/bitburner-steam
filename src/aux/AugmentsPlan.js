/** @param {NS} ns */

const factions = [
    "Tian Di Hui",
    "Netburners",
    "Shadows of Anarchy",

    "Sector-12",
    "Chongqing",
    "New Tokyo",
    "Ishima",
    "Aevum",
    "Volhaven", 

    "CyberSec",
    "NiteSec",
    "The Black Hand",
    "BitRunners",

    "ECorp",
    "MegaCorp",
    "KuaiGong International",
    "Four Sigma",
    "NWO",
    "Blade Industries",
    "OmniTek Incorporated",
    "Bachman & Associates",
    "Clarke Incorporated",
    "Fulcrum Secret Technologies",

    "Slum Snakes",
    "Tetrads",
    "Silhouette",
    "Speakers for the Dead",
    "The Dark Army",
    "The Syndicate",

    "The Covenant",
    "Illuminati",
    "Daedalus",

    "Bladeburners",
    //"Church of the Machine God"
]

const earlyFactions = ["CyberSec","NiteSec","The Black Hand","BitRunners","Tian Di Hui"]
const lateFactions = ["Bladeburners", "The Covenant", "Illuminati", "Daedalus"]
const cityFactions = ["Sector-12", "Chongqing", "New Tokyo", "Ishima", "Volhaven"]
const corpFactions = ["ECorp", "MegaCorp", "KuaiGong International", "Four Sigma", "OmniTek Incorporated", "Bachman & Associates", "Clarke Incorporated", "Fulcrum Secret Technologies"]
const crimeFactions = ["Slum Snakes", "Tetrads", "Silhouette", "Speakers for the Dead", "The Dark Army", "The Syndicate"]

var hackingAugs = new Set()
var combatAugs = new Set()
var repAugs = new Set()
var qolAugs = new Set(["CashRoot Starter Kit", "Neuroreceptor Management Implant", "PCMatrix", "The Blade's Simulacrum", "The Red Pill", "ECorp HVMind Implant"])
var crimeAugs = new Set()
var hacknetAugs = new Set()
var bladeburnerAugs = new Set()

var augList = {}

var shoppingList = {}

var purchaseList = []

export async function main(ns) {
    augList = buildAugList(ns)
    //ns.tprint(augList)
    discriminateAugs(ns, augList)
    shoppingList = buildShoppingList(ns, [hackingAugs, repAugs, qolAugs])
    //ns.tprint(shoppingList)
    purchaseList = organizePurchases(ns, shoppingList)
    for (const purchase of purchaseList) {
        ns.tprint(purchase)
    }
}

function buildAugList(ns) {
    let newList = {}
    for (const faction of factions) {
        let list = ns.singularity.getAugmentationsFromFaction(faction)
        let owned = ns.singularity.getOwnedAugmentations(true)
        list = list.filter(aug => !owned.includes(aug))
        for (const aug of list) {
            if (newList[aug] == undefined) {
                newList[aug] = {
                    faction: [],
                    price: ns.singularity.getAugmentationPrice(aug),
                    repReq: ns.singularity.getAugmentationRepReq(aug),
                    prereq: ns.singularity.getAugmentationPrereq(aug),
                }
            }
            newList[aug].faction.push(faction)
        }
    }
    return newList
}

function discriminateAugs(ns, augList) {
    const hackingStats = ["hacking_chance","hacking_speed","hacking_money","hacking_grow","hacking","hacking_exp"]
    const combatStats = ["strength","strength_exp","defense","defense_exp","dexterity","dexterity_exp","agility","agility_exp"]
    const repStats = ["charisma","charisma_exp", "company_rep", "faction_rep"]
    const crimeStats = ["crime_success", "crime_money"]
    const bladeburnerStats = ["bladeburner_max_stamina","bladeburner_stamina_gain", "bladeburner_analysis", "bladeburner_success_chance"]
    const hacknetStats = ["hacknet_node_money", "hacknet_node_purchase_cost", "hacknet_node_ram_cost", "hacknet_node_core_cost", "hacknet_node_level_cost"]

    for (const aug of Object.keys(augList)) {
        let stats = ns.singularity.getAugmentationStats(aug)
        
        // Check each stat in the augmentation
        for (const [stat, value] of Object.entries(stats)) {
            // Only process if the value is different from 1
            if (value !== 1) {
                if (hackingStats.includes(stat)) {
                    hackingAugs.add(aug)
                }
                if (combatStats.includes(stat)) {
                    combatAugs.add(aug)
                }
                if (repStats.includes(stat)) {
                    repAugs.add(aug)
                }
                if (crimeStats.includes(stat)) {
                    crimeAugs.add(aug)
                }
                if (bladeburnerStats.includes(stat)) {
                    bladeburnerAugs.add(aug)
                }
                if (hacknetStats.includes(stat)) {
                    hacknetAugs.add(aug)
                }
            }
        }
    }
}

function buildShoppingList(ns, priorityAugsList) {
    // Merge all priority augmentation sets into a single set
    let priorityAugs = new Set()
    for (const augSet of priorityAugsList) {
        for (const aug of augSet) {
            priorityAugs.add(aug)
        }
    }
    
    // Initialize shopping list
    let shoppingList = {}
    
    // First, get all factions that provide any of the priority augs
    let factionAugMap = {}
    for (const aug of priorityAugs) {
        if (!augList[aug]) continue // Skip if augmentation not in augList
        
        for (const faction of augList[aug].faction) {
            if (!factionAugMap[faction]) {
                factionAugMap[faction] = new Set()
            }
            factionAugMap[faction].add(aug)
        }
    }
    
    // For each faction, determine which augs are unique to them
    // and which are available from other factions
    for (const [faction, augs] of Object.entries(factionAugMap)) {
        let uniqueAugs = new Set()
        let maxRepReq = 0
        
        for (const aug of augs) {
            // Check if this aug is available from other factions
            let otherFactions = augList[aug].faction.filter(f => f !== faction)
            
            // If no other factions provide this aug, it's unique to this faction
            if (otherFactions.length === 0) {
                uniqueAugs.add(aug)
                maxRepReq = Math.max(maxRepReq, augList[aug].repReq)
            }
        }
        
        // Only add to shopping list if there are unique augs to buy from this faction
        if (uniqueAugs.size > 0) {
            shoppingList[faction] = {
                maxRep: maxRepReq,
                augs: Array.from(uniqueAugs)
            }
        }
    }
    
    // Now handle augmentations that are available from multiple factions
    let remainingAugs = new Set(priorityAugs)
    
    // Remove augs that were already assigned to unique factions
    for (const faction of Object.keys(shoppingList)) {
        for (const aug of shoppingList[faction].augs) {
            remainingAugs.delete(aug)
        }
    }
    
    // For each remaining augmentation, find the faction with the lowest maxRep
    // and prioritize by faction group order
    for (const aug of remainingAugs) {
        if (!augList[aug]) continue
        
        let bestFaction = null
        let lowestMaxRep = Infinity
        let bestFactionGroup = Infinity // Lower number means higher priority
        
        for (const faction of augList[aug].faction) {
            let currentMaxRep = shoppingList[faction]?.maxRep || 0
            let factionGroup = getFactionGroupPriority(faction)
            
            // Prioritize by faction group first, then by maxRep
            if (factionGroup < bestFactionGroup || 
                (factionGroup === bestFactionGroup && currentMaxRep < lowestMaxRep)) {
                lowestMaxRep = currentMaxRep
                bestFaction = faction
                bestFactionGroup = factionGroup
            }
        }
        
        if (bestFaction) {
            if (!shoppingList[bestFaction]) {
                shoppingList[bestFaction] = {
                    maxRep: augList[aug].repReq,
                    augs: []
                }
            }
            shoppingList[bestFaction].augs.push(aug)
            shoppingList[bestFaction].maxRep = Math.max(shoppingList[bestFaction].maxRep, augList[aug].repReq)
        }
    }
    
    return shoppingList
}

function organizePurchases(ns, shoppingList) {
    let purchaseList = []
    
    // For each faction in the shopping list
    for (const [faction, data] of Object.entries(shoppingList)) {
        // For each augmentation in the faction
        for (const aug of data.augs) {
            // Get the price of the augmentation
            let price = ns.singularity.getAugmentationPrice(aug)
            
            // Add to the purchase list
            purchaseList.push({
                augmentation: aug,
                faction: faction,
                price: price
            })
        }
    }
    
    // Sort the list by price (highest to lowest)
    purchaseList.sort((a, b) => b.price - a.price)
    
    return purchaseList
}

// Helper function to determine faction group priority
function getFactionGroupPriority(faction) {
    if (earlyFactions.includes(faction)) return 1
    if (cityFactions.includes(faction)) return 2
    if (crimeFactions.includes(faction)) return 3
    if (corpFactions.includes(faction)) return 4
    if (lateFactions.includes(faction)) return 5
    return 6 // For any other factions
}

// ns.singularity.purchaseAugmentation(faction, augmentation)

// ns.singularity.getFactionRep(faction)
// ns.singularity.getAugmentationsFromFaction(faction)

// ns.singularity.getAugmentationRepReq(augName)

// ns.singularity.getAugmentationBasePrice(augName)
// ns.singularity.getAugmentationPrice(augName)

// ns.singularity.getAugmentationPrereq(augName)
// ns.singularity.getAugmentationFactions(augName)

// getOwnedAugmentations(purchased)
// installAugmentations(cbScript)