addLayer("stat", {
    name: "achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        holdShift: true,
    }},
    color: "#FFDD00",
    resource: "achievements", // Name of prestige currency
    type: "none",
    update() {
        player.stat.points = new Decimal(player.stat.achievements.length)
    },
    tabFormat: [
        "main-display",
        ["row", 
         [
             ["display-text", () => {return "Hold Shift on Achievement Tooltips to See Requirements, Toggle to Force"}], "blank", ["toggle", ["stat", "holdShift"]]
         ]
        ],
        "blank",
        "clickables",
        "blank",
        "achievements",
        "blank",
    ],
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    clickables: {
        11: {
            title: "Reset Plant Upgrades",
            canClick: true,
            onClick() {
                player.p.upgrades = []
            },
            unlocked() {return hasUpgrade('g', 24)},
        },
        12: {
            title: "Buy Plant Upgrades",
            canClick: true,
            onHold() {
                autobuyUpgrades('p')
            },
            unlocked() {return hasUpgrade('g', 24)},
        },
    },
    achievements: {
        11: {
            name: "1st Plant!",
            done() {return player.p.points.gte(1)},
            tooltip() {return (xor(shiftDown, player.stat.holdShift))?"Get Your First Plant":"Seems Familiar"},
        },
        12: {
            name: "1st Upgrade!",
            done() {return hasUpgrade('p', 11)},
            tooltip() {return (xor(shiftDown, player.stat.holdShift))?"Get Your First Plant Upgrade":"Seems Similar"},
        },
        13: {
            name: "Peaceful Gardening",
            done() {return hasUpgrade('p', 21)},
            tooltip() {return (xor(shiftDown, player.stat.holdShift))?"Buy a Peace Lily":"A New Upgrade For The Rewritten Version!"},
        },
        14: {
            name: "MORE SPACE",
            done() {return player.g.points.gte(1)},
            tooltip() {return ((xor(shiftDown, player.stat.holdShift))?"Get Your First Garden":"We've Been Growing Plants Without a Garden All This Time!?")+"<br>Reward: Point Gain is Multiplied by 2"},
            effect: 2,
        },
        15: {
            name: "Plant Central",
            done() {return player.p.points.gte(100)},
            tooltip() {return ((xor(shiftDown, player.stat.holdShift))?"Get 100 Plants":"That's a Lot of Plants You Got There")+"<br>Reward: Get Up to 10 Free Plants When You Have at Least 90 Plants"},
        },
        16: {
            name: "Uhh, Grow Faster Please",
            done() {return player.points.gte("2.5e20")},
            tooltip() {return ((xor(shiftDown, player.stat.holdShift))?"Get 2.50e20 Points":"Guys, The Game Slowed Down Too Much... Balancing in Progress...")+"<br>Reward: Increase 'Saguaro' Effect Base By 2"},
            effect() {return 2},
        },
        21: {
            name: "The 9th Garden is Not a Lie",
            done() {return player.g.points.gte(9)},
            tooltip() {return ((xor(shiftDown, player.stat.holdShift))?"Get 9 Gardens":"One For Each Dimension, Including Slabdrill's Foul Heresy")+"<br>Reward: Decrease Garden Exponent by 1 ÷ 9"},
            effect() {return 1/9},
        },
        22: {
            name: "OK this is not gonna work",
            done() {return player.points.gte(getPointGen().times(100)) && !canReset('p')},
            tooltip() {return ((xor(shiftDown, player.stat.holdShift))?"Reach 100× as Many Points as Your Points/sec When You Still Can't Afford Another Plant":"The Universe Loves Me. idk why i put this here :cry:")+"<br>Reward: Saguaro Costs are Rooted to 1.2"},
            effect() {return 1.2},
        },
        23: {
            name: "Single-Species",
            done() {return getBuyableAmount('p', 11).lte(0) && getBuyableAmount('p', 12).gte(1)},
            tooltip() {return ((xor(shiftDown, player.stat.holdShift))?"Buy a Prickly Pear Without Any Saguaro Buyables":"But Where are the Prickly Pears From...")+"<br>Reward: Increase 3rd Plant Milestone Exponent by 1"},
            effect: 1,
        },
        24: {
            name: "No Rosemary: Inspired by 🆎ur3colo",
            done() {return hasUpgrade('p', 34)},
            tooltip() {return ((xor(shiftDown, player.stat.holdShift))?"Buy 'Parsley'":"🆎ur3colo Wants to Call it 'High Guardian Spice <u>Ban</u>' <font size = 1px><br>🆎ur3colo doesn't like this animated series, 🆎ur3colo knew about this series and in The Plant Tree Original There were 2 upgrades, rosemary and parsley which 🆎ur3colo thought of this animated series when those upgrades were seen, 🆎ur3colo then said 'OH NO OH HELL NO'</font>")},
        },
    },
}),
addLayer("p", {
    name: "plants", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        best: new Decimal(0),
    }},
    color: "#22DD11",
    requires() {
        let req = new Decimal(10)
        req = req.div(smartMilestoneEffect('p', 1))
        req = req.div(smartMilestoneEffect('g', 1))
        req = req.div(smartUpgradeEffect('p', 12))
        req = req.div(smartUpgradeEffect('p', 13))
        req = req.div(smartUpgradeEffect('p', 22))
        req = req.div(buyableEffect('p', 11))
        req = req.mul(smartUpgradeEffect('p', 31))
        return req
    },
    resource: "plants", // Name of prestige currency
    baseResource: "points", 
    baseAmount() {return player.points}, 
    type: "static",
    resetsNothing() {return player.p.autoGain && hasMilestone('g', 3)},
    autoPrestige() {return player.p.autoGain && hasMilestone('g', 3)},
    canBuyMax: true,
    update(diff) {
        if(hasAchievement('stat', 15) && player.p.points.gte(90)) player.p.points = new Decimal(100).max(player.p.points)
    },
    exponent() {
        let exp = new Decimal(1)
        return exp
    }, // Prestige currency exponent
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
        if((resettingLayer === 'g' && hasMilestone('g', 2))) keep.push("milestones")
        if((resettingLayer === 'g' && hasMilestone('g', 3))) keep.push("upgrades")
        layerDataReset(this.layer, keep)
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for Plants", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    magnitude() {return player.points.add(1).log(10+smartUpgradeEffect('p', 34, 0)).floor()},
    milestones: {
        0: {
            requirementDescription: "1 Plant",
            effectDescription() {return "Multiply Point Gain by Plants<br>Currently: ×"+format(thisMilestoneEffect(this))},
            done() {return player.p.points.gte(1)},
            effect() {return player.p.points.max(0).add(1).pow(smartUpgradeEffect('p', 11))},
        },
        1: {
            requirementDescription: "3 Plants",
            effectDescription() {return "Divide Plant Requirements by Plants<br>Currently: ÷"+format(thisMilestoneEffect(this))},
            done() {return player.p.points.gte(3)},
            effect() {return player.p.points.max(0).add(1)},
        },
        2: {
            requirementDescription: "8 Plants",
            effectDescription() {return "Multiply Point Gain Based on Points<br>Currently: ×"+format(thisMilestoneEffect(this))},
            done() {return player.p.points.gte(8)},
            effect() {
                let exp = new Decimal(1)
                exp = exp.add(smartUpgradeEffect('g', 12, 0))
                exp = exp.add(smartAchievementEffect('stat', 23, 0))
                return player.points.max(0).add(2).log(2).root(2).pow(exp)
            },
        },
    },
    upgrades: {
        11: {
            title: "Sedum",
            description: "Square 1st Milestone Effect",
            cost: (new Decimal(12)),
            effect: 2,
        },
        12: {
            title: "Bear Paw",
            description: "Divide Plant Requirements Based on Points",
            cost: (new Decimal(16)),
            effect() {return player.points.max(0).add(3).log(1.5).root(1.5)},
            effectDisplay() {return "÷"+format(this.effect())},
            tooltip: "1.5rt log1.5 (Points + 3)",
        },
        13: {
            title: "Jade Plant",
            description: "Divide Plant Requirements Based on Plants, Again",
            cost: (new Decimal(22)),
            effect() {return player.p.points.max(0).add(1).root(1.5)},
            effectDisplay() {return "÷"+format(this.effect())},
            tooltip: "1.5rt Plants",
        },
        14: {
            title: "Snake Plant",
            description: "Multiply Point Gain Based on Point Magnitude",
            cost: (new Decimal(25)),
            effect() {return tmp.p.magnitude.pow_base(new Decimal(2).add(smartUpgradeEffect('g', 22, 0)))},
            effectDisplay() {return "×"+format(this.effect())},
            tooltip: "2 ^ Magnitude",
        },
        21: {
            title: "Peace Lily",
            description: "Increase Base Point Gain Based on Points",
            cost: (new Decimal(35)),
            effect() {return player.points.add(1).log(10)},
            effectDisplay() {return "+"+format(this.effect())},
            tooltip: "log10 Points",
        },
        22: {
            title: "Anthurium",
            description: "Divide Plant Requirements Based on Point Magnitude",
            cost: (new Decimal(40)),
            effect() {return player.points.max(0).add(10).log(10+smartUpgradeEffect('p', 34, 0)).sub(1).floor().pow_base(2)},
            effectDisplay() {return "÷"+format(this.effect())},
            tooltip: "2 ^ (Magnitude - 1)",
        },
        23: {
            title: "Yucca",
            description: "Multiply Point Gain by Plants, Increases in Intervals of 10",
            cost: (new Decimal(50)),
            effect() {return player.p.points.div(10).floor().mul(10).max(1)},
            effectDisplay() {return "×"+format(this.effect())},
            tooltip: "floor (Plants ÷ 10) × 10",
        },
        24: {
            title: "Coconut Palm",
            description: "Multiply Point Gain Based on Plants",
            cost: (new Decimal(65)),
            effect() {return player.p.points.max(0).add(1).root(2).pow_base(2+smartUpgradeEffect('p', 33, 0))},
            effectDisplay() {return "×"+format(this.effect())},
            tooltip: "2 ^ sqrt Plants",
        },
        31: {
            title: "Chives",
            description: "Multiply Point Gain and Plant Requirements by 1e10",
            cost: (new Decimal(525)),
            effect: new Decimal("1e10"),
            unlocked() {return hasUpgrade('g', 24)},
        },
        32: {
            title: "Mint",
            description: "Divide Garden Requirements Based on Gardens",
            cost: (new Decimal(690)),
            effect() {return player.g.points.max(0).add(3).log(3).root(3)},
            effectDisplay() {return "÷"+format(this.effect())},
            unlocked() {return hasUpgrade('g', 24)},
            tooltip: "3rt log3 Gardens",
        },
        33: {
            title: "Thyme",
            description: "Increase 'Coconut Palm' Base by 1",
            cost: (new Decimal(723)),
            effect() {return 1},
            unlocked() {return hasUpgrade('g', 24)},
            tooltip: "<i>2 ^ sqrt Plants</i> -> <i>3 ^ sqrt Plants</i>",
        },
        34: {
            title: "Parsley",
            description: "Upgrades Based on Point Magnitude are Better",
            cost: (new Decimal(799)),
            effect() {return -2.5},
            unlocked() {return hasUpgrade('g', 24)},
            tooltip: "<i>log10 Plants</i> -> <i>log7.5 Plants</i>",
        },
    },
    buyables: {
        11: {
            title: "Saguaro",
            amount() {return getBuyableAmount(this.layer, this.id)},
            display() {return autoThisBuyableDisplay("Divide Plant Requirements by "+formatWhole(new Decimal(3).add(smartAchievementEffect('stat', 16, 0))), this, " Points")+"<br>Currently: ÷"+format(this.effect())+". "},
            cost(x=this.amount()) {
                x=new Decimal(x)
                return x.pow_base(1000).root(smartAchievementEffect('stat', 22)).mul(this.costMult())
            },
            costMult() {
                let mul = decimalOne
                return mul
            },
            canAfford() {return player.points.gte(this.cost())},
            buy() {
                player.points = player.points.sub(this.cost()).max(0)
                addBuyables(this.layer, this.id, 1)
            },
            effect(x=this.amount()) {
            x=new Decimal(x)
            return x.pow_base(new Decimal(3).add(smartAchievementEffect('stat', 16, 0)))
            },
            unlocked() {return hasMilestone('g', 2)},
        },
        12: {
            title: "Prickly Pear",
            amount() {return getBuyableAmount(this.layer, this.id)},
            display() {return autoThisBuyableDisplay("Multiply Point Gain by 20", this, " Plants")+"<br>Currently: ×"+format(this.effect())+". "},
            cost(x=this.amount()) {
                x=new Decimal(x)
                return x.pow(1.1).pow_base(1.1).root(3).times(300).mul(this.costMult()).ceil()
            },
            costMult() {
                let mul = decimalOne
                return mul
            },
            canAfford() {return player.p.points.gte(this.cost())},
            buy() {
                addBuyables(this.layer, this.id, 1)
            },
            effect(x=this.amount()) {
            x=new Decimal(x)
            return x.pow_base(20)
            },
            unlocked() {return hasUpgrade('g', 23)},
        },
    },
})
addLayer("g", {
    name: "gardens", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        best: new Decimal(0),
    }},
    color: "#FFAA00",
    requires() {
        let req = new Decimal(85)
        req = req.div(smartUpgradeEffect('g', 14))
        req = req.div(smartUpgradeEffect('p', 32))
        return req
    },
    resource: "gardens", // Name of prestige currency
    baseResource: "plants", 
    baseAmount() {return player.p.points}, 
    type: "static",
    canBuyMax: true,
    roundUpCost: true,
    branches: ['p'],
    exponent() {
        let exp = new Decimal(1.1)
        exp = exp.sub(smartAchievementEffect('stat', 21, 0))
        return exp
    }, // Prestige currency exponent
    base() {
        let base = new Decimal(92/85)
        return base
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "resource-display",
        "blank",
        "milestones",
        "blank",
        "upgrades",
        "blank",
    ],
    doReset(resettingLayer) {
        if(layers[resettingLayer].row <= layers[this.layer].row) return;
        
        let keep = [];
        layerDataReset(this.layer, keep)
        
        if(!player.g.upgrades.includes(24)) player.g.upgrades.push(24)
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "g", description: "G: Reset for Gardens", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade('p', 24) || player.g.best.gte(1)},
    milestones: {
        0: {
            requirementDescription: "1 Garden",
            effectDescription() {return "Multiply Point Gain by Gardens<br>Currently: ×"+format(this.effect())},
            done() {return player.g.points.gte(1)},
            effect() {return player.g.points.max(0).add(1)},
        },
        1: {
            requirementDescription: "2 Gardens",
            effectDescription() {return "Divide Plant Requirements Based on Gardens<br>Currently: ÷"+format(this.effect())},
            done() {return player.g.points.gte(2)},
            effect() {return player.g.points.max(0).add(1).pow(3)},
        },
        2: {
            requirementDescription: "3 Gardens",
            effectDescription: "Unlock a Plant Buyable and Keep Plant Milestones on Garden Reset",
            done() {return player.g.points.gte(3)},
        },
        3: {
            requirementDescription: "18 Gardens",
            effectDescription: "Auto-Gain Plants and Keep Plant Upgrades on Garden Reset",
            done() {return player.g.points.gte(18)},
            toggles: [["p", "autoGain"]],
        },
    },
    upgrades: {
        11: {
            title: "Plastic Pots",
            description: "Increase Base Point Gain Based on Gardens",
            cost: (new Decimal(5)),
            effect() {return player.g.points.max(0).add(1).pow(3)},
            effectDisplay() {return "+"+format(this.effect())},
            tooltip: "Gardens ^ 3",
        },
        12: {
            title: "Sturdy Plastic Pots",
            description: "Increase 3rd Milestone Exponent Based on Gardens",
            cost: (new Decimal(6)),
            effect() {return player.g.points.max(0).add(1).root(2)},
            effectDisplay() {return "+"+format(this.effect())},
            tooltip: "sqrt Gardens",
        },
        13: {
            title: "Terracotta Pots",
            description: "Multiply Point Gain Based on Gardens",
            cost: (new Decimal(8)),
            effect() {return player.g.points.max(0).add(1).pow(100).add(10).log(10)},
            effectDisplay() {return "×"+format(this.effect())},
            tooltip: "log10 (Gardens ^ 100)",
        },
        14: {
            title: "Ceramic Pots",
            description: "Divide Garden Requirements Based on Points",
            cost: (new Decimal(12)),
            effect() {return player.points.max(0).add(2).log(10).root(10)},
            effectDisplay() {return "÷"+format(this.effect())},
            tooltip: "10rt log10 Points",
        },
        21: {
            title: "Decking I",
            description: "Multiply Point Gain Based on 'Saguaro' Amount",
            cost: (new Decimal(18)),
            effect() {return getBuyableAmount('p', 11).max(0).add(1).pow(2)},
            effectDisplay() {return "×"+format(this.effect())},
            tooltip: "Saguaro Amt ^ 2",
        },
        22: {
            title: "Decking II",
            description: "Increase 'Snake Plant' Base by 0.5",
            cost: (new Decimal(20)),
            effect() {return 0.5},
            tooltip: "<i>2 ^ Magnitude</i> -> <i>2.5 ^ Magnitude</i>",
        },
        23: {
            title: "Raised Beds",
            description: "Unlock A Plant Buyable",
            cost: (new Decimal(23)),
        },
        24: {
            title: "Decking III",
            description: "Multiply Point Gain Based on Plant Upgrades, Unlock 4 More and Unlock The Ability to Reset or Auto-Buy Your Plant Upgrades",
            cost: (new Decimal(29)),
            effect() {return new Decimal(player.p.upgrades.length).max(0).pow_base(2)},
            effectDisplay() {return "×"+format(this.effect())},
            tooltip: "2 ^ Upgrades, You can Reset or Buy Upgrades in the Achievements Layer",
        },
    },
})