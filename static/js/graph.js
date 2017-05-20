/**
 * Created by Ed on 13/05/2017.
 */

queue()
   .defer(d3.json, "/projectTest/testData")
   .await(makeGraphs);
 
function makeGraphs(error, jsonData) {
 
   //Clean jsonData data
   var projectTest1 = jsonData;
   projectTest1.forEach(function (d) {
       var total_goals = d["home_goals"] + d["away_goals"]
   });

      //Create a Crossfilter instance
   var ndx = crossfilter(projectTest1);

   //Define Dimensions
    var matchweekDim = ndx.dimension(function (d) {
        return d["Matchweek"]
    });
   var homeTeamDim = ndx.dimension(function (d) {
       return d["home_team"];
   });
   var awayTeamDim = ndx.dimension(function (d) {
       return d["away_team"];
   });
   var teamDim = ndx.dimension(function (d){
       return d['team'];
   });



   //calculate metrics
    var totalHomeGoalsByDate = matchweekDim.group().reduceSum(function(d){
        return d["goals"];
    });
    var totalAwayGoalsByDate = matchweekDim.group().reduceSum(function(d){
        return d["away_goals"];
    });
    var totalGoalsByDate = matchweekDim.group().reduceSum(function(d){
        return d["total_goals"];
    });


    // groups

    var teamGroup = teamDim.group();

    var homeTeamGroup = homeTeamDim.group();

    var awayTeamGroup = awayTeamDim.group();

    var matchweekGroup = matchweekDim.group();

    var all = ndx.groupAll();

    var max_goals = totalHomeGoalsByDate.top(1)[0].value;

        //Define values (to be used in charts)
    var minWeek = matchweekDim.bottom(1)[0]["Matchweek"];
    var maxWeek = matchweekDim.top(1)[0]["Matchweek"];

    // define charts
    var timeChart = dc.barChart("#time-chart");

    selectField = dc.selectMenu('#menu-select')
       .dimension(teamDim)
       .group(teamGroup);

    timeChart
        .width(1000)
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(matchweekDim)
        .group(totalHomeGoalsByDate, "home")
        // .stack(totalAwayGoalsByDate, "away")
        .transitionDuration(500)
        .x(d3.time.scale().domain([minWeek, maxWeek]))
        .elasticY(true)
        .xAxisLabel("Matchweek")
        // .xAxis().ticks(1) //doesn't seem to do anything
        .yAxis().ticks(2);

    dc.renderAll();

};




