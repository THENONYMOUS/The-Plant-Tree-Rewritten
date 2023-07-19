addLayer("stat", { // Achievements Layer
    name: "achievements",
    symbol: "A",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        holdShift: true,
        buyMax: false,
        preciseNum: false,
        gameSpeed: 100,
    }},
    color: "#FFDD00",
    resource: "achievements",
    type: "none",
    leftTab: true,
    update() {
        player.stat.points = new Decimal(player.stat.achievements.length)
    },
    tabFormat: {
        "Tree": {
            content: [
                "blank",
                "blank",
                ["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}],
                "blank",
                "blank",
            ],
        },
        "Tree & Controls": {
            content: [
                ["row", 
                 [
                    ["display-text", () => {return "Toggle for Buy Max on Buyables"}], "blank", ["toggle", ["stat", "buyMax"]]
                 ]
                ],
                ["row", 
                 [
                    ["display-text", () => {return "Hold Shift on Achievement Tooltips to See Requirements, Toggle to Force"}], "blank", ["toggle", ["stat", "holdShift"]]
                 ]
                ],
                ["row", 
                 [
                    ["display-text", () => {return "Hold Ctrl to See Precise Numbers, Toggle to Force"}], "blank", ["toggle", ["stat", "preciseNum"]]
                 ]
                ],
                "blank",
                "blank",
                ["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}],
                "blank",
                ["display-text", function() {return "time speed: "+formatWhole(player.stat.gameSpeed)+"%"}],
                ["slider", ["gameSpeed", 1, 100]],
                "clickables",
                "blank",
            ],
        },
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
            unlocked: false,
        },
    },
    achievementPopups: false,
    row: "side",
    layerShown(){return player.navTab !== 'stat'},
    clickables: {
        ...clickables({
            startRow: 2,
            layer: 'p',
            layerName: "Plant",
            resettingLayer: 'g',
            resettingLayerName: "Garden",
            respecReset() {return !inCompletion('z', 21, 2)},
        }),
        ...clickables({
            startRow: 4,
            layer: 'g',
            layerName: "Garden",
        }),
        ...clickables({
            startRow: 6,
            layer: 'z',
            layerName: "Zone",
        }),
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
        if(false) {
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
        eaters: new Decimal(0),
    }},
    color: "#22DD11",
    requires() {
        let req = new Decimal(10)
        req = req.div(smartUpgradeEffect('p', 13))
        req = req.div(smartUpgradeEffect('p', 21))
        req = req.div(smartUpgradeEffect('p', 22))
        req = req.div(smartUpgradeEffect('p', 41))
        req = req.div(smartUpgradeEffect('g', 13))
        req = req.div(smartUpgradeEffect('g', 31))
        req = req.div(buyableEffect('p', 12))
        if(inChallenge('z', 11)) req = req.mul(player.points.max(0).add(100).log(100).tetrate(2))
        if(inChallenge('z', 21)) req = req.mul(d(player.p.upgrades.length).max(0).add(1).root(10).pow(15).pow_base(15))
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
        base = base.sub(1).mul(buyableEffect('p', 13)).add(1)
        return base
    },
    tabFormat: [
        "main-display",
        ["display-text", function() {return hasUpgrade('p', 14) ? "Next Magnitude Increase at "+format(player.points.max(0).add(1).log(10-smartUpgradeEffect('p', 34, 0)).ceil().pow_base(10-smartUpgradeEffect('p', 34, 0)))+" Points." : ""}],
        "prestige-button",
        "resource-display",
        ["display-text", function() {
            let effect = d(player.p.upgrades.length).max(0).add(1).root(10)
            if(inChallenge('z', 21)) effect = effect.pow(15).pow_base(15)
            return "Point Gain is Divided Based on Plant Upgrades. Currently: ÷"+format(effect)
        }],
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
        if(inChallenge('z', 12)) mult = mult.div(5)
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
        41: {
            title: "Date Palm",
            description: "Divide Plant Costs based on Points and Plants",
            cost() {return d(325)},
            unlocked() {return completionDecimal('z', 11).gte(1)},
            effect() {return player.points.max(0).add(10).log(10).mul(player.p.points.max(0).add(1)).pow(3)},
            effectDisplay() {return "÷"+format(this.effect())},
            tooltip: "((log10 Points) × Plants) ^ 3",
        },
        42: {
            title: "Sago Palm",
            description: "Multiply Point Gain based on Base Plant Cost",
            cost() {return d(380)},
            unlocked() {return completionDecimal('z', 11).gte(2)},
            effect() {return tmp.p.requires.div(10).reciprocal().log(2).max(1)},
            effectDisplay() {return "×"+format(this.effect())},
            tooltip: "log2 recip (Cost/10)",
        },
        43: {
            title: "Açai Palm",
            description: "Divide Garden Costs and multiply Point Gain based on Prickly Pear amount",
            cost() {return d(418)},
            unlocked() {return completionDecimal('z', 11).gte(3)},
            effect() {return getBuyableAmount('p', 11).max(0).div(20).add(1)},
            effectDisplay() {return "÷/×"+format(this.effect())},
            tooltip: "(amt ÷ 20) + 1",
        },
        44: {
            title: "Areca Palm",
            description: "Divide Prickly Pear cost based on Saguaro amount",
            cost() {return d(450)},
            unlocked() {return completionDecimal('z', 11).gte(3)},
            effect() {return getBuyableAmount('p', 12).max(0).add(0.75).div(2.5).ceil().max(0).pow_base(2)},
            effectDisplay() {return "÷"+format(this.effect())},
            tooltip: "2 ^ ceil (amt ÷ 2.5)",
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
                mult = mult.div(smartUpgradeEffect('p', 44))
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
                let max = player.p.points.div(this.costMult()).div(10).log(2).max(0)
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
                let max = player.points.div(this.costMult()).div(1000).log(1000).max(0)
                max = max.add(1).floor()
                player.points = player.points.sub(this.cost().mul(max.sub(this.amount())).max(0)).max(0)
                setBuyableAmount(this.layer, this.id, max.max(this.amount()))
            },
            effect() {return d(10).pow(this.amount())},
            unlocked() {return hasUpgrade('g', 21)},
        },
        13: {
            title: "Echinocactus",
            display() {return autoThisBuyableDisplay("Multiply Plant Base above 1 by 0.99", this)+"<br>Currently: ×"+format(this.effect())+"."},
            cost(x = this.amount()) {
                x = d(x)
                let cost = x.add(1).tetrate(1.001).times(50)
                cost = cost.mul(this.costMult())
                return cost
            },
            costMult() {
                let mult = d(1)
                return mult
            },
            amount() {return getBuyableAmount(this.layer, this.id)},
            canAfford() {return player.p.points.max(0).gte(this.cost())},
            buy() {
                if(player.stat.buyMax) {buyMaxBuyable(this.layer, this.id)}
                else {
                    addBuyables(this.layer, this.id, 1)
                }
            },
            buyMax() {
                let max = player.p.points.div(this.costMult()).div(50).tetrate(1/1.001).max(0)
                max = max.add(1).floor()
                setBuyableAmount(this.layer, this.id, max.max(this.amount()))
            },
            effect() {return d(0.99).pow(this.amount())},
            unlocked() {return completionDecimal('z', 21).gte(3)},
        },
    },
})
addLayer("g", { // Garden Layer
    name: "gardens",
    symbol: "G",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        best: new Decimal(0),
    }},
    color: "#FFAA00",
    requires() {
        let req = new Decimal(50)
        req = req.div(smartUpgradeEffect('g', 22))
        req = req.div(smartUpgradeEffect('p', 33))
        req = req.div(smartUpgradeEffect('p', 43))
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
            effect() {
                let mag_base = d(10)
                mag_base = mag_base.sub(smartUpgradeEffect('p', 32, 0))
                mag_base = mag_base.sub(smartUpgradeEffect('g', 34, 0))
                let fx_base = d(2)
                fx_base = fx_base.add(smartMilestoneEffect('g', 1, 0))
                fx_base = fx_base.add(smartUpgradeEffect('g', 34, 0))
                return mag(player.p.points, mag_base).pow_base(fx_base)
            },
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
            description: "Divide Garden Costs Based on Plant Magnitude",
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
            description: "Unlock Zones",
            cost() {return d(24)},
            unlocked() {return hasUpgrade('g', 23)},
        },
        31: {
            title: "Decking I - Wood",
            description: "Divide Plant Costs based on Zones Effect",
            cost() {return d(75)},
            unlocked() {return hasUpgrade('g', 24) && completionDecimal('z', 12).gte(1)},
            effect() {return tmp.z.effect.pow(3)},
            effectDisplay() {return "÷"+format(this.effect())},
            tooltip: "effect ^ 3",
        },
        32: {
            title: "Decking II - Building",
            description: "Cube Zones Effect",
            cost() {return d(83)},
            unlocked() {return hasUpgrade('g', 31) && completionDecimal('z', 12).gte(2)},
            effect() {return d(3)},
        },
        33: {
            title: "Decking III - Paint",
            description: "Multiply Point Gain based on Gardens but when under best Gardens effect is nerfed",
            cost() {return d(92)},
            unlocked() {return hasUpgrade('g', 32) && completionDecimal('z', 12).gte(3)},
            effect() {return player.g.points.max(0).pow(2).div(player.g.best.sub(player.g.points.max(0)).max(0).add(1)).max(0).add(1)},
            effectDisplay() {return "×"+format(this.effect())},
            tooltip: "Gardens ^ 2 ÷ (best - current + 1) + 1",
        },
        34: {
            title: "Decking IV - Finished",
            description: "Garden Upgrade 1-4 is Improved",
            cost() {return d(99)},
            unlocked() {return hasUpgrade('g', 33) && completionDecimal('z', 12).gte(3)},
            effect() {return d(1)},
            tooltip: "<i>^ 3 -> ^ 4<br>log5 -> log4",
        },
    },
    milestones: {
        0: {
            requirementDescription: "8 Gardens",
            effectDescription: "Auto-Gain Plants and Unlock a New Row of Plant Upgrades and Keep Plant Upgrades on Garden Reset",
            done() {return player.g.points.gte(8)},
            toggles: [["p", "autoGain"]],
        },
        1: {
            requirementDescription: "44 Gardens",
            effectDescription: "Garden Upgrade 1-4 is Better<br><font size = 2px><i>2 ^ -> 3 ^</i></font>",
            done() {return player.g.points.gte(44)},
            effect: 1,
        },
    },
    buyables: {
        11: {
            title: "Water Features",
            display() {return autoThisBuyableDisplay("Multiply Point Gain by Forest Zone Completions (free)", this)+"<br>Currently: ×"+format(this.effect())+"."},
            cost(x = this.amount()) {
                let cost = x.times(10).add(100)
                cost = cost.mul(this.costMult())
                return cost
            },
            costMult() {
                let mult = d(1)
                return mult
            },
            amount() {return getBuyableAmount(this.layer, this.id)},
            canAfford() {return player.g.points.max(0).gte(this.cost())},
            buy() {
                if(player.stat.buyMax) {buyMaxBuyable(this.layer, this.id)}
                else {
                    addBuyables(this.layer, this.id, 1)
                }
            },
            buyMax() {
                let max = player.g.points.div(this.costMult()).sub(100).div(10)
                max = max.add(1).floor()
                setBuyableAmount(this.layer, this.id, max.max(this.amount()))
            },
            effect() {return completionDecimal('z', 22).max(0).add(1).pow(this.amount())},
            unlocked() {return completionDecimal('z', 22).gte(1)},
        },
        12: {
            title: "Tunnel Features",
            display() {return autoThisBuyableDisplay("Multiply Point Gain by Zones (free)", this)+"<br>Currently: ×"+format(this.effect())+"."},
            cost(x = this.amount()) {
                let cost = x.times(10).add(103)
                cost = cost.mul(this.costMult())
                return cost
            },
            costMult() {
                let mult = d(1)
                return mult
            },
            amount() {return getBuyableAmount(this.layer, this.id)},
            canAfford() {return player.g.points.max(0).gte(this.cost())},
            buy() {
                if(player.stat.buyMax) {buyMaxBuyable(this.layer, this.id)}
                else {
                    addBuyables(this.layer, this.id, 1)
                }
            },
            buyMax() {
                let max = player.g.points.div(this.costMult()).sub(103).div(10)
                max = max.add(1).floor()
                setBuyableAmount(this.layer, this.id, max.max(this.amount()))
            },
            effect() {return player.z.points.max(0).add(1).pow(this.amount())},
            unlocked() {return completionDecimal('z', 22).gte(2)},
        },
        13: {
            title: "Exploration Features",
            display() {return autoThisBuyableDisplay("Multiply... Coming Soon...", this)+"<br>Currently: ×"+format(this.effect())+"."},
            cost(x = this.amount()) {
                let cost = x.times(10).add(107)
                cost = cost.mul(this.costMult())
                return cost
            },
            costMult() {
                let mult = d(1)
                return mult
            },
            amount() {return getBuyableAmount(this.layer, this.id)},
            canAfford() {return player.g.points.max(0).gte(this.cost())},
            buy() {
                if(player.stat.buyMax) {buyMaxBuyable(this.layer, this.id)}
                else {
                    addBuyables(this.layer, this.id, 1)
                }
            },
            buyMax() {
                let max = player.g.points.div(this.costMult()).sub(103).div(10)
                max = max.add(1).floor()
                setBuyableAmount(this.layer, this.id, max.max(this.amount()))
            },
            effect() {return this.amount().max(0)},
            unlocked() {return completionDecimal('z', 22).gte(3)},
        },
    },
})
addLayer("z", { // Zones Layer
    name: "zones",
    symbol: "Z",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        best: new Decimal(0),
    }},
    color: "#00AAFF",
    requires() {
        let req = new Decimal(300)
        return req
    },
    resource: "zones",
    baseResource: "plants", 
    baseAmount() {return player.p.points}, 
    type: "static",
    canBuyMax: true,
    roundUpCost: true,
    branches: ['p', 'g'],
    update(diff) {
        if(inChallenge('z', 22)) player.p.eaters = player.p.eaters.add(getPointGen().times(diff).times(player.p.eaters.add(1).root(2).times(player.p.eaters.add(2).log(2))).root(2))
        if(inChallenge('z', 22) && player.p.eaters.gte(player.points)) {doReset('z', true); doPopup("challenge", "The Forest Zone", "Challenge Failed", 3, "#00AAFF")}
    },
    exponent() {
        let exp = new Decimal(0.6)
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
        ["display-text", function() {return "Your Zones and Zone Completions are multiplying Point Gain. Currently: ×"+format(tmp.z.effect)}],
        "blank",
        "milestones",
        "blank",
        "challenges",
        "blank",
    ],
    effect() {
        let effect = player.z.points.add(1)
        for(id in player.z.challenges) {
            effect = effect.mul(completionDecimal('z', id).max(0).add(1))
        }
        effect = effect.pow(smartUpgradeEffect('g', 32))
        return effect
    },
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
        {key: "z", description: "Z: Reset for Zones", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade('g', 24) || player.z.best.gte(1)},
    
    milestones: {
        0: {
            requirementDescription: "1 Zone",
            effectDescription: "Unlock The Tropical Zone",
            done() {return player.z.points.gte(1)},
        },
        1: {
            requirementDescription: "2 Zones",
            effectDescription: "Unlock The Alpine Zone",
            done() {return player.z.points.gte(2)},
        },
        2: {
            requirementDescription: "3 Zones",
            effectDescription: "Unlock The Temperate Zone",
            done() {return player.z.points.gte(3)},
        },
        3: {
            requirementDescription: "4 Zones",
            effectDescription: "Unlock The Forest Zone",
            done() {return player.z.points.gte(4)},
        },
    },
    challenges: {
        11: {
            name() {return "The Tropical Zone "+formatWhole(thisCompletionDecimal(this).div(0.03))+"%"},
            challengeDescription: "Multiply Plant Costs Based on Points<br><font size = 2px>log100 (Points) ^^ 2</font>",
            rewardDescription: "Unlock Plant Upgrades",
            unlocked() {return hasMilestone('z', 0)},
            completionLimit: 3,
            
            baseAmount() {return player.p.points},
            requirementArray: [135, 141, 143],
            baseName: " Plants",
            requirement() {return thisChallengeRequirement(this)},
            goalDescription() {return challengeGoalDescription(this.layer, this.id)},
            canComplete() {return challengeCanComplete(this.layer, this.id)},
        },
        12: {
            name() {return "The Alpine Zone "+formatWhole(thisCompletionDecimal(this).div(0.03))+"%"},
            challengeDescription: "Directly Divide Plants by 5",
            rewardDescription: "Unlock Garden Upgrades",
            unlocked() {return hasMilestone('z', 1)},
            completionLimit: 3,
            requirementArray: [16, 29, 58],
            
            baseAmount() {return player.p.points},
            baseName: " Plants",
            requirement() {return thisChallengeRequirement(this)},
            goalDescription() {return challengeGoalDescription(this.layer, this.id)},
            canComplete() {return challengeCanComplete(this.layer, this.id)},
        },
        21: {
            name() {return "The Temperate Zone "+formatWhole(thisCompletionDecimal(this).div(0.03))+"%"},
            challengeDescription: "(Puzzle Zone) Upgrade -> Point nerf is increased and multiplies Plant cost and 'Reset Plant Upgrades' doesn't cause a Garden reset in 3rd completion<br><font size = 2px>15 ^ (x ^ 15)</font>",
            rewardDescription: "Unlock a Plant Buyable (at 100%)",
            unlocked() {return hasMilestone('z', 2)},
            completionLimit: 3,
            requirementArray: [235, 260, 300],
            
            baseAmount() {return player.p.points},
            baseName: " Plants",
            requirement() {return thisChallengeRequirement(this)},
            goalDescription() {return challengeGoalDescription(this.layer, this.id)},
            canComplete() {return challengeCanComplete(this.layer, this.id)},
        },
        22: {
            name() {return "The Forest Zone "+formatWhole(thisCompletionDecimal(this).div(0.03))+"%"},
            challengeDescription: "<font size = 2px>sqrt (Points Gain) is Replaced with 'Eaters' which divide Point Gain based on themselves (doesn't affect Eaters), you fail the challenge if Eaters overtake Points, Points gain also sqrt'ed before Eater effect</font><br><font size = 1px>Point Gain ÷ (sqrt (Eaters) × log2(Eaters))</font>",
            rewardDescription: "Unlock Garden Buyables",
            unlocked() {return hasMilestone('z', 3)},
            completionLimit: 3,
            requirementArray: [189, 211, 256],
            
            baseAmount() {return player.p.points},
            baseName: " Plants",
            requirement() {return thisChallengeRequirement(this)},
            goalDescription() {return challengeGoalDescription(this.layer, this.id)},
            canComplete() {return challengeCanComplete(this.layer, this.id)},
        },
    },
})