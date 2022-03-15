let style = "";
const selector = "table.ChoiceStructure";

Qualtrics.SurveyEngine.addOnReady(function () {
    /*Place your JavaScript here to run when the page is fully displayed*/
    console.debug("Setting css for question width!");

    const elements = jQuery(selector);
    console.debug(elements);
    style = elements.attr("style");

    if (style === undefined || style === null) style = "";

    const styleAddon = "width: 770px; max-width:770px; table-layout:fixed;";
    elements.attr("style", style !== "" ? style + " " + styleAddon : styleAddon);
});

Qualtrics.SurveyEngine.addOnUnload(function () {
    /*Place your JavaScript here to run when the page is unloaded*/
    const elements = jQuery(selector);
    console.debug("removing css for question width!");
    console.debug(elements);

    if (style === undefined || style === null) style = "";

    elements.attr("style", style);
});