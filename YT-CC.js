const fs = require('fs');
const ytdl = require('ytdl-core');
// TypeScript: import ytdl from 'ytdl-core'; with --esModuleInterop
// TypeScript: import * as ytdl from 'ytdl-core'; with --allowSyntheticDefaultImports
// TypeScript: import ytdl = require('ytdl-core'); with neither of the above

/*
//cup of coffee
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
setInterval(function() {
    http.get(`https://yt-cc.herokuapp.com/`);
}, 300000);

*/





ytdl('https://www.youtube.com/watch?v=Vlnl0v3jayU', { filter: 'audioonly'})
  .pipe(fs.createWriteStream('video.mp3'));
