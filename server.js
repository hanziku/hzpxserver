
/* set up apache service
https://hackmd.io/@EttaWang0118/rktS4fjVu
*/
const http=require('http');
const url=require('url')
const svg2img=require('svg2img');

//copy from hzpx-engine/hzpxnode.cjs to here

const  Hzpx=require( './hzpxnode.cjs');
//deply to https://nissaya.cn/hzpx/?g=初衤礻   
//  /home/lighthouse/hzpxserver
// apache port forwarding
// sudo systemctl restart hzpx
const fs=require('fs');

const raw=fs.readFileSync(__dirname+'/glyphwiki-dump.txt');
Hzpx.setFontTSV(raw);

//create a server object:
http.createServer(function (req, res) {
  const query=url.parse(req.url,true).query;
  if (query.g) {
    const data=Hzpx.drawPinx(query.g)[0];
    //5. Convert to jpeg file
    svg2img(data, { format: 'jpg', 'quality': 75 }, function(error, buffer) {
      //default jpeg quality is 75
      res.writeHead(200, {"Content-Type": "image/jpg"});
      res.write(buffer);
      res.end();
  })

  } else {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write('error request'); //write a response to the client
    res.end(); //end the response
  }
  
  
}).listen(5080); //the server object listens on port 8080