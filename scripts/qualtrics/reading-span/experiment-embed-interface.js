console.debug("Qualtrics survey registering message listener updated");

let qualtricsComponent = null;

window.onmessage = function (event) {
  console.debug("Qualtrics survey got message from emulator window");
  let event_type = event.data["event_type"];

  if (event_type === "experiment_finished") {
    onEmulatorCriteriaMet();
  }
};

function onEmulatorCriteriaMet() {
  qualtricsComponent.enableNextButton();
}

Qualtrics.SurveyEngine.addOnReady(function () {
  qualtricsComponent = this;
  this.disableNextButton();

  console.debug("rspan embed interface jquery selectors:");
  console.debug(jQuery(".Skin .QuestionText"));
  console.debug(jQuery(".Skin #Buttons"));
  jQuery(".Skin .QuestionText").css("padding", "0 20px");
  jQuery(".Skin #Buttons").css("margin-top", "0px");
  jQuery(".Skin #Buttons").css("padding", "0 20px");
});

Qualtrics.SurveyEngine.addOnUnload(function () {});

function sendExperimentMessage(message) {
  console.debug(
    "sendExperimentMessage -- Posting message to experiment" +
      JSON.stringify(message, null, 2)
  );
  document
    .getElementById("experiment-embed")
    .contentWindow.postMessage(message, "*");
}
