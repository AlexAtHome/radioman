# Broadcast Bot

## Installation

1. Install Node.js (latest version is preferable)
2. Install FFmpeg ([For Windows 10](https://www.wikihow.com/Install-FFmpeg-on-Windows))
3. Clone the project
4. `npm install --prod` (or `yarn --prod` if you have Yarn)
5. Set up your Discord bot [here](https://discordapp.com/developers)
6. Set up `config.json` (or `Environmental variables` on hosting)
7. If you are using a stream, then step 8 can be skipped
8. Create folder `"music"` and place audiofiles inside
9. `npm start` (or `yarn start` if you have Yarn)

## Setting up `config.json` file (or `Environmental variables` on hosting)

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

`volume`: Number (optional)
*Music's volume from `0` to `1`. Default value is `1`.*

`showSongName`: String (optional)  
*Enables showing the current's song filename. Works only when bot is playing the music from file system.*

`stream`: String (optional)
*Makes bot play audiotrack from this URL. Support Youtube only. Don't specify it if you want to play your music from `./music/` folder!*
