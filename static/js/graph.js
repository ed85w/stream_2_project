/**
 * Created by Ed on 13/05/2017.
 */

// const TEAM_COLORS = {
//     'Manchester': ['#34231343', '#34213414'],
//
// };

// TEAM_COLORS[d['team_name']]

// variables for tweaking the responsiveness of the dc.js charts
var maxChartWidth = 750;
var mediumChartWidth = 580;
var smallChartWidth = 440;
var extraSmallChartWidth = 330;
var largeViewportSwitch = 768;
var mediumViewportSwitch = 596;
var smallViewportSwitch = 480;


queue()
    .defer(d3.json, "/dataDashboard/PLData")
   .await(makeGraphs);
 
function makeGraphs(error, jsonData) {
 
   //Clean jsonData data
   // var projectTest1 = jsonData;

   // projectTest1.forEach(function (d) {
   //     // d["attendance"] = +d["attendance"];
   // });

      //Create a Crossfilter instance
   var ndx = crossfilter(jsonData);

   //Define Dimensions
    var matchweekDim = ndx.dimension(function (d) {
        return d["matchweek"]
    });
    var teamDim = ndx.dimension(function (d){
        return d['team'];
    });
    var homeAwayDim = ndx.dimension(function(d){
        if ( d['home'] === "TRUE"){
            return "Home";
        } else {
            return "Away";
        }
    });
    var attendanceDim = ndx.dimension(function (d){
        return d['attendance'];
    });
    var totalShotsForDim = ndx.dimension(function(d){
        return d["total_shots_for"];
    });
    var totalShotsAgainstDim = ndx.dimension(function(d){
        return d["total_shots_against"];
    });


   //calculate metrics
    var totalGoalsForByDate = matchweekDim.group().reduceSum(function(d){
        return d["goals_for"];
    });
    var totalGoalsAgainstByDate = matchweekDim.group().reduceSum(function(d){
        return d["goals_against"];
    });
    var meanAttendance = ndx.groupAll().reduce(
      function (p, v) {
          ++p.n;
          p.tot += v["attendance"];
          return p;
      },
      function (p, v) {
          --p.n;
          p.tot -= v["attendance"];
          return p;
      },
      function () { return {n:0,tot:0}; }
    );
    var shotsToGoalsScored = ndx.groupAll().reduce(
        function (p, v){
            p.goalsScored += v["goals_for"];
            p.shotsFor += v["total_shots_for"];
            return p;
        },
        function (p, v){
            p.goalsScored -= v["goals_for"];
            p.shotsFor -= v["total_shots_for"];
            return p;
        },
        function () {return {goalsScored:0, shotsFor:0};}
    );
    var totalGoalsFor = ndx.groupAll().reduce(
        function (p, v){
            p.goalsFor += v["goals_for"];
            return p;
        },
        function (p, v){
            p.goalsFor -= v["goals_for"];
            return p;
        },
        function() {return {goalsFor:0};}
    );
    var totalGoalsAgainst = ndx.groupAll().reduce(
        function (p, v){
            p.goalsAgainst += v["goals_against"];
            return p;
        },
        function (p, v){
            p.goalsAgainst -= v["goals_against"];
            return p;
        },
        function() {return {goalsAgainst:0};}
    );
    var shotsToGoalsConceded = ndx.groupAll().reduce(
        function (p, v){
            p.goalsConceded += v["goals_against"];
            p.shotsAgainst += v["total_shots_against"];
            return p;
        },
        function (p, v){
            p.goalsConceded -= v["goals_against"];
            p.shotsAgainst -= v["total_shots_against"];
            return p;
        },
        function () {return {goalsConceded:0, shotsAgainst:0};}
    );

    // groups
    var teamGroup = teamDim.group();

    var totalShotsForGroup = totalShotsForDim.group();

    var totalShotsAgainstGroup = totalShotsAgainstDim.group();

    var homeAwayGroup = homeAwayDim.group();

    // var all = ndx.groupAll();


    //min and max values to be used in charts
    var minWeek = matchweekDim.bottom(1)[0]["matchweek"];
    var maxWeek = matchweekDim.top(1)[0]["matchweek"];

    var minShotsFor = totalShotsForDim.bottom(1)[0]["total_shots_for"];
    var maxShotsFor = totalShotsForDim.top(1)[0]["total_shots_for"];

    var minShotsAgainst = totalShotsAgainstDim.bottom(1)[0]["total_shots_against"];
    var maxShotsAgainst = totalShotsAgainstDim.top(1)[0]["total_shots_against"];

    // define charts
    var goalsChart = dc.barChart("#goals-chart");
    var totalShotsForChart = dc.barChart("#shots-for-chart");
    var totalShotsAgainstChart = dc.barChart("#shots-against-chart")
    var pieChart = dc.pieChart("#home-away-goals-chart");
    var avgAttendanceND = dc.numberDisplay("#avg-attendance");
    var shotsToGoalsScoredND = dc.numberDisplay("#shots-to-goals-scored");
    var shotsToGoalsConcededND = dc.numberDisplay("#shots-to-goals-conceded");
    var totalGoalsForND = dc.numberDisplay("#total-goals-for");
    var totalGoalsAgainstND = dc.numberDisplay("#total-goals-against");

    // set initial widths based on screen size
    var chartWidth;
    if (matchMedia) {
        var mq1 = window.matchMedia("(min-width: " + largeViewportSwitch + "px)");
        if (mq1.matches) {
            chartWidth = maxChartWidth;
        } else {
            var mq2 = window.matchMedia("(min-width: " + mediumViewportSwitch + "px)");
            if (mq2.matches) {
                chartWidth = mediumChartWidth;
            } else {
                var mq3 = window.matchMedia("(min-width: " + smallViewportSwitch + "px)");
                if (mq3.matches) {
                    chartWidth = smallChartWidth;
                } else {
                    chartWidth = extraSmallChartWidth;
                }
            }
        }
    }


    selectField = dc.selectMenu('#menu-select')
       .dimension(teamDim)
       .group(teamGroup);

    goalsChart
        .width(chartWidth)
        .height(250)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(matchweekDim)
        .group(totalGoalsForByDate, "Scored")
        .stack(totalGoalsAgainstByDate, "Conceded")
        .ordinalColors(["#0dff0d","#b2131a"])
        .transitionDuration(500)
        .x(d3.time.scale().domain([minWeek, maxWeek]))
        .legend(dc.legend().x(450).y(10).itemHeight(13).gap(5))
        .elasticY(true)
        .xAxisLabel("Matchweek")
        .yAxis().ticks(2);

    totalShotsForChart
        .width(450)
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(totalShotsForDim)
        .group(totalShotsForGroup, "Shots")
        .ordinalColors(["#0dff0d","#b2131a"])
        .transitionDuration(500)
        // .color("#0dff0d")
        .x(d3.time.scale().domain([minShotsFor, maxShotsFor]))
        .legend(dc.legend().x(450).y(10).itemHeight(13).gap(5))
        .elasticY(true)
        .xAxisLabel("Number of Shots")
        .yAxisLabel("Number of Games")
        .yAxis().ticks(4);

    totalShotsAgainstChart
        .width(450)
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(totalShotsAgainstDim)
        .group(totalShotsAgainstGroup, "Shots")
        .ordinalColors(["#0dff0d","#b2131a"])
        .transitionDuration(500)
        // .color("#0dff0d")
        .x(d3.time.scale().domain([minShotsAgainst, maxShotsAgainst]))
        .legend(dc.legend().x(450).y(10).itemHeight(13).gap(5))
        .elasticY(true)
        .xAxisLabel("Number of Shots")
        .yAxisLabel("Number of Games")
        .yAxis().ticks(4);

    pieChart
        .height(250)
        .width(360)
        .radius(100)
        .innerRadius(40)
        .transitionDuration(1000)
        .dimension(homeAwayDim)
        .group(homeAwayGroup)
        .legend(dc.legend().x(20).y(10).itemHeight(13).gap(5));

    avgAttendanceND
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
            if (d.n === 0) {
                return 0;
            } else {
                return Math.round(d.tot/d.n);
            }
        })
        .group(meanAttendance)
        .transitionDuration(100);

    shotsToGoalsScoredND
        .formatNumber(d3.format(",%"))
        .valueAccessor(function (d) {
            if (d.goalsScored === 0 || d.shotsFor ===0 ) {
                return 0;
            } else {
                return (d.goalsScored/d.shotsFor)
            }
        })
        .group(shotsToGoalsScored)
        .transitionDuration(0);

    totalGoalsForND
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
            return d.goalsFor;
        })
        .group(totalGoalsFor)
        .transitionDuration(0);

    totalGoalsAgainstND
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
            return d.goalsAgainst;
        })
        .group(totalGoalsAgainst)
        .transitionDuration(0);

    shotsToGoalsConcededND
        .formatNumber(d3.format(",%"))
        .valueAccessor(function (d) {
            if (d.goalsConceded === 0) {
                return 0;
            } else {
                return (d.goalsConceded/d.shotsAgainst)
            }
        })
        .group(shotsToGoalsConceded)
        .transitionDuration(0);



    // // listen for browser resize
    // $(window).on("resize", resizeWideCharts);
    //
    // // listen for orientation change
    // var mq = window.matchMedia("(orientation: portrait)");
    // mq.addListener(function(m) {
    //     resizeWideCharts();
    // });
    //
    // // test if the browser resize needs a chart resize
    // function resizeWideCharts(){
    //     var winWidth = $(window).width();
    //     if (winWidth < smallViewportSwitch && chartWidth != extraSmallChartWidth){
    //         chartResize(extraSmallChartWidth);
    //     } else if (winWidth >= smallViewportSwitch && winWidth < mediumViewportSwitch && chartWidth != smallChartWidth){
    //         chartResize(smallChartWidth);
    //     } else if (winWidth >= mediumViewportSwitch && winWidth < largeViewportSwitch && chartWidth != mediumChartWidth){
    //         if (chartWidth == maxChartWidth) {
    //             dc.filterAll(); // this is the switch from interactive chart to menu selection
    //         }
    //         chartResize(mediumChartWidth);
    //     } else if (winWidth >= largeViewportSwitch && chartWidth != maxChartWidth){
    //         chartResize(maxChartWidth);
    //     }
    // }
    //
    // // do the chart resize
    // function chartResize(width) {
    //     console.log(width);
    //     goalsChart.rescale();
    // }

    dc.renderAll();

};

