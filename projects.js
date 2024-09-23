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