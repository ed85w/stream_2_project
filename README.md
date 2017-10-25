# Data Dashboard Project

[Premier League Data 2015/16](https://premier-league-2015-16.herokuapp.com)

## Overview

The project is a football statistics webpage that looks at the English Premier League 2015/16 season. Users can select different teams to view a range of statistics for the season, for that team. Users can also filter the data by interacting with the charts.

### Project Brief

The brief for this project was to build a data-driven frontend and backend website using a variety of technologies including Flask, Crossfilter.js, DC.js, D3 & Bootstrap.

### Some the tech used includes:
- [Flask](http://flask.pocoo.org/)
    - **Flask** the application was created in the Flask framework
- [D3](https://d3js.org/) & [DC.js](https://dc-js.github.io/dc.js/)
    - **D3 & DC.js** were used to create the charts, table and number displays
- [Crossfilter](http://square.github.io/crossfilter/)
    - **crossfilter** was used to help create the filters and manipuation of the data
- [Bootstrap](http://getbootstrap.com/)
    - **Bootstrap** was used to provide a responsive layout

### Testing

The website has been tested in the following browsers;

Google Chrome (inc developer tools)
Mozilla Firefox (inc developer tools)
Microsoft Edge
Internet Explorer
Safari

The website has been tested using the following mobile devices

Sony Xperia X
Sony Xperia XC
iPhone 5C

### Challenges Faced

- Data

In order to be able to apply the filters and return the results I was aiming for, I had to de-normalise the data I found for the dashboard. In its raw form there was a record for each premier league game of the season, however I required that each team in the league would have a separate record for each of their games (rather than each game being a home game for one team and an away game for another team). This involved creating two records for each game (so a separate record from the perspective of each of the two teams involved).

- Pre-filtering the records

As a default crossfilter does not apply a filter to the data. However as the dashboard is intended for users to view statistics for each team, I did not want users to be able to see the unfiltered data (ie the records for all teams). In order to achieve this I used the .filter method on the team select field and then used the following code to remove the option to view the unfiltered data;

        ```.on('renderlet', function () {
            $("select.dc-select-menu option:empty").remove();
        });```

- Change of appearance based on team selected

To customise the appearance of the page based on the team selected by the user, I created a javascript object which contained a name:value pair for each team. The value of each pair was a list of attributes to be used when that team was selected. The name was the name of each team. I then created a function which fired when the team select menu changed. Depending on which team was selected, the function changes the team badge displayed and also the colours of the charts to match that team's kit colours

