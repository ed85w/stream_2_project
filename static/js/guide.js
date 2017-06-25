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
                intro: "<b>Introduction</b><br/>This dashboard is built using d3.js, d3-queue, dc.js, Crossfilter, Bootstrap, Flask, MongoDB, Dashboards by Keen IO and Intro.js.<br/><br/>I'd like to thank...for the data<br/><br/>Click next for a guided tour of the features."
            },
            {
                element: "#tourStep1",
                intro: "<b>Team Selection Menu</b><br/>Start by choosing which team's statistics you would like to see."
            },
            {
                element: "#tourStep2",
                intro: "<b>Goals Scored/Conceded</b><br/>This chart shows the goals scored and conceded by the selected team.<br/></br> To filter by specific matchweeks drag your mouse/finger over the chart"
            },
            {
                element: "#tourStep3",
                intro: "<b>Home/Away Pie</b><br/>You can filter the statistics by home and/or away games by clicking on the relevant side of the pie chart"
            },
            {
                element: "#tourStep4",
                intro: "<b>Shots For</b><br/>This chart displays an aggregation of the number of games in which the selected team has taken varying number of shots <br/></br>Like the Goals Scored/Conceded Chart, this chart can be filtered by dragging your mouse/finger over the chart area"
            },
            // {
            //     element: "#tourStep5",
            //     intro: "<b>Projects by Resource Type</b><br/>This row chart shows the donation distribution by resource type.  Click any row to filter the data.  Click the same row again to remove the filter, or click 'reset' in the top right corner to remove all 'resource type' filters."
            // },
            // {
            //     element: "#tourStep6",
            //     intro: "<b>Projects by Primary Focus Area</b><br/>This row chart shows the donation distribution by primary focus area."
            // },
            // {
            //     element: "#tourStep7",
            //     intro: "<b>Projects by Poverty Level</b><br/>This donut chart shows the donation distribution by poverty level.  Click any slice to filter the data.  Click the same slice again to remove the filter, or click 'reset' in the top right corner to remove all 'poverty level' filters."
            // },
            // {
            //     element: "#tourStep8",
            //     intro: "<b>Projects by Grade Level</b><br/>This pie chart shows the donation distribution by student grade level."
            // }
        ]
    };

    tour.setOptions(tourGuide);
    tour.start();
}