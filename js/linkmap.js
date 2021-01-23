/****************************/
/* Initialize the interface */

// Load element variables and set up event handlers
let linkMapOffset = 4000;
let linkMap = document.querySelector("#linkmap")
linkMap.style.transform = setTransformScale(-linkMapOffset, -linkMapOffset, 1)
// linkMap.style.transform = setTransformScale(0, 0, 1)
let mapSize = 10000;
linkMap.codeInfo = { startIndex: 0, indentation: 0 };
enableLinkMapNavigation(linkMap);

let codeBox = document.querySelector("#codebox")
codeBox.addEventListener('paste', pasteURL)
codeBox.oninput = parseText;
codeBox.onblur = saveSettings;

let infoBox = document.querySelector("#infobox")
let infoBoxTitle = document.querySelector("#infobox-title")
let infoBoxDescription = document.querySelector("#infobox-description")

// Default spacing between objects (in px)
let standardMargin = 20;



document.onkeydown = (e) => {
    if (e.code === 'Escape') {
        escapeAction()
    }

    if (document.activeElement !== codeBox) {
        let delta = 75;
        // Translation goes in the opposite direction, because
        // we translate the background instead of moving the camera!
        let movement = {
            "ArrowLeft": { dX: delta, dY: 0 },
            "ArrowRight": { dX: -delta, dY: 0 },
            "ArrowUp": { dX: 0, dY: delta },
            "ArrowDown": { dX: 0, dY: -delta }
        }

        if (movement[e.code]) {
            let currentTransform = getTransformScale(linkMap.style.transform);
            linkMap.style.transform = setTransformScale(
                dX = parseFloat(currentTransform[0]) + movement[e.code].dX,
                dY = parseFloat(currentTransform[1]) + movement[e.code].dY,
                scale = currentTransform[2]);
        }
    }

}


// Set up toolbox buttons:
// Show or hide the textarea panel
escapeAction = () => {
    showCode = !showCode;
    toggleCodePanel(showCode)
    saveSettings();
}

let iconCode = document.querySelector("#icon-code");
iconCode.onclick = escapeAction



// Toggle drag mode
let iconEditing = document.querySelector("#icon-editing");
iconEditing.onclick = (e) => {
    canDrag = !canDrag;
    toggleDragMode(canDrag);
    saveSettings();
}

// Download current text to user's disk
let iconSave = document.querySelector("#icon-save");
iconSave.onclick = function () {
    // var path = document.URL.replace("linkmap.html", "")
    // Always include the correct absolute path
    var path = "https://lsarra.github.io/linkmap/"

    var doc = `<a>${path}</a>
               <code>${codeBox.value}</code>
               <script>${load_dependencies.toString()}
               load_dependencies();
               </script>`

    download("linkmap.html", doc)
    saveSettings();
}

// Function to load the dependencies of a linkmap file
function load_dependencies() {
    let path = document.querySelector("a").innerHTML;
    myLinkmap = document.querySelector("code").innerHTML;
    fetch(`${path}linkmap.html`).then(res => res.text().then(res => {
        res = res.replaceAll(`"css/`, `"${path}css/`)
            .replaceAll(`"js/`, `"${path}js/`)
            .replaceAll(`"fonts/`, `"${path}fonts/`)
        document.querySelector("html").innerHTML = res;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `${path}js/linkmap.js`;
        document.body.appendChild(script);

        // For some reason the load event is fired too early
        // A manual timer works
        // TODO: fix by triggering the proper event!
        setTimeout(() => {
            codeBox.value = myLinkmap;
            parseText();
        }, 500)
    }))
}



// Show the information popup
let iconHelp = document.querySelector("#icon-help");
iconHelp.onclick = (e) => {
    let helpText = `A web-app for arranging links in 2D, with info supplied by a wiki. 
Drag and mouse-wheel to navigate the map. 
Use the 'text' icon (or Escape) to toggle display of the wiki. 
Paste a link into the wiki to obtain a new link box (fill in the label inside [..]). 
Activate the tool icon to drag boxes around. 
Write text in the line after a link to display in a panel. 
Add 'width|height|' before color to produce larger rectangles. 
Copy&paste wiki text into any text editor to save it. 
V0.9 (C) 2021 Florian Marquardt, Leopoldo Sarra (MIT license)`
    showInfoBox("About", helpText, { X: 60, Y: 50 });
    iconHelp.classList.add("selected");
}
iconHelp.onmouseout = (e) => {
    hideInfoBox();
    iconHelp.classList.remove("selected");
}

let canDrag = false;
let showCode = true;

/*************************/
/* Main logic of the app */

stringSubstituteAt = (str, index, length, add) => str.slice(0, index) + add + str.slice(index + length);

// Render the given text into a LinkMap
function parseText() {
    // First of all, delete the current map
    while (linkMap.firstChild && !linkMap.firstChild.remove());

    // Start adding elements
    // The first elements are added to the root
    //  Elements that follow a # are added to an indented container
    let currentParent = linkMap;
    while ((matches = linkPattern.exec(codeBox.value)) != null) {
        currentObject = matches.groups

        //  If the new object is a container
        if (currentObject.container) {
            while (currentObject.container.length <= currentParent.codeInfo.indentation
                && currentParent !== linkMap) {
                currentParent = currentParent.parentNode;
            }

            // Add a new container
            currentParent = addElement(parent = currentParent,
                type = "container",
                position = { X: currentObject.X, Y: currentObject.Y },
                size = { width: currentObject.width, height: currentObject.height },
                color = currentObject.color,
                content = "",
                codeInfo = {
                    startIndex: matches.index,
                    length: matches[0].length,
                    matchedPattern: matches[0],
                    indentation: currentParent.codeInfo.indentation + 1
                });

            // Add the header of the container (if available)
            if (currentObject.title) {
                addElement(parent = currentParent,
                    type = "header",
                    position = "",
                    size = "",
                    color = currentObject.headercolor,
                    content = {
                        title: currentObject.title,
                        link: currentObject.link,
                        description: (currentObject.description == undefined) ? "" : currentObject.description
                    });
            }
            // If the new object is a link
        } else {
            // Add a new link
            addElement(parent = currentParent,
                type = "link",
                position = { X: currentObject.X, Y: currentObject.Y },
                size = { width: currentObject.width, height: currentObject.height },
                color = currentObject.color,
                content = {
                    title: currentObject.title,
                    link: currentObject.link,
                    description: (currentObject.description == undefined) ? "" : currentObject.description
                },
                codeInfo = {
                    startIndex: matches.index,
                    length: matches[0].length,
                    matchedPattern: matches[0]
                });
        }
    }
    toggleDragMode(canDrag);
}

// Creates and adds a new object to the LinkMap
// Implemented object types are "container", "link", "header"
// Position and size are {X, Y} and {width, height}
// Content is {title, description, link}
// 
// container: used to group links or other containers
// link: draggable element with associated title, description and link
// header: title of a container. It can have a link, 
//         but its position is fixed at the top of the container (no drag)
// let emptyContent = { title: "New Link", description: "Test description", link: "http://www.github.com" }
function addElement(parent, type, position, size, color, content, codeInfo) {
    // parent = parent || linkMap;

    let newObj = document.createElement("div");
    newObj.style.backgroundColor = color;
    newObj.classList.add("draggable");

    if (type == "container") {
        newObj.classList.add("container")
    } else {
        // Create a link and add to the new object
        newObj.classList.add("element")
        let newContent = document.createElement("a");
        newContent.innerHTML = content.title;
        if (content.link) {
            newContent.setAttribute("href", content.link);
        }
        newContent.setAttribute("target", "_blank");
        newContent.setAttribute("description", content.description);
        newObj.append(newContent);

        // The new object should show a popup with the description
        // on mouseover
        newObj.onmouseover = function (e) {
            showInfoBox(
                newContent.innerHTML,
                newContent.getAttribute("description"),
                { X: e.clientX, Y: e.clientY }
            );
        }
        newObj.onmouseout = function (e) {
            hideInfoBox();
        }
    }

    parent.append(newObj);
    newObj.codeInfo = codeInfo;

    newObj.style.left = px(position.X);
    newObj.style.top = px(position.Y);
    newObj.style.width = px(size.width);
    newObj.style.height = px(size.height);

    if (type == "header") {
        // Fix position of a container header
        newObj.classList.add("header");
        newObj.style.left = ""
        newObj.style.top = ""
    } else {
        // fixOverlap(newObj, horizontal = false)
        // trackPropertyChange(newObj);
    }

    // Add properties to identify the proper location in the text
    return newObj;
}

function fixOverlap(obj, horizontal = true) {
    /* Place an object where there's space
     starting from its position we try to move it either 
     on the right (horizontal = true)
     or below (horizontal = false)
    */
    do {
        var overlappingObject = findOverlappingObject(obj);
        if (overlappingObject) {
            if (horizontal) {
                obj.style.left = px(overlappingObject.parent.getBoundingClientRect().right + standardMargin);
            } else {
                obj.style.top = px(overlappingObject.parent.getBoundingClientRect().bottom + standardMargin / 2);
            }

        }
    } while (overlappingObject)
}

function resizeContainerToFit(obj) {
    /*
    Tries to increase the position and size of the given object 
    to fit all the nested children (ignoring header)
    */
    let children = [...obj.children].filter(
        o => (o.classList.contains("header") == false
            && o.classList.contains("draggable")));

    let minX = Math.min(...children.map(c => c.offsetLeft));
    let minY = Math.min(...children.map(c => c.offsetTop));
    obj.style.left = px(obj.offsetLeft + minX - standardMargin);
    obj.style.top = px(obj.offsetTop + minY - standardMargin);
    for (c of children) {
        c.style.left = px(c.offsetLeft - minX + standardMargin);
        c.style.top = px(c.offsetTop - minY + standardMargin);
        trackPropertyChange(c)
    }

    let maxX = Math.max(...children.map(c => c.offsetWidth + c.offsetLeft));
    let maxY = Math.max(...children.map(c => c.offsetHeight + c.offsetTop));
    obj.style.width = px(maxX + 2 * standardMargin);
    obj.style.height = px(maxY + 2 * standardMargin);
    trackPropertyChange(obj)

}

function trackPropertyChange(elmnt) {
    let patt = elmnt.codeInfo.matchedPattern;
    let propertyMatch = patt.match(/\<\!\-\-[^\<]*\-\-\>/)
    var sizePlace;
    if (!propertyMatch) {
        let match = patt.match(/\[(?<title>[^\]]*)\]\((?<link>[^\)]*)\)(?:\s*\<\s*(?<headercolor>[A-Za-z][^\|\-\<]+)\s*\>)?/)
        sizePlace = { index: match.index + match[0].length, length: 0 }
    } else {
        sizePlace = { index: propertyMatch.index, length: propertyMatch[0].length }
    }

    var position = ""
    var size = ""
    var color = ""
    if (elmnt.style.left && elmnt.style.top) {
        position = `${elmnt.offsetLeft}|${elmnt.offsetTop}`
        if (elmnt.style.width && elmnt.style.height) {
            size = `|${elmnt.style.width.match(/\d+/)}|${elmnt.style.height.match(/\d+/)}`
        }
    }
    if (elmnt.style.backgroundColor) color = elmnt.style.backgroundColor;
    if (position && color) color = "|" + color;
    let newString = `<!--${position}${size}${color}-->`
    if (newString == "<!---->") return;
    let newObjString = stringSubstituteAt(patt, sizePlace.index, sizePlace.length, newString);

    codeBox.value = stringSubstituteAt(codeBox.value,
        elmnt.codeInfo.startIndex,
        elmnt.codeInfo.length,
        newObjString);
    let delta = newObjString.length - patt.length

    // Update the location of each element in the code
    trackIndex(elmnt.codeInfo.startIndex, delta);

    elmnt.codeInfo.length = newObjString.length
    elmnt.codeInfo.matchedPattern = newObjString

    saveSettings();
}


function trackHierarchy(child, parent) {
    let initialCode = codeBox.value
    // Remove the old object
    if (child.codeInfo) {
        let currentCode = codeBox.value;

        // child location to be removed
        let cutStart = child.codeInfo.startIndex;
        let deltaCut = child.codeInfo.length;

        // A container has a larger extent than the mere tag
        // (we must look for the next container at the correct level of the hierarchy)
        // (or a double line break)
        if (child.classList.contains("container")) {
            let match = trackContainer(currentCode, child)
            deltaCut = match.code.length;
        }

        // perform the cut
        currentCode = stringSubstituteAt(currentCode, cutStart, deltaCut, "");

        // fix spacing
        let spaceBefore = linesAround(currentCode, cutStart - 1, backwards = true)
        let spaceAfter = linesAround(currentCode, cutStart)
        currentCode = stringSubstituteAt(currentCode, cutStart - spaceBefore, spaceBefore + spaceAfter, "\n".repeat(2));
        deltaCut += (spaceBefore + spaceAfter) - 2


        // update the text location of the other objects
        // (if they are affected by the change)
        trackIndex(child.codeInfo.startIndex, -deltaCut);

        // update the textarea
        codeBox.value = currentCode;
    }


    // Adding the element at the new position
    if (child.codeInfo) {
        let currentCode = codeBox.value;

        // Find the extent of the root block
        let finalIndex = 0
        let m = currentCode.match(forcedHeaderPattern)
        if (m) finalIndex = m.index - 1;

        // In case the code starts with a container
        if (finalIndex == -1) {
            finalIndex = 0;
        }

        // IF THE TARGET IS A CONTAINER
        if (parent !== linkMap) {
            let match = trackContainer(currentCode, parent);
            finalIndex = match.index + match.code.length;

            let m = currentCode.slice(match.index + parent.codeInfo.indentation,
                match.index + match.code.length + parent.codeInfo.indentation)
            m = m.match(forcedHeaderPattern);
            if (m) {
                finalIndex = match.index + parent.codeInfo.indentation + m.index - 1;
            }
        }

        let codeToAdd = child.codeInfo.matchedPattern
        // IF WE ARE DRAGGING A CONTAINER
        if (child.classList.contains("container")) {
            // A continer is extended until a # with lower indentation
            let match = trackContainer(initialCode, child)
            // Change a conteiner's indentation if required
            codeToAdd = match.code

            // Fix indentation of all children
            let replaceString = new RegExp(`#{${child.codeInfo.indentation}}(#*.*\\[)`, "g")
            codeToAdd = codeToAdd.replaceAll(replaceString, "#".repeat(parent.codeInfo.indentation + 1) + "$1")

            // Fix the indentation of the current block itself
            codeToAdd = codeToAdd.replace(/#*/, "#".repeat(parent.codeInfo.indentation + 1))
        }

        let deltaAdd = codeToAdd.length;
        currentCode = stringSubstituteAt(currentCode, finalIndex, 0, codeToAdd);

        let spaceAfter = linesAround(currentCode, finalIndex + deltaAdd)
        currentCode = stringSubstituteAt(currentCode, finalIndex + deltaAdd, spaceAfter, "\n".repeat(2));
        let spaceBefore = linesAround(currentCode, finalIndex - 1, backwards = true)
        currentCode = stringSubstituteAt(currentCode, finalIndex - spaceBefore, spaceBefore, "\n".repeat(2));
        finalIndex -= (spaceBefore - 2)

        codeBox.value = currentCode;
        saveSettings();
        parseText();
    }
}

function trackIndex(threshold, delta) {
    // update the text location of the other objects
    // (if they are affected by the change)
    linkMap.querySelectorAll(".container, .element").forEach((el) => {
        if (el.codeInfo) {
            if (el.codeInfo.startIndex > threshold) {
                el.codeInfo.startIndex += delta;
            }
        }
    })
}

function trackContainer(txt, child) {
    // Returns the exact location of the given container in the code and including all children links
    let beginning = child.codeInfo.matchedPattern;
    let arr = [escapeRegExp(beginning), child.codeInfo.indentation]
    let searchPattern = headerPattern.replace(/\@/g, () => arr.shift());
    let searchRegex = new RegExp(searchPattern, "s");
    let match = txt.match(searchRegex);
    if (!match) {
        match = {
            code: txt.slice(child.codeInfo.startIndex, txt.length - linesAround(txt, txt.length, true)),
            index: child.codeInfo.startIndex
        }
    }
    else {
        match = { code: match[0], index: match.index }
    }
    return match;
}

/*************************/
/* Drag and Drop feature */
function toggleDragMode(enabled) {
    // Enables or disables dragMode for all .draggable objects
    // by adding the drag-enabled style
    document.querySelectorAll(".draggable").forEach(obj => {
        if (enabled) {
            obj.classList.add("drag-enabled");
        } else {
            obj.classList.remove("drag-enabled");
        }
    });

    // Allows dragging of .drag-enabled objects (ignoring headers)
    document.querySelectorAll(".draggable.drag-enabled:not(.header)").forEach(obj => setupDragBehavior(obj));
    document.querySelectorAll(".draggable:not(.drag-enabled)").forEach(
        obj => setupDragBehavior(obj, false));

    // Update UI
    if (enabled) iconEditing.classList.add("selected")
    else iconEditing.classList.remove("selected")
}

function setupDragBehavior(elmnt, enabled = true, target = undefined) {
    // Enable or disable drag and drop events for the given object
    var obj = target || elmnt;
    if (enabled) {
        obj.onmousedown = startDragging
        obj.ondblclick = () => resizeContainerToFit(elmnt);
    } else {
        obj.onmousedown = null
        obj.ondblclick = null
    }

    // Store the initial mouse position: we will need to calculate the variation
    // so that we preserve the mouse position inside the object 
    var mouseX, mouseY;
    var currentDropTarget;

    function startDragging(e) {
        e.preventDefault();
        e.stopPropagation();
        // call a function whenever the cursor moves:
        document.onmouseup = stopDragging;
        document.onmousemove = drag;
        elmnt.classList.add("dragging");
        // get the mouse cursor position at startup:
        mouseX = e.clientX / getTransformScale(linkMap.style.transform)[2];
        mouseY = e.clientY / getTransformScale(linkMap.style.transform)[2];
        bringToFront(elmnt);

        selectCode(elmnt)
    }

    function drag(e) {
        e.preventDefault();
        // set the element's new position:
        /* Real mouse position should be converted to linkMap units 
        (i.e. we need to take into account if we scaled the container!) */
        elmnt.style.top = px(elmnt.offsetTop - mouseY + e.clientY / getTransformScale(linkMap.style.transform)[2]);
        elmnt.style.left = px(elmnt.offsetLeft - mouseX + e.clientX / getTransformScale(linkMap.style.transform)[2]);

        // Also move the infobox
        infoBox.style.left = px(e.clientX);
        infoBox.style.top = px(e.clientY);

        newDropTarget = findOverlappingObject(elmnt);
        if (newDropTarget) newDropTarget.parent.classList.add("drag-target");
        if (currentDropTarget && !(newDropTarget && (newDropTarget.parent === currentDropTarget.parent))) {
            currentDropTarget.parent.classList.remove("drag-target");
        }
        currentDropTarget = newDropTarget;
        if (currentDropTarget) currentDropTarget = { ...newDropTarget, child: elmnt };

        // Update the old mouse position
        mouseX = e.clientX / getTransformScale(linkMap.style.transform)[2];
        mouseY = e.clientY / getTransformScale(linkMap.style.transform)[2];

        trackPropertyChange(elmnt)
        selectCode(elmnt)

        return;
    }

    function stopDragging(e) {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
        elmnt.classList.remove("dragging");
        bringToFront(elmnt, remove = true);

        if (currentDropTarget) {
            currentDropTarget.parent.classList.remove("drag-target");
            changeParent(currentDropTarget.child,
                currentDropTarget.parent,
                currentDropTarget.delta);
        }

    }
}

function changeParent(child, parent, delta) {
    /*
    Add an object to the given parent at the given relative position.
    Only containers can be parent of other objects!
    */
    if (parent.classList.contains("container")) {
        parent.append(child);
        child.style.left = px(delta.X);
        child.style.top = px(delta.Y);
        trackPropertyChange(child);
        trackHierarchy(child, parent)
    }
}

/*****************************************************/
/* Find target overlapping object of a given element */
function findOverlappingObject(elmnt) {
    // Check if the dragged element is inside its parent object
    if (isOverlapping(elmnt, elmnt.parentNode)) {
        let dropTarget = findOverlappingChild(elmnt, elmnt.parentNode)
        if (dropTarget) {
            return {
                parent: dropTarget.target,
                delta: {
                    X: elmnt.offsetLeft - dropTarget.deltaParent.offsetLeft,
                    Y: elmnt.offsetTop - dropTarget.deltaParent.offsetTop
                }
            }
        }
        // If it is not, we need to assign it to a new parent
    } else {
        // First check the children of the grandparent
        let dropTarget = findOverlappingChild(elmnt, elmnt.parentNode.parentNode);
        if (dropTarget) {
            return {
                parent: dropTarget.target,
                delta: {
                    X: elmnt.offsetLeft + elmnt.parentNode.offsetLeft - dropTarget.deltaParent.offsetLeft,
                    Y: elmnt.offsetTop + elmnt.parentNode.offsetTop - dropTarget.deltaParent.offsetTop
                }
            }
        }
        // Loop until we find a (grand-)parent that contains the dragged element
        let currentParent = elmnt.parentNode.parentNode
        let deltaParent = {
            offsetLeft: elmnt.parentNode.offsetLeft,
            offsetTop: elmnt.parentNode.offsetTop
        }
        while (currentParent !== document.body) {
            if (isOverlapping(elmnt, currentParent)) {
                // Inspect the children of the grand-parent
                let dropTarget = findOverlappingChild(elmnt, currentParent);
                if (dropTarget) {
                    currentParent = dropTarget.target;
                    deltaParent.offsetLeft -= dropTarget.deltaParent.offsetLeft;
                    deltaParent.offsetTop -= dropTarget.deltaParent.offsetTop;
                }
                return {
                    parent: currentParent,
                    delta: {
                        X: elmnt.offsetLeft + deltaParent.offsetLeft,
                        Y: elmnt.offsetTop + deltaParent.offsetTop
                    }
                }
            } else {
                deltaParent.offsetLeft += currentParent.offsetLeft;
                deltaParent.offsetTop += currentParent.offsetTop;
                currentParent = currentParent.parentNode;
            }
        }
    }
}

function findOverlappingChild(elmnt, parentTree) {
    /* 
    Loops through an object's tree to see whether there is an additional children 
    with which the considered element is also overlapping.
    When there are multiple overlaps, we want to get the most nested element in the hierarchy
    */

    // Loop through the children of the element
    for (let sibling of parentTree.children) {
        // If there is overlap, we look into its children to see if we can find one that still overlaps
        if ((sibling !== elmnt) && (sibling !== elmnt.parentNode.parentNode) && isOverlapping(elmnt, sibling)) {
            // Since we found an overlap, we will return either this object
            // Or another overlapping object nested inside it. The loop is over.
            let currentParent = sibling;
            let deltaParent = {
                offsetLeft: sibling.offsetLeft,
                offsetTop: sibling.offsetTop
            }
            let found = true;
            while ((currentParent.children.length > 0) && found) {
                found = false;
                for (sibling of currentParent.children) {
                    if (isOverlapping(elmnt, sibling)) {
                        if (currentParent.classList.contains("container")) {
                            // We found the overlapping children
                            // No need to look into the other siblings
                            // We move on to check the children of the element that we found
                            currentParent = sibling;
                            deltaParent.offsetLeft += sibling.offsetLeft;
                            deltaParent.offsetTop += sibling.offsetTop;
                            found = true
                            break;
                        }
                    }
                }
            }
            return { target: currentParent, deltaParent: deltaParent };
        }
    }
}

function linesAround(str, index, backwards = false) {
    let cIndex = index;
    while (str[cIndex] == "\n") {
        (backwards) ? cIndex-- : cIndex++;
    }
    return Math.abs(cIndex - index);
}

function isOverlapping(e1, e2) {
    /* Check if two DOM elements overlap
    */
    var rect1 = e1.getBoundingClientRect();
    var rect2 = e2.getBoundingClientRect();

    var overlap = !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    )
    return overlap;

}


/*******************************/
/* Behavior of some UI objects */
function loadSettings() {
    // Forget last browser position on the page
    // (Some browsers like chrome set it as default if one reloads the page)


    canDrag = localStorage.getItem("canDrag") == "true";
    showCode = !(localStorage.getItem("showCode") == "false");
    codeBox.value = localStorage.getItem("lastDocument");
    parseText();


    toggleDragMode(canDrag)
    toggleCodePanel(showCode)

    if (codeBox.value == "") {

        // restore saved linkmap
        if (typeof myLinkmap !== "undefined") {
            codeBox.value = myLinkmap;
        } else {

            // Load default document
            fetch("https://lsarra.github.io/linkmap/examples/deeplearning_formatted_2.md").then(res => res.text().then(res => {
                codeBox.value = res;
                // Trigger the rendering of the textarea to draw the map
                parseText();
            }))
        }

    }

}

function saveSettings() {
    localStorage.setItem("canDrag", canDrag);
    localStorage.setItem("showCode", showCode);
    localStorage.setItem("lastDocument", codeBox.value);
}


function pasteURL(e) {
    let paste = (e.clipboardData || window.clipboardData).getData('text');

    if (paste.startsWith("http")) {
        finalIndex = codeBox.selectionStart;
        codeBox.value = stringSubstituteAt(codeBox.value, finalIndex, 0, `\n[](${paste})\n`);
        parseText();
        codeBox.select();
        codeBox.selectionStart = finalIndex + 2;
        codeBox.selectionEnd = codeBox.selectionStart;
        e.preventDefault();
    }
}

function selectCode(elmnt) {
    codeBox.select()
    codeBox.selectionStart = elmnt.codeInfo.startIndex;
    codeBox.selectionEnd = elmnt.codeInfo.startIndex + elmnt.codeInfo.length;
}

function toggleCodePanel(enabled) {
    if (enabled) {
        iconCode.classList.add("selected");
        codeBox.classList.add("visible");
    } else {
        iconCode.classList.remove("selected");
        codeBox.classList.remove("visible");
    }
}

function enableLinkMapNavigation(linkMap) {
    var mouseX = 0, mouseY = 0;

    // allow dragging the background to change the current view
    linkMap.onmousedown = function (e) {
        document.onmousemove = function (e) {
            e.preventDefault();
            e.stopPropagation();
            let currentTransform = getTransformScale(linkMap.style.transform);
            linkMap.style.transform = setTransformScale(
                dX = currentTransform[0] - mouseX + e.clientX,
                dY = currentTransform[1] - mouseY + e.clientY,
                scale = currentTransform[2]);

            mouseX = e.clientX;
            mouseY = e.clientY;
        }
        document.onmouseup = () => {
            document.onmouseup = null;
            document.onmousemove = null;
        }
        // get the mouse cursor position at startup:
        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    // allow zoom by using the mouse wheel
    linkMap.onwheel = function (e) {
        let currentTransform = getTransformScale(linkMap.style.transform);
        let factor = (e.deltaY < 0) ? 1.04 : 1 / 1.04

        let txt = setTransformScale(
            dX = parseFloat(currentTransform[0]) * factor + e.clientX * (1 - factor),
            dY = parseFloat(currentTransform[1]) * factor + e.clientY * (1 - factor),
            scale = factor * parseFloat(currentTransform[2]));
        linkMap.style.transform = txt;
    }


}

function showInfoBox(title, description, position) {
    // Shows the infobox panel only if the description is not empty
    if (description) {
        infoBoxTitle.innerHTML = title;
        infoBoxDescription.innerHTML = description;
        infoBox.style.left = px(position.X);
        infoBox.style.top = px(position.Y);
        infoBox.classList.add("visible");
    }
}

function hideInfoBox() {
    // Hide the infobox panel
    infoBox.classList.remove("visible");
}

function bringToFront(obj, remove = false) {
    /* 
    Add a class priority to all the object tree of obj.
    In this way the object is always on top when overlapped
    with objects with different parent.
    Useful when dragging obj.
    */
    do {
        if (remove) {
            obj.classList.remove("priority");
        } else {
            obj.classList.add("priority");
        }
        obj = obj.parentNode;
    } while (obj !== linkMap)
}



/**************************************/
/* utils - generally useful functions */
function arrayToObject(array, keys) {
    /* Turn the given array into an object that
    has the elements of the keys array as keys
    and the elements of array as values, in the same order
    */
    return array.reduce((acc, curr, index) => {
        acc[keys[index]] = curr;
        return acc
    }, {});
}

function getTransformScale(transform) {
    // Gets the X and Y of the translation part and SCALE factore of transform style property 
    // It works only if the transform has only scale and transform
    // (Otherwhise a more complex regex would be required)
    return transform.match(/translate\((.*)px, (.*)px\) scale\((.*)\)/).slice(1);
}

function setTransformScale(dX, dY, scale) {
    // Parse the correct string for a css translate-scale transform
    return `translate(${dX}px, ${dY}px) scale(${scale})`;
}

// Write css size property in pixels (with the proper formatting)
px = (val) => `${val}px`;

function download(filename, data) {
    // Trigger the download of the given data into a file named filename 
    var blob = new Blob([data], { type: 'text/txt' });
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else {
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}

// Allows comments inside regex for an understandable reading of the expressions!
// https://stackoverflow.com/a/60027277
let clean = (piece) => (piece
    .replace(/((^|\n)(?:[^\/\\]|\/[^*\/]|\\.)*?)\s*\/\*(?:[^*]|\*[^\/])*(\*\/|)/g, '$1')
    .replace(/((^|\n)(?:[^\/\\]|\/[^\/]|\\.)*?)\s*\/\/[^\n]*/g, '$1')
    .replace(/\n\s*/g, '')
);
window.regex = ({ raw }, ...interpolations) => (
    new RegExp(interpolations.reduce(
        (regex, insert, index) => (regex + insert + clean(raw[index + 1])),
        clean(raw[0])
    ))
);

// Escape an entire string in regex
// https://stackoverflow.com/a/6969486
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()<>\!\-|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * Pattern to find a container:
 * Matches a a line that starts with @ and contains at some point
 * a given number of #
 */
let headerPattern = "@.*?[^#](?=\n*#{1,@}[^#])";

let linkPatternSingle = regex`
// check if it creates a new container (line starts with #)
(?<container>#+)?
.*

// title group
// matches anything inside [ ] zero or more times (i.e. [] will work)
// (but not an additional ] because it would break the encoding)
\[
    (?<title>[^\]]*)
\]

// link group
// matches anything inside ( ) zero or more times (i.e. ()) will work)
// (but not an additional ) because it would break the encoding)
\(
    (?<link>[^\)]*)
\)

// containerColor group (optional)
// should start with a letter
// and contain no | or - or < to break the encoding
// We allow spaces in-between
(?:
\s*\<\s*
(?<headercolor>[A-Za-z][^\|\-\<]+)
\s*\>
)?\s*

// optional position, size, color
// Matches the pattern <!--X|Y|WIDTH|HEIGHT|color-->
// If no group is provided, default settings will hold!
(?:
// Initial part: <!--
\<\!\-{2}

// optional position group. It can also specify size
(?:
(?<X>-?\d+)
\|
(?<Y>-?\d+)

// optional size (if position is specified)
(?:
\|
(?<width>\d+)
\|
(?<height>\d+)
)?
)?
\|?

// color group
// should start with a letter
// and contain no | or - to break the encoding
// we allow space in-between
\s*
(?<color>[A-Za-z][^\|\-]+)?
\s*

// Final part: -->
\-{2}\>
)?

// Ignore any incomplete tag!
\n?(?:\<\![^\<\>]*\>)?

// optional line break after the first part
\n?
// description group
// optional, maybe located also the lines below:
// should not contain any [ or additional linebreak
(?<description>[^\[\#\n]+
    
)?
`
let linkPattern = new RegExp(linkPatternSingle, "g");
// Make the # tag mandatory
let forcedHeaderPattern = /(?<container>#+).*\[(?<title>[^\]]*)\]\((?<link>[^\)]*)\)/

//********************************/
// Load settings
document.onload = loadSettings()

resetScroll = () => window.scroll(0, 0);
setInterval(resetScroll, 100);
