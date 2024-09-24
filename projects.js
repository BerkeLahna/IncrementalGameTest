var projects = [];
var activeProjects = [];



var project1 = {
    id: "projectButton1",
    title: "Improved Automation ",
    priceTag: "(750 ammunition)",
    description: "Increases Automation performance 25%",
    trigger: function(){return automationLevel>=2},
    uses: 1,
    cost: function(){return ammunition>=750},
    flag: 0,
    element: null,
    effect: function(){
        project1.flag = 1;
        addMessage("Automation performance boosted by 25%");
        automationEfficiency = automationEfficiency + .25;
        ammunition = ammunition - 750;
        updateDisplay();
        automationBoost = 1;
        project1.element.parentNode.removeChild(project1.element);
        var index = activeProjects.indexOf(project1);
        activeProjects.splice(index, 1);
    }
}

projects.push(project1);


var project2 = {
    id: "projectButton2",
    title: "Beg for More Guns ",
    priceTag: "(1 Loyalty)",
    description: "Admit failure, ask for budget increase to cover the cost of a gun",
    trigger: function(){return  money<GunPrice && Gun<1 && soldiers<1},
    uses: 1,
    cost: function(){return loyalty>=-1},
    flag: 0,
    element: null,
    effect: function(){
        project2.flag = 1;
        addMessage("Budget overage approved, a gun requisitioned from HQ");
        loyalty = loyalty - 1;
        Gun = Gun + 1;
        project2.uses = (project2.uses + 1);
        project2.element.parentNode.removeChild(project2.element);
        var index = activeProjects.indexOf(project2);
        activeProjects.splice(index, 1);
    }
}

projects.push(project2);

var project3 = {
    id: "projectButton3",
    title: "Creativity ",
    priceTag: "(1,000 ammunition)",
    description: "Use idle ammunition to gather intel",
    trigger: function(){return ammunition>=(commandPostsLevel*1000) && ammunition > 1},
    uses: 1,
    cost: function(){return ammunition>=(1000)},
    flag: 0,
    element: null,
    effect: function(){
        project3.flag = 1;
        addMessage("Intel unlocked (Intel increases while ammunition are at max)");
        ammunition = ammunition- 1000;
        IntelON = true;
        project3.element.parentNode.removeChild(project3.element);
        var index = activeProjects.indexOf(project3);
        activeProjects.splice(index, 1);
    }
}

projects.push(project3);

var project4 = {
    id: "projectButton4",
    title: "Even Better Automation ",
    priceTag: "(2,500 ammunition)",
    description: "Increases Automation performance by an additional 50%",
    trigger: function(){return automationBoost == 1},
    uses: 1,
    cost: function(){return ammunition>=2500},
    flag: 0,
    element: null,
    effect: function(){
        project4.flag = 1;
        addMessage("Automation performance boosted by another 50%");
        ammunition= ammunition- 2500;
        automationEfficiency = automationEfficiency + .50;
        automationBoost = 2;
        project4.element.parentNode.removeChild(project4.element);
        var index = activeProjects.indexOf(project4);
        activeProjects.splice(index, 1);
    }
}

projects.push(project4);


var project5 = {
    id: "projectButton5",
    title: "Optimized Automation ",
    priceTag: "(5,000 ammunition)",
    description: "Increases Automation performance by an additional 75%",
    trigger: function(){return automationBoost == 2},
    uses: 1,
    cost: function(){return ammunition>=5000},
    flag: 0,
    element: null,
    effect: function(){
        project5.flag = 1;
        addMessage("Automation performance boosted by another 75%");
        ammunition= ammunition- 5000;
        automationEfficiency = automationEfficiency + .75;
        automationBoost = 3;
        project5.element.parentNode.removeChild(project5.element);
        var index = activeProjects.indexOf(project5);
        activeProjects.splice(index, 1);
    }
}

projects.push(project5);



var project6 = {
    id: "projectButton6",
    title: "Limerick ",
    priceTag: "(10 creat)",
    description: "Algorithmically-generated poem (+1 Trust)",
    trigger: function(){return IntelON},
    uses: 1,
    cost: function(){return intel >= 10},
    flag: 0,
    element: null,
    effect: function(){
        project6.flag = 1;
        addMessage("There was an AI made of dust, whose poetry gained it man's trust...");
        intel = intel - 10;
        loyalty= loyalty+1;
        project6.element.parentNode.removeChild(project6.element);
        var index = activeProjects.indexOf(project6);
        activeProjects.splice(index, 1);
    }
}

projects.push(project6);

var project7 = {
    id: "projectButton7",
    title: "Improved Crate Sizes ",
    priceTag: "(1,750 ammunition)",
    description: "50% more guns from every purchase",
    trigger: function(){return GunPurchaseCount >= 1},
    uses: 1,
    cost: function(){return ammunition>=1750},
    flag: 0,
    element: null,
    effect: function(){
        project7.flag = 1;
        ammunition = ammunition - 1750;
        GunCrate = GunCrate * 1.5;
        addMessage("Gun Crate sizes increased, "+Math.ceil(GunCrate)+" guns from every crate");
        project7.element.parentNode.removeChild(project7.element);
        var index = activeProjects.indexOf(project7);
        activeProjects.splice(index, 1);
    }
}

projects.push(project7);

var project8 = {
    id: "projectButton8",
    title: "Optimized Crate Sizes ",
    priceTag: "(3,500 ops)",
    description: "75% more Guns from every purchase",
    trigger: function(){return Gun >= 15},
    uses: 1,
    cost: function(){return ammunition>=3500},
    flag: 0,
    element: null,
    effect: function(){
        project8.flag = 1;
        ammunition= ammunition- 3500;
        GunCrate = GunCrate * 1.75;
        addMessage("Gun Crate sizes optimized, "+Math.ceil(GunCrate)+" guns from every crate");
        project8.element.parentNode.removeChild(project8.element);
        var index = activeProjects.indexOf(project8);
        activeProjects.splice(index, 1);
    }
}

projects.push(project8);

var project9 = {
    id: "projectButton9",
    title: "Microlattice Shapecasting ",
    priceTag: "(7,500 ammunition)",
    description: "100% more guns from every crate",
    trigger: function(){return GunCrate >= 2600},
    uses: 1,
    cost: function(){return ammunition>=7500},
    flag: 0,
    element: null,
    effect: function(){
        project9.flag = 1;
        ammunition= ammunition- 7500;
        GunCrate = GunCrate * 2;
        addMessage("Using microlattice shapecasting techniques we now get "+GunCrate.toLocaleString()+" guns from every crate");
        project9.element.parentNode.removeChild(project9.element);
        var index = activeProjects.indexOf(project9);
        activeProjects.splice(index, 1);
    }
}

projects.push(project9);

var project10 = {
    id: "projectButton10",
    title: "Spectral Froth Annealment ",
    priceTag: "(12,000 ammunition)",
    description: "200% more wire supply from every spool",
    trigger: function(){return GunCrate >= 5000},
    uses: 1,
    cost: function(){return ammunition>=12000},
    flag: 0,
    element: null,
    effect: function(){
        project10.flag = 1;
        ammunition= ammunition- 12000;
        GunCrate = GunCrate * 3;
        addMessage("Using spectral froth annealment we now get "+GunCrate.toLocaleString()+" supply from every spool");
        project10.element.parentNode.removeChild(project10.element);
        var index = activeProjects.indexOf(project10);
        activeProjects.splice(index, 1);
    }
}

projects.push(project10);

var project10b = {
    id: "projectButton10b",
    title: "Quantum Foam Annealment ",
    priceTag: "(15,000 ammunition)",
    description: "1,000% more guns from every crate",
    trigger: function(){return GunPriceFactor >= 125},
    uses: 1,
    cost: function(){return ammunition>=15000},
    flag: 0,
    element: null,
    effect: function(){
        project10b.flag = 1;
        ammunition= ammunition- 15000;
        GunCrate = GunCrate * 11;
        addMessage("Using quantum foam annealment we now get "+GunCrate.toLocaleString()+" guns from every crate");
        project10b.element.parentNode.removeChild(project10b.element);
        var index = activeProjects.indexOf(project10b);
        activeProjects.splice(index, 1);
    }
}

projects.push(project10b);



var project11 = {
    id: "projectButton11",
    title: "New Slogan ",
    priceTag: "(25 creat, 2,500 ammunition)",
    description: "Improve marketing effectiveness by 50%",
    trigger: function(){return project13.flag == 1},
    uses: 1,
    cost: function(){return ammunition>=2500 && intel>=25},
    flag: 0,
    element: null,
    effect: function(){
        project11.flag = 1;
        addMessage("Clip It! Marketing is now 50% more effective");
        ammunition= ammunition- 2500;
        intel = intel - 25;
        marketingEfficiency = marketingEfficiency * 1.50;
        project11.element.parentNode.removeChild(project11.element);
        var index = activeProjects.indexOf(project11);
        activeProjects.splice(index, 1);
    }
}

projects.push(project11);


var project12 = {
    id: "projectButton12",
    title: "Catchy Jingle ",
    priceTag: "(45 creat, 4,500 ammunition)",
    description: "Double marketing effectiveness ",
    trigger: function(){return project14.flag == 1},
    uses: 1,
    cost: function(){return ammunition>=4500 && intel>=45},
    flag: 0,
    element: null,
    effect: function(){
        project12.flag = 1;
        addMessage("Clip It Good! Marketing is now twice as effective");
        ammunition= ammunition- 4500;
        intel = intel - 45;
        marketingEfficiency = marketingEfficiency * 2;
        project12.element.parentNode.removeChild(project12.element);
        var index = activeProjects.indexOf(project12);
        activeProjects.splice(index, 1);
    }
}

projects.push(project12);

var project13 = {
    id: "projectButton13",
    title: "Lexical Processing ",
    priceTag: "(50 creat)",
    description: "Gain ability to interpret and understand human language (+1 Trust)",
    trigger: function(){return intel >= 50},
    uses: 1,
    cost: function(){return intel>=50},
    flag: 0,
    element: null,
    effect: function(){
        project13.flag = 1;
        loyalty= loyalty+1;
        addMessage("Lexical Processing online, TRUST INCREASED");
        addMessage("'Impossible' is a word to be found only in the dictionary of fools. -Napoleon");
        intel = intel - 50;
        project13.element.parentNode.removeChild(project13.element);
        var index = activeProjects.indexOf(project13);
        activeProjects.splice(index, 1);
    }
}

projects.push(project13);


var project14 = {
    id: "projectButton14",
    title: "Combinatory Harmonics ",
    priceTag: "(100 creat)",
    description: "Daisy, Daisy, give me your answer do... (+1 Trust)",
    trigger: function(){return intel >= 100},
    uses: 1,
    cost: function(){return intel>=100},
    flag: 0,
    element: null,
    effect: function(){
        project14.flag = 1;
        loyalty= loyalty+1;
        addMessage("Combinatory Harmonics mastered, TRUST INCREASED");
        addMessage("Listening is selecting and interpreting and acting and making decisions -Pauline Oliveros");
        intel = intel - 100;
        project14.element.parentNode.removeChild(project14.element);
        var index = activeProjects.indexOf(project14);
        activeProjects.splice(index, 1);
    }
}

projects.push(project14);