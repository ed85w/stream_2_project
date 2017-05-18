/**
 * Created by Ed on 13/05/2017.
 */

queue()
   .defer(d3.json, "/projectTest/testData")
   .await(makeGraphs);
 
function makeGraphs(error, jsonData) {
 
   //Clean jsonData data
   var projectTest1 = jsonData;
   var dateFormat = d3.time.format("%d/%m/%Y");
   projectTest1.forEach(function (d) {
       d["fixture_date"] = dateFormat.parse(d["fixture_date"]);
       // d["fixture_date"].setDate(1);
       // d["home_goals"] = +d["home_goals"];
       d.totalGoals = d["home_goals"] + d["away_goals"]
   });

      //Create a Crossfilter instance
   var ndx = crossfilter(projectTest1);

   //Define Dimensions
   var dateDim = ndx.dimension(function (d) {
       return d["fixture_date"];
   });
   var homeTeamDim = ndx.dimension(function (d) {
       return d["home_team"];
   });

   var awayTeamDim = ndx.dimension(function (d) {
       return d["away_team"];
   });



   //calculate metrics
    var totalHomeGoalsByDate = dateDim.group().reduceSum(function(d){
        return d["home_goals"];
    })
    var totalAwayGoalsByDate = dateDim.group().reduceSum(function(d){
        return d["away_goals"];
    })

    var totalGoalsDim = dateDim.group().reduceSum(function (d) {
        return d.total;
    });
    var homeTeamGroup = homeTeamDim.group();

    var all = ndx.groupAll();

    var max_goals = totalHomeGoalsByDate.top(1)[0].value;

       //Define values (to be used in charts)
   var minDate = dateDim.bottom(1)[0]["fixture_date"];
   var maxDate = dateDim.top(1)[0]["fixture_date"];

    // define charts
    var timeChart = dc.barChart("#time-chart");

    selectField = dc.selectMenu('#menu-select')
       .dimension(homeTeamDim)
       .group(homeTeamGroup);

     timeChart
       .width(800)
       .height(200)
       .margins({top: 10, right: 50, bottom: 30, left: 50})
       .dimension(dateDim)
       .group(totalHomeGoalsByDate, "home")
         .stack(totalAwayGoalsByDate, "away")

       .transitionDuration(500)
       .x(d3.time.scale().domain([minDate, maxDate]))
       .elasticY(true)
       .xAxisLabel("Year")
       .yAxis().ticks(4);

    dc.renderAll();

};




