let modInfo = {
	name: "The Plant Tree: Rewritten",
	id: "omgits-theplanttreerewritten-thenonymous4074031767",
	author: "Thenonymous",
	pointsName: "plant points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "The Plant Tree on TMT Discord",
	discordLink: "https://discord.com/channels/762036407719428096/1106927101300453467",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1",
	name: "Plants & Gardens",
}

let changelog = `<h1>Version History:</h1><br>
	<h3>v1</h3><br>
		- Added Plants.<br>
            - 12 Upgrades, 2 Buyables, 3 Milestones.<br>
		- Added Gardens.<br>
            - 8 Upgrades, 4 Milestones.<br>`

let winText = `Congratulations! You have reached the end and beaten this game, but for now you can wait for future updates!<br>You can also play the original here: <a class="link" href="https://thenonymous.github.io/The-Random-Tree/" target="_blank" v-bind:style="{'font-size': '10px'}">The Plant Tree</a><br>`

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
    gain = gain.add(smartUpgradeEffect('p', 21, 0))
    gain = gain.add(smartUpgradeEffect('g', 11, 0))
    gain = gain.times(smartMilestoneEffect('p', 0))
    gain = gain.times(smartMilestoneEffect('g', 0))
    gain = gain.times(smartMilestoneEffect('p', 2))
    gain = gain.times(smartUpgradeEffect('p', 14))
    gain = gain.times(smartUpgradeEffect('p', 23))
    gain = gain.times(smartUpgradeEffect('p', 24))
    gain = gain.times(smartUpgradeEffect('g', 13))
    gain = gain.times(smartUpgradeEffect('g', 21))
    gain = gain.times(smartUpgradeEffect('g', 24))
    gain = gain.times(smartAchievementEffect('stat', 14))
    gain = gain.times(buyableEffect('p', 12))
    gain = gain.mul(smartUpgradeEffect('p', 31))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
    function() {return hasUpgrade('g', 24) ? "Endgame: 1,000 Plants" : undefined},
]

// Determines when the game "ends"
function isEndgame() {
	return player.p.points.gte(1000)
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