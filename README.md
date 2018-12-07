# Broadcast Bot

## Installation

1. Install Node.js (latest version is preferable)
2. Install FFmpeg ([Windows](https://www.wikihow.com/Install-FFmpeg-on-Windows) | [Linux](https://www.ostechnix.com/install-ffmpeg-linux/) | [macOS](http://macappstore.org/ffmpeg/))
3. Clone the project
4. `npm install --prod` (or `yarn --prod` if you have Yarn)
5. Set up your Discord bot [here](https://discordapp.com/developers)
6. Set up `config.json` (you can also use [arguments](#starting-the-bot-with-arguments) instead or set up environment variables on your hosting like *Config Vars in Heroku*)
7. If you are using a stream, then step 8 can be skipped
8. Create folder `"music"` and place audiofiles inside
9. `npm start` (or `yarn start` if you have Yarn)

## Starting the bot with arguments

Options picking priority:
1. Arguments
2. `./config.json`
3. Environment variables

If you use the bot witout `config.json` you have to use at least two args - `--token` and `--roomId` and `--volume`.

```sh
npm start -- --token your_token_here --roomId 441341872296951822
```

If you want to play a YouTube stream you should specify the `--steam` argument:

```sh
npm start -- --token your_token_here --roomId 441341872296951822 --stream https://www.youtube.com/watch?v=QKYfTUTwowk
```

If you already have the `config.json`, all the arguments become optional. But if you specify arguments, they replace options in config file.

[Here's the full list of possible arguments](#options-and-arguments)

## Setting up `config.json`

```json
{
  "token": "your bot's access token goes right here",
  "roomId": "rooms_id_goes_here",
  "volume": 0.5,
  "showSongName": true,
  "stream": "https://www.youtube.com/watch?v=QKYfTUTwowk"
}
```

## Options and arguments

`--token`: String  
*Your bot's token.*

`--roomId`: String  
*Id of the channel the bot will try to enter into.*

`--volume`: Number (optional)
*Music's volume from `0` to `1`. Default value is `1`.*

`--showSongName`: String (optional)  
*Enables showing the current's song filename. Works only when bot is playing the music from file system.*

`--stream`: String (optional)
*Makes bot play audiotrack from this URL. Support Youtube only. Don't specify it if you want to play your music from `./music/` folder!*
