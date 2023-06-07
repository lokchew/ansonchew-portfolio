// Functions to call when the page finishes loading
document.addEventListener('DOMContentLoaded', () => {
    getProjectJson();
    createFooter();
});

// Variables for jumping to different sections
const allNavLinks = document.querySelectorAll(".navbar-link");
const allSections = document.querySelectorAll(".main-section");
let sectionOffset = [0, 0, 0, 0];
let currentSection = 0;
window.onscroll = () => {
    // console.log(window.pageYOffset);

    const totalSections = sectionOffset.length;
    for (var i = 0; i < totalSections; i++) {
        // Check whether the scroll position arrived a new section
        if (window.pageYOffset >= sectionOffset[i] - (window.innerHeight / 4) && i != currentSection) {
            // Function for the nav bar current selection underliner
            // Change the id attribute to restyle the nav bar and current selection
            allNavLinks[currentSection].removeAttribute("id");
            allNavLinks[i].setAttribute("id", "current-section");
            currentSection = i;
        }
    }
};

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
    <div id="footer-contact">
        <div>
            <p class="contact-header">Contact email:</p>
            <p>ansonchew.study@gmail.com</p>
        </div>
        <div>
            <p class="contact-header">Mobile:</p>
            <p>Avaliable via email</p>
        </div>
    </div>
    <span></span>
    <div id="footer-connect">
        <p>GET IN TOUCH</p>
        <div id="connect-platforms">
            <a style="background-image: url('image/footer/email.png');" href="https://www.linkedin.com/in/anson-chew-6b5a08240" target="_blank"></a>
            <a style="background-image: url('image/footer/github.png');" href="https://www.linkedin.com/in/anson-chew-6b5a08240" target="_blank"></a>
            <a style="background-image: url('image/footer/linkedin.png');" href="https://www.linkedin.com/in/anson-chew-6b5a08240" target="_blank"></a>
        </div>
        <p style="font-size: 12px;">© ${date.getFullYear()}, Anson Chew</p>
    </div>
    `
    document.querySelector("body").appendChild(footer);
}






// Sub functions
function sectionOffsetCheck() {
    // Check each sections' offset from the top of the website
    for (var i = 0; i < 4; i++) {
        sectionOffset[i] = allSections[i].offsetTop;
        // console.log(i + ": " + allSections[i].offsetTop);
    }
}

function setPageNum() {
    allPageNum.forEach(page => {
        page.removeAttribute("id");
        if (page.innerHTML == pageNum) page.setAttribute("id", "current-page");
    });
}






// Button functions
function sectionJump(section) {
    // Check every section offset is updated
    sectionOffsetCheck();

    // Scroll to the clicked section afterwards
    window.scrollTo({
        top: sectionOffset[section],
        behavior: "smooth",
    });
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