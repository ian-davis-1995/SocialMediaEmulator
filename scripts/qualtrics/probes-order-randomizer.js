function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

Qualtrics.SurveyEngine.addOnload(function () {
    /*Place your JavaScript here to run when the page loads*/
    let storyOrder = shuffle([
        "turtles-on-treadmills",
        "irish-moss",
        "cuttlefish-vision",
        "skywalker-resort"
    ]); // Shuffle the story order up. These are going to get stored in embedded_data.
    let distractorOrder = shuffle(range(10, 1));
    Qualtrics.SurveyEngine.setEmbeddedData("first_story", storyOrder[0]);
    Qualtrics.SurveyEngine.setEmbeddedData("second_story", storyOrder[1]);
    Qualtrics.SurveyEngine.setEmbeddedData("third_story", storyOrder[2]);
    Qualtrics.SurveyEngine.setEmbeddedData("fourth_story", storyOrder[3]);

    for (let i = 0; i < distractorOrder.length; i++) {
        let taskNumber = distractorOrder[i];
        Qualtrics.SurveyEngine.setEmbeddedData("distractor_" + (i + 1).toString(), taskNumber);
        console.debug("distractor_" + (i + 1).toString() + " = " + taskNumber);
    }
});

Qualtrics.SurveyEngine.addOnReady(function () {
    /*Place your JavaScript here to run when the page is fully displayed*/

});

Qualtrics.SurveyEngine.addOnUnload(function () {
    /*Place your JavaScript here to run when the page is unloaded*/

});