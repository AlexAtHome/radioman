# Broadcast Bot

## Installation

1. Install Node.js (latest version is preferable)
2. [Install FFmpeg](https://www.wikihow.com/Install-FFmpeg-on-Windows)
3. Clone the project
4. If you don't have Python 2.7 - [Install Python 2.7.15](https://www.python.org/downloads/release/python-2715/)
5. `npm install --prod` (or `yarn --prod` if you have Yarn)
6. Set up your Discord bot [here](https://discordapp.com/developers)
7. Set up `config.json`
8. Create music folder and place audiofiles inside
9. `npm start` (or `yarn start` if you have Yarn)

## Setting up a `config.json` file

```json
{
  "token": "your bot's access token goes right here",
  "roomId": "rooms id goes here",
  "volume": 0.5,
  "showSongName": true,
  "stream": "https://www.youtube.com/watch?v=QKYfTUTwowk"
}
```

`token`: String  
*Your bot's token.*

`roomId`: Number  
*Id of the channel the bot will try to enter into.*

`volume`: Number  
*Music's volume.*

`showSongName`: String (optional)  
*Enables showing the current's song filename. Works only when bot is playing the music from file system.*

`stream`: String (optional)
*Makes bot play audiotrack from this URL. Support Youtube only. Don't specify it if you want to play your music from `./music/` folder!*
