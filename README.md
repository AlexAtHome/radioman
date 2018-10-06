# Discord Podcaster

## Installation

1. Install Node.js (latest version is preferable)
2. [Install FFmpeg](https://www.wikihow.com/Install-FFmpeg-on-Windows)
3. Clone the project
4. If you don't have Python 2.7 - [Install Python 2.7.15](https://www.python.org/downloads/release/python-2715/)
5. `npm install` (or `yarn` if you have Yarn)
6. Set up your Discord bot [here](https://discordapp.com/developers)
7. Set up `config.json`
8. Create `music` folder and place `.mp3`-files inside
9. `npm run start`

## Setting up a `config.json` file

```json
{
  "token": "your bot's access token goes right here",
  "roomId": "rooms id goes here",
  "volume": 0.5,
  "showSongName": true
}
```

`token`: String  
*Your bot's token.*

`roomId`: Number  
*Id of the channel the bot will try to enter into.*

`volume`: Number  
*Music's volume.*

`showSongName`: String  
*Enables showing the current's song filename.*
