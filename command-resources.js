let tempOps = 0;
let opFadeTimer = 0;
let opFadeDelay = 1000;
var projectListTopElement = document.getElementById('projectListTop');
let IntelON = false;
let intelCounter = 0;

// enable command resources (top part (without the projects)) after 2000 total soldiers trained.
//compFlag = 1;    
// projectsFlag = 1;

function levelControlSystems(){
    if(loyalty >= 1)
        {   
            controlSystemsLevel++;
            loyalty--;
        }
    updateDisplay();
}

function levelCommandPosts(){
    if(loyalty >= 1)
    {   
        commandPostsLevel++;
        loyalty--;
    }
    updateDisplay();
}





function calculateOperations(){
    
    if (tempOps > 0){
        opFadeTimer++;
        }
    
    if (opFadeTimer > opFadeDelay && tempOps > 0) {
        opFade = opFade + Math.pow(3,3.5)/1000;
        }
        
    if (tempOps > 0) {
        tempOps = Math.round(tempOps - opFade);
        } else {
        tempOps = 0;    
        }
    
    if (tempOps + ammunition < commandPostsLevel*1000){
        ammunition = ammunition + tempOps;
        tempOps = 0;
        }
    
    operations = Math.floor(ammunition + Math.floor(tempOps));
    
    if (operations<commandPostsLevel*1000){
        var opCycle = controlSystemsLevel/10;
        var opBuf = (commandPostsLevel*1000)-operations;
        
        if (opCycle > opBuf) {
            opCycle = opBuf;
        }
            
        ammunition = ammunition + opCycle;
        
        }
        
    if (ammunition > commandPostsLevel*1000){
        ammunition = commandPostsLevel*1000;
        }

    updateDisplay();

}

function calculateCreativity(){
    
    if(ammunition >= commandPostsLevel*1000 && ammunition > 1 && IntelON == true){
    intel++;
    
    var intelThreshold = 400;
    
    // var s = prestigeS/10;
    // var ss = creativitySpeed+(creativitySpeed*s);
    
    var intelCheck = intelThreshold;
    
    if (intelCounter >= intelCheck){
        
        if (intelCheck >= 1){
            intel = intel+1;
            }
        
        if (intelCheck < 1){
            

            intel = (intel + intelThreshold);
            
        }
        
        intelCounter = 0;
    }
}
    
}


function manageProjects() {
    for (let i = 0; i < projects.length; i++) {
        if (projects[i].trigger() && projects[i].uses > 0) {
            displayProjects(projects[i]);
            projects[i].uses--;
            activeProjects.push(projects[i]);
        }
    }

    for (let i = 0; i < activeProjects.length; i++) {
        activeProjects[i].element.disabled = !activeProjects[i].cost();
    }
}


function displayProjects(project) {
    project.element = document.createElement("button");
    project.element.id = project.id;
    project.element.classList.add("projectButton");
    project.element.onclick = function() { project.effect(); };

    const fragment = document.createDocumentFragment();

    const span = document.createElement("span");
    span.style.fontWeight = "bold";
    span.textContent = project.title;

    const cost = document.createTextNode(project.priceTag);
    const description = document.createElement("div");
    description.textContent = project.description;

    fragment.appendChild(span);
    fragment.appendChild(cost);
    fragment.appendChild(description);

    project.element.appendChild(fragment);
    projectListTopElement.insertBefore(project.element, projectListTopElement.firstChild);

    blink(project.element);
}
function blink(element) {
    element.classList.add('blinking');
    setTimeout(() => {
        element.classList.remove('blinking');
    }, 2000);
}
// manageProjects();
setInterval(manageProjects, 5000);
setInterval(calculateOperations, 10);
setInterval(calculateCreativity, 10);