let style = "";

Qualtrics.SurveyEngine.addOnReady(function () {
    /*Place your JavaScript here to run when the page is fully displayed*/
    console.debug("Setting css for images!");
    console.debug(jQuery("img"));
    style = jQuery("img").attr("style");
    jQuery("img").attr("style", style + " max-width:75vw!important;");
});

Qualtrics.SurveyEngine.addOnUnload(function () {
    /*Place your JavaScript here to run when the page is unloaded*/
    console.debug("removing css for images!");
    console.debug(jQuery("img"));
    jQuery("img").attr("style", style);
});