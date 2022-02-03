import $ from "jquery";

class ElementScrollTracker {
    constructor(containerSelector=null, onElementCameIntoView=() => {}, onElementLeftView=() => {}) {
        this.visible_elements = [];
        this.tracked_elements = [];
        this.already_checking = false;
        this.containerSelector = containerSelector;
        this.onElementCameIntoView = onElementCameIntoView;
        this.onElementLeftView = onElementLeftView;
        let scrollTracker = this;

        if (containerSelector === null) {
            window.addEventListener("scroll", function () {
                if (scrollTracker.already_checking) {
                    return;
                }

                scrollTracker.already_checking = true;
                scrollTracker.checkCurrentlyVisibleElements();
                scrollTracker.checkNewlyVisibleElements();
                scrollTracker.already_checking = false;
            });
        } else {
            $(this.containerSelector).on("scroll", function(_) {
                console.debug("[user_interaction_tracker][scroll_tracker] - [container_selector=" + this.containerSelector + "]");

                if (scrollTracker.already_checking) {
                    console.debug("[user_interaction_tracker][scroll_tracker] - scrolltracker already checking, ignoring event");
                    return;
                }

                scrollTracker.already_checking = true;
                scrollTracker.checkCurrentlyVisibleElements();
                scrollTracker.checkNewlyVisibleElements();
                scrollTracker.already_checking = false;
            });
        }
    }

    handleElementCameIntoView(element, timestamp) {
        this.onElementCameIntoView(element, timestamp);
    }

    handleElementLeftView(element, timestampLeft, timestampEntered) {
        this.onElementLeftView(element, timestampLeft, timestampEntered);
    }

    checkCurrentlyVisibleElements() {
        let elementsLeft = [];
        let timestampLeft = Date.now();

        for (let i = 0; i < this.visible_elements.length; i++) {
            let data = this.visible_elements[i];
            let checkedElement = data["element"];
            let timestampVisible = data["timestamp"];

            if (this.containerSelector === null) {
                if (!isScrolledIntoView(checkedElement)) {
                    this.handleElementLeftView(checkedElement, timestampLeft, timestampVisible);
                    elementsLeft.push(data);
                }
            } else {
                if (!isScrolledIntoViewOfContainer(checkedElement, this.containerSelector)) {
                    this.handleElementLeftView(checkedElement, timestampLeft, timestampVisible);
                    elementsLeft.push(data);
                }
            }
        }

        for (let i = 0; i < elementsLeft.length; i++) {
            let index = this.visible_elements.indexOf(elementsLeft[i]);
            if (index > -1) {
                this.visible_elements.splice(index, 1);
            }
        }
    }

    checkNewlyVisibleElements() {
        let timestamp = Date.now();

        for (let i = 0; i < this.tracked_elements.length; i++) {
            let checked_element = this.tracked_elements[i];
            let found = false;

            for (let j=0; j < this.visible_elements.length; j++) {
                let data = this.visible_elements[j];

                if (data["element"] === checked_element) {
                    found = true;
                }
            }

            if (found) {
                continue;
            }

            if (this.containerSelector === null) {
                if (isScrolledIntoView(checked_element)) {
                    this.handleElementCameIntoView(checked_element, timestamp);
                    this.visible_elements.push({
                        "element": checked_element,
                        "timestamp": timestamp,
                    });
                }
            } else {
                if (isScrolledIntoViewOfContainer(checked_element, this.containerSelector)) {
                    this.handleElementCameIntoView(checked_element, timestamp);
                    this.visible_elements.push({
                        "element": checked_element,
                        "timestamp": timestamp,
                    });
                }
            }

        }
    }

    trackElements(selector) {
        let elements_to_add = $(selector);
        console.debug("[SCROLL_TRACKER][TRACK] - Tracking new elements: " + elements_to_add);
        this.tracked_elements = $.merge(this.tracked_elements, elements_to_add);
        this.checkNewlyVisibleElements();
    }

    stopTracking() {
        $(this.containerSelector).off("scroll");
        this.tracked_elements = [];
    }
}


function isScrolledIntoViewOfContainer(element, containerSelector) {
    let innerRect = element.getBoundingClientRect();
    let outerRect = $(containerSelector)[0].getBoundingClientRect();
    let elementTop = innerRect.top;
    let elementBottom = innerRect.bottom;
    let containerTop = outerRect.top;
    let containerBottom = outerRect.bottom;
    let elementHeight = elementTop - elementBottom;
    return (elementTop - elementHeight / 2) >= containerTop && elementBottom <= containerBottom;
}


function isScrolledIntoView(el) {
    let rect = el.getBoundingClientRect();
    let elemTop = rect.top;
    let elemBottom = rect.bottom;
    let elemHeight = elemTop - elemBottom;

    // Only completely visible elements return true:
    // return (elemTop >= 0) && (elemBottom <= window.innerHeight);
    // Partially visible elements return true:
    return (elemTop - elemHeight / 2) < window.innerHeight && elemBottom >= 0;
}

export default ElementScrollTracker;