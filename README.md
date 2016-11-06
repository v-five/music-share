## Vimudo API

Share music via different music providers (Spotify, Google Play Music, ...).

To run the API locally install [latest node version](https://nodejs.org/en/download/stable/).
Open command line in the project folder and run `npm install` (first time required) to install all required packages. To install gulp globally run `npm install gulp -g`.
Now you can start the API just with `gulp` command in the terminal.

### Endpoints

prefix: */api/version/*

current version is *dev*

| Method | Endpoint | Attributes         | Description
|--------|----------|--------------------|-------------
| GET    | search   | q                  | Get tracks from all providers based on query
| POST   | match    | url                | Post a track url and receive a url from all other providers
| POST   | playlist | url, title, tracks | Post a playlist url with a title and an array of track ids and receive a list of matched tracks


To run the angular 2 web app, go to ./public/angular2 and run:
_> npm install
_> npm start

then navigate to localhost:8080
