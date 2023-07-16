addLayer("stat", { // Achievements Layer
    name: "achievements",
    symbol: "A",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        holdShift: true,
        buyMax: false,
    }},
    color: "#FFDD00",
    resource: "achievements",
    type: "none",
    update() {
        player.stat.points = new Decimal(player.stat.achievements.length)
    },
    tabFormat: {
        "Achievements": {
            content: [
                "main-display",
                ["row", 
                 [
                    ["display-text", () => {return "Hold Shift on Achievement Tooltips to See Requirements, Toggle to Force"}], "blank", ["toggle", ["stat", "holdShift"]]
                 ]
                ],
                "blank",
                "achievements",
                "blank",
            ],
        },
        "Controls": {
            content: [
                "main-display",
                ["row", 
                 [
                    ["display-text", () => {return "Toggle for Buy Max on Buyables"}], "blank", ["toggle", ["stat", "buyMax"]]
                 ]
                ],
                "blank",
                ["row", 
                 [
                    ["display-text", () => {return "Hold Shift on Achievement Tooltips to See Requirements, Toggle to Force"}], "blank", ["toggle", ["stat", "holdShift"]]
                 ]
                ],
                "blank",
                "clickables",
                "blank",
            ],
        },
    },
    row: "side",
    layerShown(){return true},
    clickables: {
        11: {
            title: "Do Plant Reset",
            canClick: true,
            onClick() {
                doReset('p', false)
            },
            unlocked() {return tmp.p.layerShown},
        },
        12: {
            title: "Reset Plant Upgrades (Causes Garden Reset)",
            canClick: true,
            onClick() {
                player.p.upgrades = []
                doReset('g', true)
            },
            unlocked() {return false},
        },
        13: {
            title: "Buy Plant Upgrades",
            canClick: true,
            onHold() {
                autobuyUpgrades('p')
            },
            unlocked() {return tmp.p.layerShown},
        },
        14: {
            title: "Force Plant Reset",
            canClick: true,
            onClick() {
                doReset('p', true)
            },
            unlocked() {return tmp.p.layerShown},
        },
    },
    achievements: {
        11: {
            name: "1st Plant!",
            done() {return player.p.points.gte(1)},
            tooltip() {return xor(player.stat.holdShift, shiftDown) ? "Reach 1 Plant" : "The Pl🆎t Tree Starts Here"},
        },
        12: {
            name: "What!?",
            done() {return hasUpgrade('p', 11)},
            tooltip() {return xor(player.stat.holdShift, shiftDown) ? "Make The Upgrade to Point Gain 'nerf' more than 1" : "Get NERFED lol"},
        },
        13: {
            name: "Funny Upgrade",
            done() {return hasUpgrade('p', 22)},
            tooltip() {return xor(player.stat.holdShift, shiftDown) ? "Buy 'Anthurium'" : "Not haha funny"},
        },
        14: {
            name: "MORE SPACE",
            done() {return player.g.points.gte(1)},
            tooltip() {return xor(player.stat.holdShift, shiftDown) ? "Reach 1 Garden" : "I've Been Gardening Without a Garden for THIS LONG?"},
        },
        15: {
            name: "Prickly Pears from IKEA",
            done() {return tmp.p.buyables[11].cost.lte(3)},
            tooltip() {return (xor(player.stat.holdShift, shiftDown) ? "Reduce Prickly Pear Cost Beneath 3 Plants" : "You'd be Surprised")+"<br><font size = 2px>Reward: Auto-Gain 75% of Plants</font>"},
        },
        16: {
            name: "Automatic Plant Purchaser",
            done() {return hasMilestone('g', 0)},
            tooltip() {return xor(player.stat.holdShift, shiftDown) ? "Get a Garden Milestone" : "Imagine if you had a robot which automatically bought (with your money) anything that you could afford"},
        },
        21: {
            name: "No Rosemary: Inspired by 🆎ur3colo",
            done() {return hasUpgrade('p', 34)},
            tooltip() {return xor(player.stat.holdShift, shiftDown) ? "Buy 'Parsley'" : "Do I really need to type that again?"},
        },
    },
    automate() {
        if(hasAchievement('stat', 15)) {
            let gain = getResetGain('p')
            gain = gain.add(player.p.points).mul(0.75).floor()
            player.p.points = player.p.points.max(gain)
        }
    },
}),
addLayer("p", { // Plant Layer
    name: "plants",
    symbol: "P",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        best: new Decimal(0),
    }},
    color: "#22DD11",
    requires() {
        let req = new Decimal(10)
        req = req.div(smartUpgradeEffect('p', 13))
        req = req.div(smartUpgradeEffect('p', 21))
        req = req.div(smartUpgradeEffect('p', 22))
        req = req.div(smartUpgradeEffect('g', 13))
        req = req.div(buyableEffect('p', 12))
        return req
    },
    resource: "plants",
    baseResource: "points", 
    baseAmount() {return player.points}, 
    type: "static",
    autoPrestige() {return player.p.autoGain && hasMilestone('g', 0)},
    resetsNothing() {return player.p.autoGain && hasMilestone('g', 0)},
    canBuyMax: true,
    update(diff) {
    },
    exponent() {
        let exp = new Decimal(1)
        return exp
    },
    base() {
        let base = new Decimal(2)
        return base
    },
    tabFormat: [
        "main-display",
        ["display-text", function() {return hasUpgrade('p', 14) ? "Next Magnitude Increase at "+format(player.points.max(0).add(1).log(10-smartUpgradeEffect('p', 34, 0)).ceil().pow_base(10-smartUpgradeEffect('p', 34, 0)))+" Points." : ""}],
        "prestige-button",
        "resource-display",
        ["display-text", function() {return "Point Gain is Divided Based on Plant Upgrades. Currently: ÷"+format(d(player.p.upgrades.length).max(0).add(1).root(10))}],
        "blank",
        "milestones",
        "blank",
        "buyables",
        "blank",
        "upgrades",
        "blank",
    ],
    doReset(resettingLayer) {
        if(layers[resettingLayer].row <= layers[this.layer].row) return;
        
        let keep = [];
        keep.push("milestones")
        if(hasMilestone('g', 0) && resettingLayer === 'g') keep.push("upgrades")
        layerDataReset(this.layer, keep)
    },
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    directMult() {
        let mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 0,
    hotkeys: [
        {key: "p", description: "P: Reset for Plants", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    
    milestones: {
        0: {
            requirementDescription: "1 Plant",
            effectDescription() {return "Multiply Point Gain by Plants. Currently: ×"+format(this.effect())},
            done() {return player.p.points.gte(1)},
            effect() {
                let effect = player.p.points.max(0).add(1)
                effect = effect.pow(smartUpgradeEffect('p', 11))
                return effect
            },
        },
    },
    upgrades: {
        11: {
            title: "Sedum",
            description: "Square 1st Plant Milestone effect",
            cost() {return d(3)},
            effect() {return d(2)},
        },
        12: {
            title: "Bear Paw Succulent",
            description: "Multiply Point Gain based on Points",
            cost() {return d(5)},
            effect() {return player.points.max(0).add(2).log(2)},
            effectDisplay() {return "×"+format(this.effect())},
            tooltip: "log2 (Points)",
        },
        13: {
            title: "Jade Plant",
            description: "Divide Plant Costs by Plants",
            cost() {return d(12)},
            effect() {return player.p.points.max(0).add(1)},
            effectDisplay() {return "÷"+format(this.effect())},
        },
        14: {
            title: "Snake Plant",
            description: "Multiply Point Gain based on Point Magnitude",
            cost() {return d(18)},
            effect() {return mag(player.points, 10-smartUpgradeEffect('p', 34, 0)).pow_base(2)},
            effectDisplay() {return "×"+format(this.effect())},
            tooltip: "2 ^ Magnitude (Points)",
        },
        21: {
            title: "Peace Lily",
            description: "Divide Plant Costs based on Points",
            cost() {return d(25)},
            effect() {return player.points.max(0).add(1).pow(0.1)},
            effectDisplay() {return "÷"+format(this.effect())},
            tooltip: "Points ^ 0.1",
        },
        22: {
            title: "Anthurium",
            description: "Divide Plant Costs based on Point Magnitude",
            cost() {return d(30)},
            effect() {return mag(player.points, 10-smartUpgradeEffect('p', 34, 0)).pow_base(2)},
            effectDisplay() {return "÷"+format(this.effect())},
            tooltip: "2 ^ Magnitude (Points)",
        },
        23: {
            title: "Yucca",
            description: "Multiply Point Gain by Plants, increases in intervals of 10",
            cost() {return d(40)},
            effect() {return player.p.points.max(0).div(10).floor().mul(10).max(1)},
            effectDisplay() {return "×"+format(this.effect())},
        },
        24: {
            title: "Coconut Palm",
            description() {return "Unlock Gardens and multiply Point Gain by "+formatWhole(this.effect())},
            cost() {return d(50)},
            effect() {return player.g.points.max(0).add(1).root(2).pow_base(2)},
            tooltip: "2 ^ sqrt Gardens",
        },
        31: {
            title: "Mint",
            description: "Multiply Point Gain based on Plants",
            cost() {return d(190)},
            unlocked() {return hasMilestone('g', 0)},
            effect() {return player.p.points.max(0).add(1).root(2)},
            effectDisplay() {return "×"+format(this.effect())},
            tooltip: "sqrt Plants",
        },
        32: {
            title: "Chives",
            description: "Garden Upgrade 1-4 effect is better",
            cost() {return d(200)},
            unlocked() {return hasMilestone('g', 0)},
            effect() {return 5},
            tooltip: "<i>log10 -> log5</i>",
        },
        33: {
            title: "Thyme",
            description: "Divide Garden Costs based on Plants",
            cost() {return d(215)},
            unlocked() {return hasMilestone('g', 0)},
            effect() {return player.p.points.max(0).add(2).log(4).root(3.5)},
            effectDisplay() {return "÷"+format(this.effect())},
            tooltip: "3.5rt log4 Plants",
        },
        34: {
            title: "Parsley",
            description: "Previous Upgrades based on Point Magnitude are better",
            cost() {return d(230)},
            unlocked() {return hasMilestone('g', 0)},
            effect() {return 5},
            tooltip: "<i>log10 -> log5</i>",
        },
    },
    buyables: {
        11: {
            title: "Prickly Pear",
            display() {return autoThisBuyableDisplay("Multiply Point Gain by 10", this)+"<br>Currently: ×"+format(this.effect())+"."},
            cost(x = this.amount()) {
                let cost = x.pow_base(2).times(10)
                cost = cost.mul(this.costMult())
                return cost
            },
            costMult() {
                let mult = d(1)
                mult = mult.div(smartUpgradeEffect('g', 14))
                return mult
            },
            amount() {return getBuyableAmount(this.layer, this.id)},
            canAfford() {return player.p.points.max(0).gte(this.cost())},
            buy() {
                if(player.stat.buyMax) {buyMaxBuyable(this.layer, this.id)}
                else {
                    player.p.points = player.p.points.sub(this.cost().max(0)).max(0)
                    addBuyables(this.layer, this.id, 1)
                }
            },
            buyMax() {
                let max = player.p.points.div(10).log(2).max(0)
                max = max.add(1).floor()
                player.p.points = player.p.points.sub(this.cost().mul(max.sub(this.amount())).max(0)).max(0)
                setBuyableAmount(this.layer, this.id, max.max(this.amount()))
            },
            effect() {return d(10).pow(this.amount())},
            unlocked() {return hasUpgrade('g', 12)},
        },
        12: {
            title: "Saguaro",
            display() {return autoThisBuyableDisplay("Divide Plant Costs by 10", this)+"<br>Currently: ÷"+format(this.effect())+"."},
            cost(x = this.amount()) {
                let cost = x.pow_base(1000).times(1000)
                cost = cost.mul(this.costMult())
                return cost
            },
            costMult() {
                let mult = d(1)
                return mult
            },
            amount() {return getBuyableAmount(this.layer, this.id)},
            canAfford() {return player.points.max(0).gte(this.cost())},
            buy() {
                if(player.stat.buyMax) {buyMaxBuyable(this.layer, this.id)}
                else {
                    player.points = player.points.sub(this.cost().max(0)).max(0)
                    addBuyables(this.layer, this.id, 1)
                }
            },
            buyMax() {
                let max = player.points.div(1000).log(1000).max(0)
                max = max.add(1).floor()
                player.points = player.points.sub(this.cost().mul(max.sub(this.amount())).max(0)).max(0)
                setBuyableAmount(this.layer, this.id, max.max(this.amount()))
            },
            effect() {return d(10).pow(this.amount())},
            unlocked() {return hasUpgrade('g', 21)},
        },
    },
})
addLayer("g", { // Plant Layer
    name: "gardens",
    symbol: "G",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        best: new Decimal(0),
    }},
    color: "#FFAA00",
    requires() {
        let req = new Decimal(50)
        req = req.div(smartUpgradeEffect('g', 22))
        req = req.div(smartUpgradeEffect('p', 33))
        return req
    },
    resource: "gardens",
    baseResource: "plants", 
    baseAmount() {return player.p.points}, 
    type: "static",
    canBuyMax: true,
    roundUpCost: true,
    branches: ['p'],
    update(diff) {
    },
    exponent() {
        let exp = new Decimal(0.4)
        return exp
    },
    base() {
        let base = new Decimal(2)
        return base
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "resource-display",
        "blank",
        "milestones",
        "blank",
        "buyables",
        "blank",
        "upgrades",
        "blank",
    ],
    doReset(resettingLayer) {
        if(layers[resettingLayer].row <= layers[this.layer].row) return;
        
        let keep = [];
        layerDataReset(this.layer, keep)
    },
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    directMult() {
        let mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 1,
    hotkeys: [
        {key: "g", description: "G: Reset for Gardens", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade('p', 24) || player.g.best.gte(1)},
    
    upgrades: {
        11: {
            title: "Lawn",
            description: "Multiply Point Gain Based on Plants and Best Gardens",
            cost() {return d(1)},
            effect() {return player.g.best.max(0).add(1).times(player.p.points.max(0).add(1))},
            effectDisplay() {return "×"+format(this.effect())},
            tooltip: "Plants × Best Gardens",
        },
        12: {
            title: "Raised Beds",
            description: "Unlock a Plant Buyable",
            cost() {return d(1)},
            unlocked() {return hasUpgrade('g', 11)},
        },
        13: {
            title: "Terracotta Pots",
            description: "Garden Upgrade 1-1 Also Divides Plant Costs",
            cost() {return d(2)},
            effect() {return upgradeEffect('g', 11)},
            unlocked() {return hasUpgrade('g', 12)},
        },
        14: {
            title: "Ceramic Pots",
            description: "Divide 'Prickly Pear' Cost Based on Plant Magnitude",
            cost() {return d(3)},
            effect() {return mag(player.p.points, 10-smartUpgradeEffect('p', 32, 0)).pow_base(2)},
            effectDisplay() {return "÷"+format(this.effect())},
            unlocked() {return hasUpgrade('g', 13)},
        },
        21: {
            title: "Raised Beds II",
            description: "Unlock a Plant Buyable, Requires 140 Plants",
            cost() {return d(3)},
            canAfford() {return player.p.points.gte(140)},
            unlocked() {return hasUpgrade('g', 14)},
        },
        22: {
            title: "Shed",
            description: "Divide Garden Costs Based on Magnitude of Plants",
            cost() {return d(6)},
            effect() {return mag(player.p.points, 10).pow_base(1.1)},
            effectDisplay() {return "÷"+format(this.effect())},
            unlocked() {return hasUpgrade('g', 21)},
        },
        23: {
            title: "Woodshed",
            description: "Multiply Point Gain by Gardens",
            cost() {return d(16)},
            effect() {return player.g.points.max(0).add(1)},
            effectDisplay() {return "×"+format(this.effect())},
            unlocked() {return hasUpgrade('g', 22)},
        },
        24: {
            title: "Greenhouse",
            description: "Unlock... Coming Soon...",
            cost() {return d(24)},
            unlocked() {return hasUpgrade('g', 23)},
        },
    },
    milestones: {
        0: {
            requirementDescription: "8 Gardens",
            effectDescription: "Auto-Gain Plants and Unlock a New Row of Plant Upgrades and Keep Plant Upgrades on Garden Reset",
            done() {return player.g.points.gte(8)},
            toggles: [["p", "autoGain"]],
        },
    },
})