
// var zmax = 100;
// var zmin = 0;
var ymax = 200;
var onedayx = 600;
var pos_counter = 0;
var pos_div = 5;
var pos_diffx = 10;
var pos_diffz = 15;

var box_size = 3;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
var control = new THREE.OrbitControls(camera);

var light = new THREE.AmbientLight(0x888888);
scene.add(light);
light = new THREE.DirectionalLight(0x888888, 1.0);
light.position.set(10, 10, 0);
scene.add(light);
scene.add(buildAxes(1000));

{
    var canvas = drawTextOnCanvas("Hour: 24:00", "#FFFFFF", 128, 32);
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    var material = new THREE.SpriteMaterial({map: texture});
    var sprite = new THREE.Sprite(material);
    sprite.scale.set(16, 16, 1);
    sprite.position.set(12*pos_diffx, 0, 0);
    scene.add(sprite);
}
{
    var canvas = drawTextOnCanvas("Hour: 0:00", "#FFFFFF", 128, 32);
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    var material = new THREE.SpriteMaterial({map: texture});
    var sprite = new THREE.Sprite(material);
    sprite.scale.set(16, 16, 1);
    sprite.position.set(-12*pos_diffx, 0, 0);
    scene.add(sprite);
}
{
    var canvas = drawTextOnCanvas("Min: 0", "#FFFFFF", 128, 32);
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    var material = new THREE.SpriteMaterial({map: texture});
    var sprite = new THREE.Sprite(material);
    sprite.scale.set(16, 16, 1);
    sprite.position.set(0, ymax, 0);
    scene.add(sprite);
}
{
    var canvas = drawTextOnCanvas("Min: 60", "#FFFFFF", 128, 32);
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    var material = new THREE.SpriteMaterial({map: texture});
    var sprite = new THREE.Sprite(material);
    sprite.scale.set(16, 16, 1);
    sprite.position.set(0, -ymax, 0);
    scene.add(sprite);
}

camera.position.set(-20, 10, 20);
//var font = undefined;

function render() {
    requestAnimationFrame( render );
    control.update();
    renderer.render( scene, camera );
}
render();

function parse(d){
    var result = parse_clf(d);
    result.original = d;
    return result; 
}

function row(txt){
    return txt.split("\n").map(parse);
}

function drawTextOnCanvas(text, style, width, height){
    var canvas = document.createElement("canvas");
    canvas.width = typeof width === "undefined" ? 128*16 : width;
    canvas.height = typeof height === "undefined" ? 32*4 : height;
    var xc = canvas.getContext("2d");
    if(typeof style === "undefined"){
        style = "#FFFFFF";
    }
    xc.fillStyle=style;
    //macでない場合どうなる?
    xc.font = "12pt Arial";
    xc.fillText(text, 10, canvas.height/2+10);
    return canvas;
}

var first_date;
var dt;
var origin_date;

function plot_log(origin_time, d){
    if(! ('time_local' in d)){
        return;
    }
    if(d.original.indexOf("munin") !== -1 || d.original.indexOf("/jenkins") !== -1){
        return;
    }
    //var elapsed_msec = d.time_local.getTime() - origin_time;
    //var x = elapsed_msec*onedayx/(24*60*60*1000) - onedayx/2;
    // var elapsed_msec = d.time_local.getHours()*60*60*1000
    //     + d.time_local.getMinutes()*60*1000
    //     + d.time_local.getSeconds()*1000;
    // var x = elapsed_msec * onedayx/(24*60*60*1000) - onedayx/2;

    var elapsed_msec = 
        + d.time_local.getMinutes()*60*1000
        + d.time_local.getSeconds()*1000;
    //var x = elapsed_msec * onedayx/(24*60*60*1000) - onedayx/2;
    var y = elapsed_msec * 2*ymax/(60*60*1000) - ymax;
    var x = d.time_local.getHours()*pos_diffx - 12*pos_diffx;
    var z = moment(d.time_local).diff(moment(origin_time), 'days')*pos_diffz*-1;

    var geometry = new THREE.BoxGeometry(box_size, box_size, box_size);
    var botcolor = 0xF660AB;
    var spidercolor = 0x6C2DC7;
    var nonbotcolor = 0x00ff00;
    var jenkinscolor = 0xc0c0c0;
    var color;
    if(d.http_user_agent != undefined && d.http_user_agent.indexOf('bot') !== -1){
        color = botcolor;
    }
    else if(d.http_user_agent != undefined && d.http_user_agent.indexOf('spider') !== -1){
        color = spidercolor;
    }
    else if(d.path != undefined && d.path.indexOf('/jenkins') !== -1){
        color = jenkinscolor;
    }
    else {
        color = nonbotcolor;
    }
    
    var material = new THREE.MeshPhongMaterial( { color: color } );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.set(x, y, z);
    scene.add(cube);
    // if(z > 0){
    //     var canvas = drawTextOnCanvas(d.original);
    //     var texture = new THREE.Texture(canvas);
    //     texture.needsUpdate = true;
    //     var material = new THREE.SpriteMaterial({map: texture});
    //     var sprite = new THREE.Sprite(material);
    //     sprite.scale.set(32*4, 2*4, 1);
    //     sprite.position.set(x, y, z);
    //     scene.add(sprite);
    // }
}

var loader = new THREE.FontLoader();
// loader.load('js/fonts/helvetiker_regular.typeface.json', function(response){
//     font = response;
d3.text('http://localhost:8000/plot_log/data/all.log').get(
    function(d){ var parsed = row(d);
                 parsed.sort(function(a,b) { return a.time_local - b.time_local; });
                 console.log(parsed[0]);
                 first_date = parsed[0].time_local;
                 dt = new Date(1900+first_date.getYear(), first_date.getMonth(), first_date.getDate());
                 origin_date = dt.getTime();
                 for(var i = 0; i < parsed.length; i++){
                     plot_log(origin_date, parsed[i]);
                 }
               });
//});
