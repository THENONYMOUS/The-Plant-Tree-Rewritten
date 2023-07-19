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
	num: "2",
	name: "Zones",
}

let changelog = `<h1>Version History:</h1><br>
    <h3>v2</h3><br>
        - Added Zones.<br>
            - 4 Milestones, 4 Challenges.<br>
        - Added Content to Plants and Gardens.<br>
            - Plants: 4 Upgrades, 1 Buyable.<br>
            - Gardens: 4 Upgrades, 3 Buyables.<br>
    <h3>v1.1</h3><br>
        - Rewrote Game lol.<br>
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
    gain = gain.times(smartUpgradeEffect('p', 42))
    gain = gain.times(smartUpgradeEffect('p', 43))
    gain = gain.times(buyableEffect('p', 11))
        // Gardens
    gain = gain.times(smartUpgradeEffect('g', 11))
    gain = gain.times(smartUpgradeEffect('g', 23))
    gain = gain.times(smartUpgradeEffect('g', 33))
    gain = gain.times(buyableEffect('g', 11))
    gain = gain.times(buyableEffect('g', 12))
        // Zones
    gain = gain.times(tmp.z.effect)
    // Nerfs
    let effect = d(player.p.upgrades.length).max(0).add(1).root(10)
    if(inChallenge('z', 21)) effect = effect.pow(15).pow_base(15)
    gain = gain.div(effect)
    // Challenges
    let eaterEffect = player.p.eaters.add(1).root(2).times(player.p.eaters.add(2).log(2))
    if(inChallenge('z', 22)) gain = gain.root(2).div(eaterEffect)
    // Softcaps
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
    function() {return inChallenge('z', 22) ? "There are "+format(player.p.eaters)+" Eaters slowing Point Gain by ÷"+format(player.p.eaters.add(1).root(3).times(player.p.eaters.add(10).log(10))) : undefined},
]

// Determines when the game "ends"
function isEndgame() {
	return getBuyableAmount('g', 13).gte(1)
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