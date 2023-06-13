// Functions to call when the page is loading
window.addEventListener("load", ()=> {
    setTimeout(() => endLoadingAnimation(), 500);
})

// Functions to call when the page finishes loading
let scrollEaseFunc;
document.addEventListener('DOMContentLoaded', async () => {
    navbarResponsive();

    await getProjectJson();
    await createScrollEffect();
    await createFooter();
    scrollEaseFunc = scrollEaseEffect(allSectionGroup[1]);
    scrollEaseFunc.easeAnimation();
});

window.addEventListener('resize', ()=> {contentUpdate()}, true);

// Variables for jumping to different sections
const allNavLinks = document.querySelectorAll(".navbar-link");
const allSections = document.querySelectorAll(".main-section");

const homeSection = document.getElementById("home-section");
const articleSection = document.querySelector("article");
const contactSection = document.getElementById("contact-section");
const allSectionGroup = [homeSection, articleSection, contactSection];
let currentSectionGroup = 0;
let changable = false;

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
            <a alt="Email icon" aria-label="Link to email" style="background-image: url('image/footer/email.png');" href="mailto:ansonchew.study@gmail.com" target="_blank"></a>
            <a alt="GitHub icon" aria-label="Link to GitHub" style="background-image: url('image/footer/github.png');" href="https://www.linkedin.com/in/anson-chew-6b5a08240" target="_blank"></a>
            <a alt="Linkedin icon" aria-label="Link to Linkedin" style="background-image: url('image/footer/linkedin.png');" href="https://www.linkedin.com/in/anson-chew-6b5a08240" target="_blank"></a>
        </div>
        <p style="font-size: 12px;">© ${date.getFullYear()}, Anson Chew</p>
    </div>
    `
    contactSection.querySelector(".content-container").appendChild(footer);
}






// Sub functions
const loader = document.getElementById("loader");
let loadingAniamtionEnd = false;
const loadingAnimation = loader.querySelector("svg path");
loadingAnimation.addEventListener("animationend", () => loadingAniamtionEnd = true);
function endLoadingAnimation() {
    if (loadingAniamtionEnd) {
        loader.classList.add("element-hidden");
        setTimeout(() => loader.parentNode.removeChild(loader), 700);

        landingAnimation();
    } else {
        // console.log("Wait for loading animation end");
        setTimeout(() => endLoadingAnimation(), 300);
    }
}

function animateFadeIn(section) {
    let animation = section.querySelectorAll(".animate");
    animation = Array.from(animation);
    
    if (section.classList.contains("animate")) animation.push(section);

    setTimeout(() => {
        animation.forEach(element => {
            element.classList.remove("animate");
            element.classList.add("fade-in");
        });
    }, 300);
}

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

        if (top)  {
            var easeScrollEnd = sectionGroup.firstElementChild.style.transform
            if (easeScrollEnd == "translateY(0px)" || easeScrollEnd == "") return sectionGroup.scrollTop == 0;
            else return false;
        } else {
            return  sectionGroup.scrollHeight - window.innerHeight - sectionGroup.scrollTop < 1;
        }
    } else {
        if (top) return window.scrollY == 0;
        else return sectionGroup.clientHeight - window.innerHeight - window.scrollY < 1;
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
                animateFadeIn(curSectionGroup);
                return;
            }
            continue;
        } 

        // If the section is the child of one of the section group
        if (allSectionGroup[currentSectionGroup].contains(allSections[i])) {
            // As currently we are using inner scroll group instead of a global one, window.pageYOffset won't work in this case
            if (Math.round(curSectionGroup.scrollTop) >= sectionOffset[i] - (window.innerHeight / 4) && i != highlightedSection) {
                // Check if the section is the last one of its section group or not
                if (i + 1 != sectionOffset.length && !allSectionGroup.includes(allSections[i + 1])) {
                    // If there is section after it and the scroll top is bigger than the offset of the next section, highlight the next section instead
                    if (Math.round(curSectionGroup.scrollTop) >= sectionOffset[i + 1] - (window.innerHeight / 4)) continue;
                } 
                allNavLinks[highlightedSection].removeAttribute("id");
                allNavLinks[i].setAttribute("id", "current-section");
                highlightedSection = i;

                articleSection.firstElementChild.classList.toggle("animation", highlightedSection == 2);
                animateFadeIn(allSections[i]);
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
    
    setTimeout(() => allSectionGroup[nextSection].style.overflow = "scroll", 500);
    setTimeout(() => changable = true, 1000);

    if (currentSection == 1) scrollEaseFunc.stopAnimation();
    if (nextSection == 1) scrollEaseFunc.startAnimation();
}

async function landingAnimation() {
    const myName = document.getElementById("my-name");
    const myRoles = document.getElementById("my-roles").querySelectorAll("span");
    await new Promise((resolve) => setTimeout(()=> {myName.classList.add("animation"); resolve();}, 500));
    await new Promise((resolve) => setTimeout(()=> {myRoles[0].style.transform = "scale(1)"; resolve();}, 1000));
    await new Promise((resolve) => setTimeout(()=> {myRoles[1].style.transform = "scale(1)"; resolve();}, 500));
    await new Promise((resolve) => setTimeout(()=> {generateNewQuote(); resolve();}, 500));
    setTimeout(()=> changable = true, 500);

}

function generateNewQuote() {
    const favQuotes = [`“Dedication sees dreams come true.” - Kobe Bryant`, `"The only way to be truly satisfied is to do what you believe is great work. And the only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle." – Steve Jobs`, `“If you do the work, you get rewarded. There are no shortcuts in life.” - Michael Jordan`, `"It's better to hang out with people better than you. Pick out associates whose behavior is better than yours and you'll drift in that direction." - Warren Buffett`, `"If you're walking down the right path and you're willing to keep walking, eventually you'll make progress." - Barack Obama`];
    const favQuote = document.getElementById("fav-quote");
    favQuote.innerHTML = favQuotes[Math.floor(Math.random() * favQuotes.length)];    
    favQuote.classList.add("animation");
}

function scrollEaseEffect(sectionGroup) {
    // Easing scrolle effect inspired by https://stackoverflow.com/questions/60526256/easing-effect-on-scroll
    const content = sectionGroup.firstElementChild;
    const easeSpeed = 0.1;
    let moveDistance = 0, curScroll = 0;
    let restart = false, animate = false;

    sectionGroup.addEventListener("scroll", () => {
        moveDistance = Math.round(sectionGroup.scrollTop);
        // console.log("Move distance: " + moveDistance);
    })

    function easeAnimation() {
        requestAnimationFrame(easeAnimation);
        
        if (restart) {
            curScroll = moveDistance;
            restart = false;
        } 

        if (animate) {
            if (moveDistance >= sectionGroup.scrollHeight - window.innerHeight) curScroll = moveDistance;
            else curScroll += easeSpeed * (moveDistance - curScroll);    

            // Reducing the translateY to 0 to create easing effect (as the scroll effect is applied to the element already)
            // It will now go further than the actual distance, but slowly reducing to get back to the proper position
            var yPos = moveDistance - curScroll;
            if (Math.abs(yPos) < 0.1) yPos = 0;
    
            content.style.transform = `translateY(${yPos}px)`
            // console.log("yPos: " + yPos);
        }
    }

    function startAnimation() {
        restart = true;
        animate = true;
    }

    function stopAnimation() {
        animate = false;
    }

    return {
        easeAnimation: easeAnimation,
        startAnimation: startAnimation,
        stopAnimation: stopAnimation
    };
}

function setPageNum() {
    allPageNum.forEach(page => {
        page.removeAttribute("id");
        if (page.innerHTML == pageNum) page.setAttribute("id", "current-page");
    });
}






// Button functions
// A function that adds responsiveness to the navbar
function navbarResponsive() {
    // Nav-bar animation
    // Create a variable to reference the toggle <button>
    var navbarToggle = navbar.querySelector("#navbar-toggle");

    // Create a variable to reference the nav menu container <div>
    var navbarMenu = document.querySelector("#navbar-menu");

    // Create a variable to reference the <ul> list of nav links
    var navbarLinksContainer = navbarMenu.querySelector(".navbar-links");

    // Add or remove the 'active' class on the toggle <button> when clicked
    navbarToggle.addEventListener("click", () => { navbarToggle.classList.toggle('active') });

    // Remove the 'active' class on the menu container <div> when clicked 
    // This will close the menu if the user clicks outside the nav link <ul>
    navbarMenu.addEventListener("click", () => { navbarToggle.classList.remove('active') });

    // Close the nav bar menu when users click any section tag
    for (var i = 0; i < allNavLinks.length; i++) {
        allNavLinks[i].addEventListener("click", () => { navbarToggle.classList.remove('active') });
    }

    // Stop clicks on the navbar links from toggling the menu (for when it's not mobile)
    navbarLinksContainer.addEventListener("click", (e) => e.stopPropagation());
}

function createScrollEffect() {
    allSectionGroup.forEach((element, index) => {
        element.addEventListener("wheel", event => {
            // At the top of the section group
            if (index - 1 >= 0 && currentSectionGroup == index && checkReachPosition(element, true) && event.deltaY < 0 && changable) {
                // console.log("Scroll back to previous section");
                displaySectionGroup(index, index - 1);
            }

            if (index + 1 < allSectionGroup.length && currentSectionGroup == index && checkReachPosition(element, false) && event.deltaY > 0 && changable) {
                // console.log("Scroll to next section");
                displaySectionGroup(index, index + 1);
            }
        }, {passive: true});

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
            allSections[section].closest(".slide").scrollTo({
                top: sectionOffset[section],
                behavior: "instant",
            });
        } else {
            allSections[section].closest(".slide").scrollTo({
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

const contactForm = document.getElementById("input-form-container")
contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    contactForm.reset();

    contactForm.firstElementChild.style.opacity = "0";
    var message = document.createElement("div");
    message.setAttribute("id", "message");
    message.style.opacity = "0";
    message.innerHTML = `
        <h3>Message Sent</h3>
        <p>Thank you for reaching out, I will be in touch soon</p>
    `
    contactForm.appendChild(message);

    await new Promise((resolve) => setTimeout(()=> {message.style.opacity = "1"; resolve();}, 500));
    await new Promise((resolve) => setTimeout(()=> {message.style.opacity = "0"; resolve();}, 2000));
    setTimeout(()=>{
        contactForm.firstElementChild.style.opacity = "1";
        contactForm.removeChild(message);
    }, 500)
})