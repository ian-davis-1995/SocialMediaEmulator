let qualtricsPageLoaded = false;
let emulatorLoaded = false;
let qualtricsComponent = null;
let storyIds = [];
let distractorTasks = [];


function createCustomValidationButton() {
    jQuery("div#Buttons").append('<input id="TempNextButton" class="NextButton Button" ' +
        'title="→" type="button" name="NextButton" value="→" data-runtime-disabled="runtime.Disabled" ' +
        'data-runtime-aria-label="runtime.ariaLabel" data-runtime-hide="runtime.Hide" page-id="P_1634165438992" aria-label="Next">');
    jQuery("#TempNextButton").css({
        "border": "none",
        "color": "#fff",
        "font-size": "14px",
        "padding": "8px 20px",
        "-webkit-border-radius": "4px",
        "-moz-border-radius": "4px",
        "-ms-border-radius": "4px",
        "-o-border-radius": "4px",
        "border-radius": "4px",
        "cursor": "pointer",
        "margin": "0",
        "text-align": "center",
        "text-decoration": "none",
        "-webkit-appearance": "none",
        "transition": "background .3s",
        "background-color": "#007ac0",
    });

    console.debug("hiding next button");
    jQuery("#NextButton").hide();
}

function removeCustomValidationButton() {
    jQuery("#TempNextButton").remove();
    console.debug("Showing Next Button");
    jQuery("#NextButton").show();
}

console.debug("Qualtrics survey registering message listener");

window.onmessage = function (event) {
    console.debug("Qualtrics survey got message from emulator window");
    let event_type = event.data["event_type"];

    if (event_type === "emulator_criteria_met") {
        onEmulatorCriteriaMet(qualtricsComponent);
    } else if (event_type === "user_dismissed_validation") {
        onUserDismissedValidation(qualtricsComponent);
    } else if (event_type == "all_emulator_criteria_met") {
        onAllEmulatorCriteriaMet(qualtricsComponent);
    } else if (event_type === "emulator_loaded") {
        if (!qualtricsPageLoaded) {
            emulatorLoaded = true;
        } else {
            sendEmulatorInfo(storyIds, distractorTasks);
        }
    }
};

Qualtrics.SurveyEngine.addOnReady(function () {
    storyIds = getStoryIds();
    distractorTasks = [
        "${e://Field/distractor_1}",
        "${e://Field/distractor_2}",
        "${e://Field/distractor_3}",
        "${e://Field/distractor_4}",
        "${e://Field/distractor_5}",
        "${e://Field/distractor_6}",
        "${e://Field/distractor_7}",
        "${e://Field/distractor_8}",
        "${e://Field/distractor_9}",
        "${e://Field/distractor_10}",
    ];

    for (let i = 0; i < distractorTasks.length; i++) {
        distractorTasks[i] = "distractor-task-" + distractorTasks[i];
    }

    if (emulatorLoaded) {
        sendEmulatorInfo(storyIds, distractorTasks);
    }

    jQuery("form#Page").css({ "overflow": "hidden" });
    jQuery("#emulator-embed").css({ "width": "100vw", "height": "95vh" });
    jQuery("#emulator-embed").parent().css({ "padding": "0", "overflow": "hidden" });
    jQuery("#Buttons").css({ "padding": "0", "margin-top": "0", "padding-right": "20px", "padding-bottom": "20px" });
    jQuery("#HeaderContainer").hide();

    setupValidationButton(this);

    qualtricsComponent = this;
    qualtricsPageLoaded = true;
});

Qualtrics.SurveyEngine.addOnUnload(function () {
    console.debug("removing custom css overrides");
    jQuery("form#Page").css({ "overflow": "" });
    jQuery("#emulator-embed").parent().css({ "overflow": "", "padding": "" });
    jQuery("#Buttons").css({ "padding": "20px", "margin-top": "10px" });
    jQuery("#HeaderContainer").show();
});

function sendEmulatorInfo(storyIds, distractorTasks) {
    let message = {
        "event_type": "emulator_info",
        "story_ids": storyIds,
        "distractor_tasks": distractorTasks,
    };

    sendEmulatorMessage(message);
}

function sendEmulatorMessage(message) {
    console.debug("sendEmulatorInfo -- Posting message to emulator" + JSON.stringify(message, null, 2));
    document.getElementById("emulator-embed").contentWindow.postMessage(message, "*");
}