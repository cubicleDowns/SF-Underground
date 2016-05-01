var container;
var theta = 0;
var radius = 150;
var camera, scene, renderer, material;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var sound, analyser, listener;
var obj;
var fb, fb_db, fb_riders;
var dbs;
var level = 0;
var uniforms, attributes;
var numRiders;

var FB_ACTIVE = true;

function dbLevels() {
    dbs = setInterval(function(){
        console.log(DB_LEVELS[level]);
        if(FB_ACTIVE){
            fb_db.transaction(function(){
                if(DB_LEVELS[level]){
                    dbs = DB_LEVELS[level];
                    level++;
                    return dbs;
                } else {
                    return 0;
                }
            });
        }
    }, 1000);
}

function init() {


    fb = new Firebase("https://sf-noise.firebaseio.com/freq");
    fb_db = new Firebase("https://sf-noise.firebaseio.com/db");
    fb_riders = new Firebase("https://sf-noise.firebaseio.com/riders");
    numRiders = $('#numRiders');


    fb_riders.on('value', function(data){
//        console.log('num riders', data.numChildren());
        numRiders.html(data.numChildren());
    });

    container = document.createElement('div');
    document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0, 50, 150);
    // scene
    scene = new THREE.Scene();
    var ambient = new THREE.AmbientLight(0x101030);
    scene.add(ambient);
    var directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

//    // create a wireframe material
//    material = new THREE.MeshBasicMaterial({
//        color: 0xb7ff00,
//        wireframe: true
//    });


    material = new THREE.ShaderMaterial({
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent
    });


//    attributes = {
//        displacement: {
//            type: 'f', // a float
//            value: [] // an empty array
//        }
//    };
//
//    uniforms = {
//        amplitude: {
//            type: 'f', // a float
//            value: 0
//        }
//    };
//
//    // create the sphere's material
//    var material = new THREE.ShaderMaterial({
//        uniforms:     	uniforms,
//        attributes:     attributes,
//        vertexShader:   $('#vertexshader').text(),
//        fragmentShader: $('#fragmentshader').text()
//    });


    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };
    var texture = new THREE.Texture();
    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };
    var onError = function (xhr) {
    };

    var loader = new THREE.OBJLoader(manager);
    var listener = new THREE.AudioListener();
    camera.add(listener);

    loader.load('models/obj/OBJ_NO_BOTTOM_PLANE_REDUCED3.obj', function (object) {
        obj = object.children[0];
        obj.material = material;
        obj.scale.set(10, 10, 10);
        obj.position.set(-50, 0, -50);

        sound = new THREE.PositionalAudio( listener );
        audioLoader.load( 'sound/sound.wav', function( buffer ) {
            sound.setBuffer( buffer );
            sound.setRefDistance( 20 );
            sound.setVolume(0);
            scene.add(obj);
            analyser = new THREE.AudioAnalyser( sound, 32 );
        });

    }, onProgress, onError);

    var audioLoader = new THREE.AudioLoader();

//    var testmat = new THREE.MeshBasicMaterial({
//        color: 0xFFFFFF
//    });
//    var geometry = new THREE.BoxGeometry(4, 4, 4);
//    var mesh = new THREE.Mesh(geometry, testmat);
//    scene.add(mesh);
//    var axisHelper = new THREE.AxisHelper(5);
//    scene.add(axisHelper);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    //
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {

    if(BARTVR_ANIMATE){
        theta += 0.1;
        camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta));
        camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta));
        var fr = analyser.getAverageFrequency() / 256;
//        uniforms.amplitude.value = analyser.getAverageFrequency();
        if(FB_ACTIVE){
            fb.transaction(function(){
                console.log(fr);
                return fr;
            });
        }
    }
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}