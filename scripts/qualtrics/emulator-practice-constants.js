function getStoryIds() {
    return ["stolen-shark",];
}

function isPractice() {
    return true;
}

let emulatorCriteriaMet = false;
let userSeenValidation = false;


function setupValidationButton(qualtricsComponent) {
    console.debug("practice.setupValidationButton()");

    jQuery("#QID2039").hide();
    jQuery("#QID2040").hide();

    createCustomValidationButton();

    jQuery("#TempNextButton").one("click", function (event) {
        removeCustomValidationButton();
        sendEmulatorMessage({ "event_type": "user_continued_survey", });
    });

    jQuery("#TempNextButton").prop("disabled", true);
}

function onEmulatorCriteriaMet(qualtricsComponent) {
    emulatorCriteriaMet = true;

    if (userSeenValidation) {
        removeCustomValidationButton();
    } else {
        jQuery("#TempNextButton").prop("disabled", false);
    }
}

function onAllEmulatorCriteriaMet(qualtricsComponent) {
    console.debug("Got all emulator criteria met message");
    emulatorCriteriaMet = true;
    removeCustomValidationButton();
}

function onUserDismissedValidation(qualtricsComponent) {
    userSeenValidation = true;

    if (emulatorCriteriaMet) {
        removeCustomValidationButton();
    }
}