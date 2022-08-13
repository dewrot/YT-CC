const https = require('https');
const ytdl = require('ytdl-core');
const prism = require('prism-media');
const dfpwm = require('dfpwm');
var http = require('http');
var StringDecoder = require('string_decoder').StringDecoder;


var server = http.createServer(function(req,res){
  var decoder = new StringDecoder('utf-8');
  var buffer1 = '';
  req.on('data',function(data){
    buffer1 += decoder.write(data);
  });
  req.on('end',async function(){
    buffer1 += decoder.end();
    
    if (buffer1 == ''){
      console.log('');
      //console.log(timeStamp);
      console.log('Received empty payload, IGNORING!');
      console.log('');
      res.end('YT-CC is online.');
    } else {
    let vidURL = buffer1;
    console.log('');
    //console.log(timeStamp);
    console.log('Request recieved with this payload:',buffer1);
    var result = await runThings(vidURL);
    res.end(result);
    console.log('Response sent!');
    console.log('Response:',result);
    console.log('');
    };
  });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('');
    console.log(`Our app is running on port ${ PORT }`);
    console.log('');
});

/*
server.listen(3000,function(){
  console.log('');
  console.log(`The server is listening on port 3000 now`);
  console.log('');
});
*/
//cup of coffee
setInterval(function() {
  https.get(`https://yt-cc.herokuapp.com/`);
}, 300000);


async function makeRequest(vidURL) {
    return await new Promise((resolve, reject) => {
        const transcoder = new prism.FFmpeg({
            args: [
              '-analyzeduration', '0',
              '-loglevel', '0',
              '-f', 's8',
              '-ar', '48000',
              '-ac', '1',
              '-filter', 'volume=0.35',
            ]
           })
        ytdl(vidURL, { filter: 'audioonly'})
        .pipe(transcoder)
        .pipe(new dfpwm.Encoder())
        .pipe(https.request("https://tempfiles.ninja/api/upload", {
          method: "POST",
          headers: {"Content-Type": "application/octet-stream"}
        }, res => {
          
          let chunks = [];
          res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
          res.on('error', (err) => reject(err));
          res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        }));
    });
  }

  async function runThings(vidURL) {
      console.log('Attempting download of:',vidURL)
      var data = JSON.parse(await makeRequest(vidURL));

      console.log('File uploaded...')
      const dlURL = await data.download_url
      return dlURL;
  }
