function getStoryIds() {
    return [
        "${e://Field/first_story}",
        "${e://Field/second_story}",
        "${e://Field/third_story}",
        "${e://Field/fourth_story}",
    ];
}

let emulatorCriteriaMet = false;
let userSeenValidation = false;

function isPractice() {
    return false;
}

function setupValidationButton(qualtricsComponent) {
    console.debug("main.setupValidationButton()");

    jQuery("#QID2042").hide();
    jQuery("#QID2043").hide();

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