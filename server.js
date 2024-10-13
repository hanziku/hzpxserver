
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

const resizeSVG=(svg,size=64)=>svg.replace(/(width|height)=\"\d+\"/g,(m,m1,m2)=>m1+'="'+size+'"');
const patchColor=(svg,color)=>svg.replace(/fill="black"/g,'fill="'+color+'"');
console.log('server started')
//create a server object:
http.createServer(function (req, res) {
  const query=url.parse(req.url,true).query;
  if (query.derive) {
    const out=(Hzpx.derivedOf(query.derive)||[]).join('');
    res.writeHead(200, {"Content-Type": "text/plain","Access-Control-Allow-Origin":"*"});
    res.write(out);
    res.end();
  }
  else if (query.component) {
    const out=Hzpx.componentsOf(query.component).join('');
    res.writeHead(200, {"Content-Type": "text/plain","Access-Control-Allow-Origin":"*"});
    res.write(out);
    res.end();
  }
  else if (query.g) {
    let svg=Hzpx.drawPinx(query.g)[0];
    //5. Convert to jpeg file
    if (query.size) svg=resizeSVG( svg,parseInt(query.size)||24);
    if (query.color) svg=patchColor( svg,query.color);
    if (query.svg) {
      res.writeHead(200, {"Content-Type": "image/svg","Access-Control-Allow-Origin":"*"});
      res.write(svg);
      res.end();
    } else {
      svg2img(svg, { format: 'jpg', 'quality': 75 }, function(error, buffer) {
        //default jpeg quality is 75
        res.writeHead(200, {"Content-Type": "image/jpg","Access-Control-Allow-Origin":"*"});
        res.write(buffer);
        res.end();
      })
    }
  } else {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write('error request'); //write a response to the client
    res.end(); //end the response
  }
  
  
}).listen(5080); //the server object listens on port 8080