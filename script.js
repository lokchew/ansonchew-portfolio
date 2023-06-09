// Functions to call when the page finishes loading
document.addEventListener('DOMContentLoaded', () => {
    getProjectJson();
    createScrollEffect();
    createFooter();
});

// Variables for jumping to different sections
const allNavLinks = document.querySelectorAll(".navbar-link");
const allSections = document.querySelectorAll(".main-section");

const homeSection = document.getElementById("home-section");
const articleSection = document.querySelector("article");
const contactSection = document.getElementById("contact-section");
const allSectionGroup = [homeSection, articleSection, contactSection];
let currentSectionGroup = 0;
let changable = true;

async function contentUpdate() {
    await displayProject();
    await sectionOffsetCheck();
}

var allProjects = [];
async function getProjectJson() {
    const response = await fetch('file/projects.json');
    const lst = await response.json(); 

    const keysValue = Object.keys(lst);
    keysValue.forEach(key => {
        allProjects.push(lst[key]);
    });
    // console.log(allProjects);

    setUpPageNum();
    contentUpdate();
}

let pageNum = 1;
const showcasetNum = 2;
const projectsContainer = document.getElementById("projects-showcase");
function displayProject() {    
    // How many projects to show in each page
    projectsContainer.innerHTML = "";
    for (var i = 0; i < showcasetNum; i++) {
        var index = (pageNum - 1) * showcasetNum + i;
        if (index < allProjects.length) {
            let projectContainer = document.createElement("div");
            projectContainer.setAttribute("class", "project");
            projectContainer.innerHTML = `
            <div class="project-thumbnail-container"><div class="project-thumbnail" style="background-image: url('${allProjects[index].thumbnail}')"></div></div>
            <div class="project-details">
                <div>
                    <h3 class="project-title">${allProjects[index].title}</h3>
                    <p class="project-intro">${allProjects[index].intro}</p>
                    <div class="project-btns">
                    </div>
                </div>
            </div>
            `
            var projectBtns = projectContainer.querySelector(".project-btns");
            var research = allProjects[index].research;
            var product = allProjects[index].product;

            if (research != "") {
                projectBtns.innerHTML += `<a class="uppercase view-research-btn" href="${research}" target="_blank">View Research</a>`
            }
            if (product != "") {
                projectBtns.innerHTML += `<a class="uppercase view-product-btn" href="${product}" target="_blank">View Product</a>`
            }
            projectsContainer.appendChild(projectContainer);
        }
    }
}

function createFooter() {
    var date = new Date;
    var footer = document.createElement("footer");
    footer.innerHTML = `
    <div id="footer-connect">
        <div id="connect-platforms">
            <a style="background-image: url('image/footer/email.png');" href="mailto:ansonchew.study@gmail.com" target="_blank"></a>
            <a style="background-image: url('image/footer/github.png');" href="https://www.linkedin.com/in/anson-chew-6b5a08240" target="_blank"></a>
            <a style="background-image: url('image/footer/linkedin.png');" href="https://www.linkedin.com/in/anson-chew-6b5a08240" target="_blank"></a>
        </div>
        <p style="font-size: 12px;">© ${date.getFullYear()}, Anson Chew</p>
    </div>
    `
    contactSection.querySelector(".content-container").appendChild(footer);
}






// Sub functions
let sectionOffset;
function sectionOffsetCheck() {
    // Check each section's offset from the top of the website
    sectionOffset = [];
    for (var i = 0; i < allSections.length; i++) {
        sectionOffset.push(allSections[i].offsetTop);
        // console.log(i + ": " + allSections[i].offsetTop);
    }
}

// Check whether the section has reaches it top / bottom
function checkReachPosition(sectionGroup, top) {
    if (sectionGroup.scrollHeight > window.innerHeight) {
        // console.log(sectionGroup.scrollHeight);
        // console.log(sectionGroup.scrollTop);
        if (top) return sectionGroup.scrollTop == 0;
        else return Math.floor(sectionGroup.scrollTop) == Math.floor(sectionGroup.scrollHeight - window.innerHeight);
    } else {
        if (top) return window.pageYOffset == 0;
        else return Math.floor(window.pageYOffset) == Math.floor(sectionGroup.clientHeight - window.innerHeight);
    }
}

let highlightedSection = 0;
function highlightCurrentSection(curSectionGroup) {
    // Function for the nav bar current selection underliner
    // Check whether the scroll position arrived a new section. If true, change the id attribute to restyle the nav bar and current selection
    
    for (var i = 0; i < sectionOffset.length; i++) {
        // If the section is one of the section group
        if (allSectionGroup.includes(allSections[i])) {
            if (window.pageYOffset == 0 && allSections[i] == curSectionGroup && i != highlightedSection) {
                highlightedSection = i;
                allNavLinks.forEach(element => element.removeAttribute("id"));
                allNavLinks[highlightedSection].setAttribute("id", "current-section");
                return;
            }
            continue;
        } 

        // If the section is the child of one of the section group
        if (allSectionGroup[currentSectionGroup].contains(allSections[i])) {
            // As currently we are using inner scroll group instead of a global one, window.pageYOffset won't work in this case
            if (curSectionGroup.scrollTop >= sectionOffset[i] - (window.innerHeight / 4) && i != highlightedSection) {
                // Check if the section is the last one of its section group or not
                if (i + 1 != sectionOffset.length && !allSectionGroup.includes(allSections[i + 1])) {
                    if (curSectionGroup.scrollTop >= sectionOffset[i + 1] - (window.innerHeight / 4)) continue;
                } 
                allNavLinks[highlightedSection].removeAttribute("id");
                allNavLinks[i].setAttribute("id", "current-section");
                highlightedSection = i;

                if (highlightedSection == 2) {
                    document.querySelector("article > .content-container").style.background = "#252525";
                    document.querySelector("#portfolio-section > div > h2").style.color = "#ffffff";
                }
                else {
                    document.querySelector("article > .content-container").style.background = "#ffffff";
                    document.querySelector("#portfolio-section > div > h2").style.color = "#303030";
                }
                
                return;
            }
        }
        
        // console.log(currentSectionGroup);
        // console.log(allNavLinks[highlightedSection]);
    }
}

function displaySectionGroup(currentSection, nextSection) {
    changable = false;
    allSectionGroup.forEach((element, index) => {
        element.classList.remove("no-transition");
        if (element == allSectionGroup[currentSection] || element == allSectionGroup[nextSection]) {
            // console.log("Show", element);
            element.style.zIndex = 99 - index;
        }
        else {
            // console.log("Hide", element);
            element.style.zIndex = 0;
            element.style.transform = "translate3d(0, -100%, 0)";
        }
    });

    if (currentSection > nextSection) {
        // Back to previous section
        allSectionGroup[currentSection].style.overflow = "hidden";
        allSectionGroup[nextSection].style.transform = "translate3d(0, 0, 0)";
        allSectionGroup[nextSection].scrollTo(0, allSectionGroup[nextSection].scrollHeight);
    } else {
        // Proceed to next section
        allSectionGroup[currentSection].style.overflow = "hidden";
        allSectionGroup[currentSection].style.transform = "translate3d(0, -100%, 0)";

        allSectionGroup[nextSection].classList.add("no-transition");
        allSectionGroup[nextSection].style.transform = "translate3d(0, 0, 0)";
        allSectionGroup[nextSection].scrollTo(0, 0);
    }

    currentSectionGroup = nextSection;
    highlightCurrentSection(allSectionGroup[currentSectionGroup]);

    setTimeout(() => changable = true, 1000);
    setTimeout(() => allSectionGroup[nextSection].style.overflow = "scroll", 700);
}

function setPageNum() {
    allPageNum.forEach(page => {
        page.removeAttribute("id");
        if (page.innerHTML == pageNum) page.setAttribute("id", "current-page");
    });
}






// Button functions
function createScrollEffect() {
    allSectionGroup.forEach((element, index) => {
        element.addEventListener("wheel", event => {
            // At the top of the section group
            if (index - 1 >= 0 && currentSectionGroup == index && checkReachPosition(element, true) && event.deltaY < 0 && changable) {
                console.log("Scroll back to previous section");
                displaySectionGroup(index, index - 1);
            }

            if (index + 1 < allSectionGroup.length && currentSectionGroup == index && checkReachPosition(element, false) && event.deltaY > 0 && changable) {
                console.log("Scroll to next section");
                displaySectionGroup(index, index + 1);
            }
        });

        element.addEventListener("scroll", event => {
            highlightCurrentSection(element);
        })
    });
}

function sectionJump(section) {
    // Check every section offset is updated
    sectionOffsetCheck();
        
    var curSectionGroup = currentSectionGroup;
    var targetSection;
    allSectionGroup.forEach((element, index) => {
        if (element.contains(allSections[section])) targetSection = index;
    });

    if (currentSectionGroup != targetSection) displaySectionGroup(currentSectionGroup, targetSection);

    if (!allSectionGroup.includes(allSections[section])) {
        if (Array.from(allSections).includes(allSectionGroup[curSectionGroup])) {
            allSections[section].closest(".back-slide").scrollTo({
                top: sectionOffset[section],
                behavior: "instant",
            });
        } else {
            allSections[section].closest(".back-slide").scrollTo({
                top: sectionOffset[section],
                behavior: "smooth",
            });
        }
    } 
}

const allPageNum = document.querySelectorAll(".page-num");
function setUpPageNum() {
    allPageNum.forEach(element => {
        element.addEventListener("click", ()=> {
            pageNum = Number(element.innerHTML);
            setPageNum();
            contentUpdate();
            sectionJump(2);
        });
    });
}

function changePageNum(direction) {
    if ((pageNum == 1 && direction == -1) || (pageNum == Math.round(allProjects.length / 2) && direction == 1)) return;
    pageNum += direction;
    setPageNum();
    contentUpdate();
    sectionJump(2);
}