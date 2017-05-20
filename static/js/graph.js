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
       d["total_goals"] = d["home_goals"] + d["away_goals"]
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


   //calculate metrics
    var totalHomeGoalsByDate = matchweekDim.group().reduceSum(function(d){
        return d["home_goals"];
    });
    var totalAwayGoalsByDate = matchweekDim.group().reduceSum(function(d){
        return d["away_goals"];
    });
    var totalGoalsByDate = matchweekDim.group().reduceSum(function(d){
        return d["total_goals"]
    })


    // groups
    var homeTeamGroup = homeTeamDim.group();

    var awayTeamGroup = awayTeamDim.group();

    var all = ndx.groupAll();

    var max_goals = totalHomeGoalsByDate.top(1)[0].value;

    // define charts
    var timeChart = dc.barChart("#time-chart");

    selectField = dc.selectMenu('#menu-select')
       .dimension(homeTeamDim)
       .group(homeTeamGroup);

    timeChart
        .width(1500)
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(matchweekDim)
        .group(totalHomeGoalsByDate, "home")
        // .stack(totalAwayGoalsByDate, "away")
        .transitionDuration(500)
        .x(d3.time.scale().domain([1, 38]))
        .elasticY(true)
        .xAxisLabel("Matchweek")
        .yAxis().ticks(10);

    dc.renderAll();

};




