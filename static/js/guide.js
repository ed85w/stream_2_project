/**
 * Created by Ed on 08/06/2017.
 */
function startGuide() {
    var tour = introJs();
    tour.setOption('tooltipPosition', 'auto');
    tour.setOption('positionPrecedence', ['left', 'right', 'bottom', 'top']);
    var tourGuide = {
        "steps": [
            {
                intro: "<b>Introduction</b><br/>This dashboard is built using d3.js, d3-queue, dc.js, Crossfilter, Bootstrap, Flask, MongoDB, Dashboards by Keen IO and Intro.js.<br/><br/>Click next for a guided tour of the features."
            },
            {
                element: "#tourStep1",
                intro: "<b>Team Selection Menu</b><br/>Start by choosing which team's statistics you would like to see."
            },
            {
                element: "#tourStep2",
                intro: "<b>Home/Away Pie</b><br/>You can filter the statistics by home and/or away games by clicking on the relevant side of the pie  chart"
            },            {
                element: "#tourStep3",
                intro: "<b>Goals Scored/Conceded</b><br/>This chart shows the goals scored and conceded by the selected team.<br/></br> To filter by specific matchweeks drag your mouse/finger over the chart"
            },
            {
                element: "#tourStep4",
                intro: "<b>A selection of interesting statistics!</b><br/>These are automatically updated based on the filters you choose"
            },
            {
                element: "#tourStep5",
                intro: "<b>Shots For</b><br/>This chart displays an aggregation of the number of games in which the selected team has taken varying number of shots <br/></br>Like the Goals Scored/Conceded Chart, this chart can be filtered by dragging your mouse/finger over the chart area"
            },
            {
                element: "#tourStep6",
                intro: "<b>Shots Against</b><br/>This chart shows the same data as the 'Shots For' chart, but for shots conceded by the selected team"
            },
                        {
                element: "#tourStep7",
                intro: "<b>Goal Details</b><br/>A table looking in more detail at the team's matches you have selected"
            }
        ]
    };

    tour.setOptions(tourGuide);
    tour.start();
}

