let modInfo = {
	name: "The Plant Tree: Rewritten",
	id: "omgits-theplanttreerewritten-thenonymous1396903649",
	author: "Thenonymous",
	pointsName: "plant points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "The Plant Tree Discord",
	discordLink: "https://discord.gg/ffqTnDRQw8",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.1",
	name: "Plants & Gardens (Rewrite lol)",
}

let changelog = `<h1>Version History:</h1><br>
    <h3>v1.1</h3><br>
        - Rewrote Game lol
	<h3>v1</h3><br>
		- Added Plants.<br>
            - 12 Upgrades, 2 Buyables, 1 Milestone.<br>
		- Added Gardens.<br>
            - 8 Upgrades.<br>`

let winText = `Congratulations! You have reached the end and beaten this game, but for now you can wait for future updates!<br>You can also play the original here: <a class="link" href="https://thenonymous.github.io/The-Random-Tree/" target="_blank" v-bind:style="{'font-size': '10px'}">The Plant Tree: Original</a><br>`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
    // Bonuses
        // Plants
    gain = gain.times(smartMilestoneEffect('p', 0))
    gain = gain.times(smartUpgradeEffect('p', 12))
    gain = gain.times(smartUpgradeEffect('p', 14))
    gain = gain.times(smartUpgradeEffect('p', 23))
    gain = gain.times(smartUpgradeEffect('p', 24))
    gain = gain.times(smartUpgradeEffect('p', 31))
    gain = gain.times(buyableEffect('p', 11))
        // Gardens
    gain = gain.times(smartUpgradeEffect('g', 11))
    gain = gain.times(smartUpgradeEffect('g', 23))
    // Nerfs
    gain = gain.div(d(player.p.upgrades.length).max(0).add(1).root(10))
    // Challenges
    // Softcaps
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return hasUpgrade('g', 24)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}