/**
 * Created by Ed on 13/05/2017.
 */

const TEAM_COLORS = {
    'Manchester': ['#34231343', '#34213414'],

}

TEAM_COLORS[d['team_name']]

queue()
   .defer(d3.json, "/projectTest/testData")
   .await(makeGraphs);
 
function makeGraphs(error, jsonData) {
 
   //Clean jsonData data
   var projectTest1 = jsonData;
   projectTest1.forEach(function (d) {
       // var total_goals = d["home_goals"] + d["away_goals"]
       // d["attendance"] = +d["attendance"];
   });

      //Create a Crossfilter instance
   var ndx = crossfilter(projectTest1);

   //Define Dimensions
    var matchweekDim = ndx.dimension(function (d) {
        return d["Matchweek"]
    });

    var teamDim = ndx.dimension(function (d){
        return d['team'];
    });

    // var homeAwayDim = ndx.dimension(function (d){
    //     return d['home_team'];
    // });

    var homeAwayDim = ndx.dimension(function(d){
        if ( d['home_team'] === "TRUE"){
            return "Home";
        } else {
            return "Away";
        }
    });

    var homeAwayGoalsDim = ndx.dimension(function(d){
        return d["goals"];
    })

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

    // var attendanceDim = ndx.dimension(function (d){
    //     return d['attendance'];
    // });



   //calculate metrics
    var totalHomeGoalsByDate = matchweekDim.group().reduceSum(function(d){
        return d["goals"];
    });
    var totalAwayGoalsByDate = matchweekDim.group().reduceSum(function(d){
        return d["away_goals"];
    });

    // var highAttendance = matchweekDim.group().reduceSum(function (d){
    //     return d["attendance"]
    // });

    // var highAttendance = attendanceDim.top(1)[0].value;

    // groups
    var teamGroup = teamDim.group();

    var matchweekGroup = matchweekDim.group();

    var homeAwayGroup = homeAwayDim.group();

    var all = ndx.groupAll();


        //Define values (to be used in charts)
    var minWeek = matchweekDim.bottom(1)[0]["Matchweek"];
    var maxWeek = matchweekDim.top(1)[0]["Matchweek"];

    // define charts
    var timeChart = dc.barChart("#time-chart");
    var pieChart = dc.pieChart("#home-away-goals-chart");
    var maxAttendanceND = dc.numberDisplay("#max-attendance")

    selectField = dc.selectMenu('#menu-select')
       .dimension(teamDim)
       .group(teamGroup);

    timeChart
        .width(1000)
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(matchweekDim)
        .group(totalHomeGoalsByDate, "Home")
        .stack(totalAwayGoalsByDate, "Away")
        .ordinalColors(["#0dff0d","#b2131a"])
        // .linearColors(["#0dff0d","#b2131a"])
        .transitionDuration(500)
        // .color("#0dff0d")
        .x(d3.time.scale().domain([minWeek, maxWeek]))
        .legend(dc.legend().x(450).y(10).itemHeight(13).gap(5))
        .elasticY(true)
        .xAxisLabel("Matchweek")
        .yAxis().ticks(2);

    pieChart
        .height(234)
        .width(360)
        .radius(100)
        .innerRadius(40)
        .transitionDuration(1000)
        .dimension(homeAwayDim)
        .group(homeAwayGroup)
        .legend(dc.legend().x(20).y(10).itemHeight(13).gap(5));

    maxAttendanceND
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

    dc.renderAll();

};

