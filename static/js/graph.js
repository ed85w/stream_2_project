/**
 * Created by Ed on 13/05/2017.
 */
queue()
   .defer(d3.json, "/projectTest1/testData")
   .await(makeGraphs);
 
function makeGraphs(error, projectsJson) {
 
   //Clean projectsJson data
   var projectTest1 = projectsJson;
   var dateFormat = d3.time.format("%d-%m-%Y");
   projectTest1.forEach(function (d) {
       d["fixture_date"] = dateFormat.parse(d["fixture_date"]);
       d["fixture_date"].setDate(1);
       d["home_goals"] = +d["home_goals"];
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

   // Calculate metrics
   var homeGoalsByDate = dateDim.group();

};




