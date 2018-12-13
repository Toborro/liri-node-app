//=============================================================================
// Initialization
//=============================================================================
require("dotenv").config();
var keys = require("./keys");
var request = require('request');
var axios = require("axios");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var inquirer = require('inquirer');
var moment = require("moment");
var spotify = new Spotify(keys.spotify);
// GLOBAL VARIABLES
// These used to be from process.argv, but now they're coming from prompts
var command = process.argv[2]
var amazinglyItWorks = process.argv.slice(3).join(" ")

//=============================================================================
// Functions
//=============================================================================
function whatToDo() {
    if (command === 'do-what-it-says') {
        fs.readFile('./random.txt', 'UTF8', function(err, data) {
            if (err) {
                console.log("Why are you not working")
            }
            command = data.substring(0, data.indexOf(","))
            amazinglyItWorks = data.substring(data.indexOf(",") + 2, data.length - 1)
            whatToDo();
        })
    }
    
    else if (command === 'concert-this') {
        ConcertThis();
    }
    
    else if (command === 'spotify-this-song') {
        SpotifyThis()
    }
    
    else if (command === 'movie-this') {
        MovieThis();
    }
    else if (command === 'do-what-it-says') {
        doThis();
    }
    else {
        console.log("Enter a valid command such as: 'concert-this', 'spotify-this-song', 'movie-this', or 'do-what-it-says'")
    }
}

//Function for concert-this
function ConcertThis() {
    if (amazinglyItWorks == "") {
        console.log("You must include an artist to search.")
    }
    else {
        axios.get("https://rest.bandsintown.com/artists/" + amazinglyItWorks + "/events?app_id=codingbootcamp")
        .then(function(response) {
            var results = response.data;
            for (i=0;i<results.length;i++) {
                var venue = results[i].venue.name;
                if (results[i].country === "United States") {
                    var location = results[i].venue.city + ", " + results[i].venue.region
                }
                else {
                    var location = results[i].venue.city + ", " + results[i].venue.country
                }
                var date = moment(results[i].datetime)
                date = date.format("MM/DD/YYYY")
                var output = ("\nVenue: " + venue + "\nLocation: " + location + "\nDate: " + date + "\n---------------------------------");
                console.log(output)
                fs.appendFile('log.txt', output, 'utf8', function(error) {
                    if (error) {
                        console.log("Why are you messing up?")
                    }
                    console.log("Appended data to file.")
                })
            }
        })
    }

}
//Function for spotify-this-song
function SpotifyThis() {
    console.log("Here is the information.")
    if (amazinglyItWorks == "") {
        amazinglyItWorks = "The Sign Ace of Base"
    }
    spotify.search({
        type: 'track',
        query: amazinglyItWorks
    }, function(err, data) {
        if (err) {
            console.log("Error occurred finding your song")
        }
        var results = data.tracks.items[0]
        var artist = results.artists[0].name;
        var name = results.name;
        var preview = results.preview_url;
        var album = results.album.name;
        var output = ("\nArtist: " + artist + "\nSong Name: " + name + "\nPreview Link: " + preview + "\nAlbum: " + album + "\n---------------------------------");
        console.log(output)
        fs.appendFile('log.txt', output, 'utf8', function(error) {
            if (error) {
                console.log("Why are you messing up?")
            }
            console.log("Appended data to file.")
        })
    })
}


//Function for movie-this
function MovieThis() {
    if (amazinglyItWorks === "") {
        amazinglyItWorks = "Mr. Nobody"
    }
    axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + amazinglyItWorks)
    .then(function(response) {
        console.log(response.data.Title)
        results = response.data;
        var title = results.Title;
        var year = results.Year;
        ratingsArr = results.Ratings
        var IMDB = ratingsArr.filter(function(item) {
            return item.Source === 'Internet Movie Database'
        }).map(function(item) {
            return item.Value.toString()
        })
        IMDB = IMDB.toString();
        var RT = ratingsArr.filter(function(item) {
            return item.Source === 'Rotten Tomatoes'
        }).map(function(item) {
            return item.Value.toString()
        })
        RT = RT.toString();
        country = results.Country;
        language = results.Language;
        plot = results.Plot;
        actors = results.Actors;
        var output = ("\nTitle: " + title + "\nYear: " + year + "\nIMDB Rating: " + IMDB + "\nRotten Tomatoes Rating: " + RT + "\nCountry: " + country + "\nLanguage: " + language + "\nPlot: " + plot + "\nActors: " + actors + "\n---------------------------------")
        console.log(output)
        fs.appendFile('log.txt', output, 'utf8', function(error) {
            if (error) {
                console.log("Why are you messing up?")
            }
            console.log("Appended data to file.")
        })
    })
}
whatToDo();