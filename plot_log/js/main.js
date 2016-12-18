
var zmax = 100;
var zmin = 0;
var onedayx = 1500;

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

//var geometry = new THREE.BoxGeometry( 1, 1, 1 );
//var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );

//var cube = new THREE.Mesh( geometry, material );
//scene.add( cube );
camera.position.z = 5;

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
    //return lines.map(module.exports);
}

var font = undefined;
//3d init

function drawTextOnCanvas(text){
    var canvas = document.createElement("canvas");
    canvas.width = 128*16;
    canvas.height = 32*4;
    var xc = canvas.getContext("2d");
    xc.fillStyle="#FFFFFF";
    //macでない場合どうなる?
    xc.font = "12pt ヒラギノ角ゴ";
    xc.fillText(text, 10, canvas.height/2+10);
    return canvas;
}

var pos_counter = 0;
var pos_div = 5;
var pos_diffy = 10;

function plot_log(origin_time, d){
    if(! ('time_local' in d)){
        return;
    }
    var elapsed_msec = d.time_local.getTime() - origin_time;
    var x = elapsed_msec*onedayx/(24*60*60*1000);
    var y = 0;
    var z = 0;
    var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    //y = pos_diffy*((pos_counter++)%pos_div);
    cube.position.set(x, y, z);
    scene.add( cube );
    // var text = new THREE.TextGeometry(d.original, { font: font });
    // var text_material = new THREE.MeshPhongMaterial( { color: 0xffff00 } );
    // var tt = new THREE.Mesh(geometry, material);
    // tt.position.set(x, y, z);
    // scene.add(tt);

    var canvas = drawTextOnCanvas(d.original);
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    var material = new THREE.SpriteMaterial({map: texture});
    var sprite = new THREE.Sprite(material);
    sprite.scale.set(16, 1, 1);
    sprite.position.set(x, y, z);
    scene.add(sprite);
}

scene.add(buildAxes(1000));
var loader = new THREE.FontLoader();
loader.load('js/fonts/helvetiker_regular.typeface.json', function(response){
    font = response;
    d3.text('http://localhost:8000/plot_log/data/access.log').get(
        function(d){ var parsed = row(d);
                     var origin_date = parsed[0].time_local.getTime();
                     for(var i = 0; i < parsed.length; i++){
                         plot_log(origin_date, parsed[i]);
                     }
                   });
});
