/**
 * Created by Ed on 13/05/2017.
 */

// const TEAM_COLORS = {
//         'Arsenal': ['#e60005','#fffeff'],
//         'Manchester': ['#34231343', '#34213414'],
// };

 // TEAM_COLORS[d['team']]




queue()
    .defer(d3.json, "/dataDashboard/PLData")
   .await(makeGraphs);
 
function makeGraphs(error, jsonData) {

    //Clean projectsJson data - NOT REQUIRED UNLESS HELPS SORT
   jsonData.forEach(function (d) {
        d['matchweek'] = +d['matchweek'];
       // d["total_donations"] = +d["total_donations"];
   });

   //Create a Crossfilter instance
   var ndx = crossfilter(jsonData);

   //Define Dimensions
    var matchweekDim = ndx.dimension(function (d) {
        return d['matchweek'];
    });
    var teamDim = ndx.dimension(function (d){
        return d['team'];
    });
    var homeAwayDim = ndx.dimension(function(d){
        if ( d['home'] === 'TRUE'){
            return 'Home';
        } else {
            return 'Away';
        }
    });
    var totalShotsForDim = ndx.dimension(function(d){
        return d['total_shots_for'];
    });
    var totalShotsAgainstDim = ndx.dimension(function(d){
        return d['total_shots_against'];
    });

   //calculate metrics
    var totalGoalsForByDate = matchweekDim.group().reduceSum(function(d){
        return d['goals_for'];
    });
    var totalGoalsAgainstByDate = matchweekDim.group().reduceSum(function(d){
        return d['goals_against'];
    });
    var meanAttendance = ndx.groupAll().reduce(
      function (p, v) {
          ++p.n;
          p.tot += v['attendance'];
          return p;
      },
      function (p, v) {
          --p.n;
          p.tot -= v['attendance'];
          return p;
      },
      function () { return {n:0,tot:0}; }
    );
    var shotsToGoalsScored = ndx.groupAll().reduce(
        function (p, v){
            p.goalsScored += v['goals_for'];
            p.shotsFor += v['total_shots_for'];
            return p;
        },
        function (p, v){
            p.goalsScored -= v['goals_for'];
            p.shotsFor -= v['total_shots_for'];
            return p;
        },
        function () {return {goalsScored:0, shotsFor:0};}
    );
    var totalGoalsFor = ndx.groupAll().reduce(
        function (p, v){
            p.goalsFor += v['goals_for'];
            return p;
        },
        function (p, v){
            p.goalsFor -= v['goals_for'];
            return p;
        },
        function() {return {goalsFor:0};}
    );
    var totalGoalsAgainst = ndx.groupAll().reduce(
        function (p, v){
            p.goalsAgainst += v['goals_against'];
            return p;
        },
        function (p, v){
            p.goalsAgainst -= v['goals_against'];
            return p;
        },
        function() {return {goalsAgainst:0};}
    );
    var shotsToGoalsConceded = ndx.groupAll().reduce(
        function (p, v){
            p.goalsConceded += v['goals_against'];
            p.shotsAgainst += v['total_shots_against'];
            return p;
        },
        function (p, v){
            p.goalsConceded -= v['goals_against'];
            p.shotsAgainst -= v['total_shots_against'];
            return p;
        },
        function () {return {goalsConceded:0, shotsAgainst:0};}
    );

    // groups
    var teamGroup = teamDim.group();

    var totalShotsForGroup = totalShotsForDim.group();

    var totalShotsAgainstGroup = totalShotsAgainstDim.group();

    var homeAwayGroup = homeAwayDim.group();

    var matchweekGroup = matchweekDim.group();

    //min and max values to be used in charts
    var minWeek = matchweekDim.bottom(1)[0]['matchweek'];
    var maxWeek = matchweekDim.top(1)[0]['matchweek']+1;

    var minShotsFor = totalShotsForDim.bottom(1)[0]['total_shots_for'];
    var maxShotsFor = totalShotsForDim.top(1)[0]['total_shots_for'];

    var minShotsAgainst = totalShotsAgainstDim.bottom(1)[0]['total_shots_against'];
    var maxShotsAgainst = totalShotsAgainstDim.top(1)[0]['total_shots_against'];

    // set initial widths based on screen size
    var goalsChartWidth = $(".goals-chart-container").width();
    var pieChartWidth = $(".pie-chart-container").width();
    var shotsChartsWidth = $(".shots-chart-container").width();

    // define charts
    var goalsChart = dc.barChart("#goals-chart");
    var totalShotsForChart = dc.barChart("#shots-for-chart");
    var totalShotsAgainstChart = dc.barChart("#shots-against-chart");
    var pieChart = dc.pieChart("#home-away-goals-chart");
    var avgAttendanceND = dc.numberDisplay("#avg-attendance");
    var shotsToGoalsScoredND = dc.numberDisplay("#shots-to-goals-scored");
    var shotsToGoalsConcededND = dc.numberDisplay("#shots-to-goals-conceded");
    var totalGoalsForND = dc.numberDisplay("#total-goals-for");
    var totalGoalsAgainstND = dc.numberDisplay("#total-goals-against");
    var goalsScoredTab = dc.dataTable("#goals-scored-table");

    selectField = dc.selectMenu('#menu-select')
       .dimension(teamDim)
       .group(teamGroup);

    //remove key from selectField dropdown
    selectField.title(function(d){
        return d.key;
    });

    // event handler to filter selectField on doc load
    $( document ).ready(function() {
        selectField.filter('Arsenal');
        console.log(teamDim.top(1)[0].team);
        $("option.dc-select-option").remove();
    });
    
    $("#menu-select").change(function() {
        // selectedTeam = teamDim.top(1)[0].team
        selectedTeam = selectField.filter()
        alert(selectedTeam + " has been selected")
    });

    goalsChart
        .width(goalsChartWidth)
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

    pieChart
        .height(250)
        .width(pieChartWidth)
        .radius(100)
        .innerRadius(40)
        .transitionDuration(1000)
        .dimension(homeAwayDim)
        .group(homeAwayGroup)
        .legend(dc.legend().x(10).y(10).itemHeight(10).gap(5));

    totalShotsForChart
        .width(shotsChartsWidth)
        .height(200)
        .margins({top: 10, right: 30, bottom: 30, left: 30})
        .dimension(totalShotsForDim)
        .group(totalShotsForGroup)
        .ordinalColors(["#0dff0d"])
        .transitionDuration(500)
        // .color("#0dff0d")
        .x(d3.time.scale().domain([minShotsFor, maxShotsFor]))
        .elasticY(true)
        .xAxisLabel("Number of Shots")
        .yAxisLabel("Number of Games")
        .yAxis().ticks(4);

    totalShotsAgainstChart
        .width(shotsChartsWidth)
        .height(200)
        .margins({top: 10, right: 30, bottom: 30, left: 30})
        .dimension(totalShotsAgainstDim)
        .group(totalShotsAgainstGroup)
        .ordinalColors(["#b2131a"])
        .transitionDuration(500)
        // .color("#0dff0d")
        .x(d3.time.scale().domain([minShotsAgainst, maxShotsAgainst]))
        .elasticY(true)
        .xAxisLabel("Number of Shots")
        .yAxisLabel("Number of Games")
        .yAxis().ticks(4);

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

    goalsScoredTab
        .dimension(matchweekDim)
        .group(function(d) { return d['matchweek']; })
        .columns([
            function (d) { return d['matchweek']; },
            function (d) { return d['opponent']; },
            function (d) { return d['goal_details_for']; },
            function (d) { return d['goal_details_against']; },
        ])
        .order(function(a, b) { return d3.ascending(a["matchweek"], b["matchweek"]);} )
        .size(370)
        .width(500)
        .height();



    dc.renderAll();

    // listen for browser resize
    $(window).on("resize", chartResize);

    // function to resize chart based on bootstrap container
    function chartResize(){
        var goalsChartWidth = $(".goals-chart-container").width();
        var pieChartWidth = $(".pie-chart-container").width();
        var shotsChartsWidth = $(".shots-chart-container").width();
        goalsChart
            .width(goalsChartWidth);
        pieChart
            .width(pieChartWidth);
        totalShotsForChart
            .width(shotsChartsWidth);
        totalShotsAgainstChart
            .width(shotsChartsWidth);
        dc.renderAll();
    }


};



