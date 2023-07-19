function hasUpgrade(layer, id) {
	return ((player[layer].upgrades.includes(toNumber(id)) || player[layer].upgrades.includes(id.toString())) && !tmp[layer].deactivated && !tmp[layer].upgrades[id].disabled)
} // Returns whether or not you have a specified upgrade

function hasMilestone(layer, id) {
	return ((player[layer].milestones.includes(toNumber(id)) || player[layer].milestones.includes(id.toString())) && !tmp[layer].deactivated)
} // Returns whether or not you have a specified milestone

function hasAchievement(layer, id) {
	return ((player[layer].achievements.includes(toNumber(id)) || player[layer].achievements.includes(id.toString())) && !tmp[layer].deactivated)
} // Returns whether or not you have a specified achievement

function hasChallenge(layer, id) {
	return ((player[layer].challenges[id]) && !tmp[layer].deactivated)
} // Returns whether or not you have completed a specified challenge

function maxedChallenge(layer, id) {
	return ((player[layer].challenges[id] >= tmp[layer].challenges[id].completionLimit) && !tmp[layer].deactivated)
} // Returns whether or not you have fully completed a specified challenge

function challengeCompletions(layer, id) {
	return (player[layer].challenges[id])
} // Returns how many times you have completed a specified challenge

function getBuyableAmount(layer, id) {
	return (player[layer].buyables[id])
} // Returns the amount of times a specified buyable has been bought

function setBuyableAmount(layer, id, amt) {
	player[layer].buyables[id] = amt
} // Sets the amount of purchases a specified buyable should have

function addBuyables(layer, id, amt) {
	player[layer].buyables[id] = player[layer].buyables[id].add(amt)
} // Adds a specified amount of purchases to a specified buyable

function getClickableState(layer, id) {
	return (player[layer].clickables[id])
}

function setClickableState(layer, id, state) {
	player[layer].clickables[id] = state
}

function getGridData(layer, id) {
	return (player[layer].grid[id])
}

function setGridData(layer, id, data) {
	player[layer].grid[id] = data
}

function upgradeEffect(layer, id) {
	return (tmp[layer].upgrades[id].effect)
} // Returns the effect of a specified upgrade

function challengeEffect(layer, id) {
	return (tmp[layer].challenges[id].rewardEffect)
} // Returns the reward effect of a specified challenge

function buyableEffect(layer, id) {
	return (tmp[layer].buyables[id].effect)
} // Returns the effect of a specified buyable

function clickableEffect(layer, id) {
	return (tmp[layer].clickables[id].effect)
} // Returns the effect of a specified clickable

function achievementEffect(layer, id) {
	return (tmp[layer].achievements[id].effect)
} // Returns the reward effect of a specified achievement

function gridEffect(layer, id) {
	return (gridRun(layer, 'getEffect', player[layer].grid[id], id))
} // I haven't used this so I'm going to guess it returns the effect of a specified grid of gridables

// Past this point these are new functions, created by Thenonymous

function smartUpgradeEffect(layer, id, def = new Decimal(1)) {
    return (hasUpgrade(layer, id) ? upgradeEffect(layer, id) : def)
} // Returns the effect of a specified upgrade but returns 1 if you don't have the upgrade, you can change the default by adding a third input

function thisUpgradeEffect(thisUpgrade) {
    return (upgradeEffect(thisUpgrade.layer, thisUpgrade.id))
} // Returns the effect of the current upgrade (the upgrade which you are setting the properties of)

function autoBuyableDisplay(desc, layer, id, baseName = "", limit = "") {
    return (desc + "<br>Cost: "+ (tmp[layer].buyables[id].cost.lt(0.1) ? formatSmall(tmp[layer].buyables[id].cost) : format(tmp[layer].buyables[id].cost)) +baseName+". Amount: "+ format(getBuyableAmount(layer, id)) + limit +". ")
} // Returns a buyable display from just a description

function thisBuyableAmount(thisBuyable) {
    return (getBuyableAmount(thisBuyable.layer, thisBuyable.id))
} // Returns the amount of the current buyable

function thisBuyableEffect(thisBuyable) {
    return (buyableEffect(thisBuyable.layer, thisBuyable.id))
} // Returns the effect of the current buyable

function milestoneEffect(layer, id) {
    return (tmp[layer].milestones[id].effect)
} // Returns the effect of a specified milestone

function smartMilestoneEffect(layer, id, def = decimalOne) {
    return (hasMilestone(layer, id) ? milestoneEffect(layer, id) : def)
} // Returns the effect of a specified milestone if bought, otherwise returns 1, you can change the default by adding a third input

function thisMilestoneEffect(thisMilestone) {
    return (milestoneEffect(thisMilestone.layer, thisMilestone.id))
} // Returns the effect of the current milestone

function autoThisBuyableDisplay(desc, thisBuyable, baseName = "", limit = "") {
    return autoBuyableDisplay(desc, thisBuyable.layer, thisBuyable.id, baseName, limit)
} // Returns an autoBuyableDisplay (see line 91) of the current buyable

function completionDecimal(layer, id) {
    return new Decimal(challengeCompletions(layer, id))
} // Returns challengeCompletions in Decimal form

function thisCompletionDecimal(challenge) {
    return completionDecimal(challenge.layer, challenge.id)
} // Returns the completionDecimal of challenge

function challengeDescriptionNo(layer, id, index) {
    return tmp[layer].challenges[id].challengeDescriptionArray[index]
} // Returns the challenge description of a certain number

function thisChallengeDescriptionArray(challenge) {
    return challengeDescriptionNo(challenge.layer, challenge.id, challengeCompletions(challenge.layer, challenge.id))
}

function challengeGoalDescription(layer, id) {
    return formatWhole(challengeRequirement(layer, id, challengeCompletions(layer, id)))+tmp[layer].challenges[id].baseName
}

function challengeRequirement(layer, id, index) {
    return tmp[layer].challenges[id].requirementArray[index]
}

function thisChallengeCompletions(challenge) {
    return challengeCompletions(challenge.layer, challenge.id)
}

function thisChallengeRequirement(challenge) {
    return challengeRequirement(challenge.layer, challenge.id, thisChallengeCompletions(challenge))
}

function challengeCanComplete(layer, id) {
    return tmp[layer].challenges[id].baseAmount.gte(challengeRequirement(layer, id, challengeCompletions(layer, id)))
}

function inCompletion(layer, id, completion) {
    return inChallenge(layer, id) && challengeCompletions(layer, id) == completion
}

/*
Challenges Explained with 'This':

Useful Functions;
    thisCompletionDecimal
    thisChallengeDescriptionArray - The Description for this Challenge, Based on an Array
    thisChallengeRequirement - Automated Requirement for this Challenge
    challengeCanComplete(layer, id) - Automated 'canComplete' for a Challenge
    challengeGoalDescription(layer, id) - Automated 'goalDescription' for a challenge
    
Required;
    baseAmount: returns the amount of the resource the challenge is based on
    requirementArray: an array of requirements for the challenge, on for each completion
    baseName: name of the resource the challenge is based on
*/
function autoChallengeFeatures(challenge) {
    console.log(challenge)
    return {
        requirement() {return thisChallengeRequirement(challenge)},
        goalDescription() {return challengeGoalDescription(challenge.layer, challenge.id)},
        canComplete() {return challengeCanComplete(challenge.layer, challenge.id)},
    } 
}

/*
startRow* - number of starting row
layer* - id of layer
layerName* - name of layer 
resettingLayer - id of layer used for resetting base layer, extra features disabled if absent
resettingLayerName - name of layer used for resetting base layer, extra features disabled if absent
respecReset - if respeccing upgrades should cause reset, default is true
*/
function clickables(data) {
    let style = {
        'min-height': '75px',
        'width': '75px',
        'font-size': '7px',
    }
    let extra = {
        [((data.startRow+1)*10)+1]: {
            title() {return "<font size = -1>Reset "+data.layerName+" Upgrades (Causes "+data.resettingLayerName+" Reset)</font>"},
            canClick: true,
            onClick() {
                player[data.layer].upgrades = []
                if((respecReset in data) ? data.respecReset : true) {doReset(data.resettingLayer, true)}
            },
            unlocked() {return tmp[data.resettingLayer].layerShown},
            style() {return style},
        },
    }
    let object = {
        [((data.startRow)*10)+1]: {
            title() {return "Do "+data.layerName+" Reset"},
            canClick: true,
            onClick() {
                doReset(data.layer, false)
            },
            unlocked() {return tmp[data.layer].layerShown},
            style() {return style},
        },
        [((data.startRow)*10)+2]: {
            title() {return "Force "+data.layerName+" Reset"},
            canClick: true,
            onClick() {
                doReset(data.layer, true)
            },
            unlocked() {return tmp.p.layerShown},
            style() {return style},
        },
        [((data.startRow)*10)+3]: {
            title() {return "Buy "+data.layerName+" Upgrades"},
            canClick: true,
            onHold() {
                autobuyUpgrades(data.layer)
            },
            unlocked() {return tmp[data.layer].layerShown},
            style() {return style},
        },
        [((data.startRow)*10)+4]: {
            title() {return "Redirect to The "+data.layerName+" Layer"},
            canClick: true,
            onClick() {
                player.tab = data.layer
            },
            unlocked() {return tmp[data.layer].layerShown},
            style() {return style},
        },
    }
    if(data.resettingLayer) object = {...object, ...extra}
    return object
}

function smartAchievementEffect(layer, id, def = new Decimal(1)) {
    return (hasAchievement(layer, id) ? achievementEffect(layer, id) : def)
}

function xor(a, b) {
    return a ? !b : b
}

function d(num) {
    return new Decimal(num)
}

function mag(num, base = d(10)) {
    return num.max(0).add(1).log(base).floor()
}