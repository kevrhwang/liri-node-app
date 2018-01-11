var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var request = require('request');
var inquirer = require('inquirer');
var fs = require("fs");

function getTweets() {
	var client = new Twitter({
		consumer_key: keys.twitterKeys.consumer_key,
	  	consumer_secret: keys.twitterKeys.consumer_secret,
	  	access_token_key: keys.twitterKeys.access_token_key,
	  	access_token_secret: keys.twitterKeys.access_token_secret,
	  })

	var params = {
		screen_name: 'kevrhwang',
		count: 20
	};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    for (var i = 0; i < tweets.length; i++) {
	    	console.log("Tweet " + parseInt(i+1) +  ": " + tweets[i].text);
	    }
	  }
	});
}

function spotifySong(song) {
	var spotify = new Spotify({
		id: keys.spotifyKeys.id,
		secret: keys.spotifyKeys.secret
	});

	spotify
	.search({ type: 'track', query: song})
		
	.then(function(info) {
		for (var i = 0; i < 5; i++) {
			console.log("RESULT " + parseInt(i+1));
			console.log("-----------------------------------------------------------------");
			console.log("Artist: " + info.tracks.items[i].album.artists[0].name);
  			console.log("Track: " + info.tracks.items[i].name);
  			console.log("Listen: " + info.tracks.items[i].external_urls.spotify);
  			console.log("Album: " + info.tracks.items[i].album.name);
  			console.log("-----------------------------------------------------------------");
  		}
		
	})
}

function getMovie(movie) {
	request('http://www.omdbapi.com/?t=' + movie + '&apikey=trilogy', function (error, response, body) {
		var info = JSON.parse(body);
		console.log("Title: " + info.Title);
		console.log("Year: " + info.Year);
		console.log("IMDB Rating: " + info.Ratings[0].Value);
		console.log("Rotten Tomatoes Rating: " + info.Ratings[1].Value);
		console.log("Country Produced: " + info.Country);
		console.log("Language: " + info.Language);
		console.log("Plot: " + info.Plot);
		console.log("Cast: " + info.Actors);

		
	});
}

function spotifyPrompt() {
	inquirer.prompt([
		{
			type: "input",
			name: "song",
			message: "What song do you want to search for?"
		}
	]).then(function(input) {
		if (input.song) {
			spotifySong(input.song);
		} else {
			spotifySong("The Sign Ace of Base");
		}
	})
}

function moviePrompt() {
	inquirer.prompt([
		{
			type: "input",
			name: "movie",
			message: "What movie do you want to search for?"
		}
	]).then(function(input) {
		if (input.movie) {
			getMovie(input.movie);
		} else {
			getMovie("Mr. Nobody");
		}
	})
}

function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			return console.log(error);
		}

		var dataArr = data.split(",");

		if (dataArr[0] === "my-tweets") {
			getTweets();
		} else if (dataArr[0] === "spotify-this-song") {
			spotifySong(dataArr[1]);
		} else if (dataArr[0] === "movie-this") {
			getMovie(dataArr[1]);
		} else {
			console.log("Invalid Command. Please try again");
		}

	});
}


inquirer.prompt([
	{
		type: "list",
		name: "search",
		message: "Choose an option to search:",
		choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"]
	}
]).then(function(choice) {
	if (choice.search === "my-tweets") {
		getTweets();
	} else if (choice.search === "spotify-this-song") {
		spotifyPrompt();
	} else if (choice.search === "movie-this") {
		moviePrompt();
	} else if (choice.search === "do-what-it-says") {
		doWhatItSays();
	}
})

