var container;
var theta = 0;
var radius = 120;
var camera, scene, renderer, material;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var sound, analyser, listener;
var obj;
var fb_freq, fb_db, fb_riders, fb_start;
var dbs;
var level = 0;
var attributes;
var numRiders;
var subways = [], dbSplines = [], splines = [];
var delta = 0.005;
var multiplier = 0.1;
var tangent = new THREE.Vector3();
var axis = new THREE.Vector3();
var up = new THREE.Vector3(0, 1, 0);
var particle, delay;
var PARTICLES_ACTIVE = false;
var FB_ACTIVE = true;
var AXIS_HELPER = false;

var FB_URL = "YOUR_URL_HERE";


// starts the BART animation on 'play' click
var BARTVR_ANIMATE = false;
var currentMessage = 0;
var emitter, particleGroups = [], emitters = [];
var clock = new THREE.Clock();
var NUM_PARTICLES = 200;

var GLITCH_MODE_STARTED = false;

var SHOW_SUBWAY = false;


var MESSAGES = [
    "FIGURE OUT YOUR OWN MESSAGE",
    "FIGURE OUT YOUR OWN MESSAGE",
    " ",
    "",
    "FIGURE OUT YOUR OWN MESSAGE",
    "FIGURE OUT YOUR OWN MESSAGE",
    "",
    " ",
    " ",
    "FIGURE OUT YOUR OWN MESSAGE",
    " ",
    "THIS IS HOW YOU PAUSE",
    " "];


function go() {
    BARTVR_ANIMATE = true;
    document.getElementById('BART').play();
    document.getElementById('go').style.visibility = "hidden";
    // document.getElementById('numRiders').style.visibility = "hidden";

    sound.play();

    dbLevels();

    setInterval(moveSubway, 25);

    // limit visual changes.
    setTimeout(function () {
        setInterval(changeMessage, 7500);
    }, 40000);
}


// part of the presentation
function changeMessage() {
    var msg = MESSAGES[currentMessage];
    if (msg) {
        $('.messages').html(msg);
        currentMessage++;
    }
}

// define some db levels.  set the particle visuals based upon DB leve.  
// - subtle so as not to distract from mobile experience.
function dbLevels() {
    var db;
    var dbLevel = $('#dbs');

    var slow = {
        accel: new THREE.Vector3(0, 0.1, 0),
        velocity: new THREE.Vector3(0.3, 0.3, 0.3),
        spread: new THREE.Vector3(1, 1, 1),
        opacity: 0.5
    };

    var mid = {
        accel: new THREE.Vector3(0.5, 0.5, 0.5),
        velocity: new THREE.Vector3(0.7, 0.7, 0.7),
        spread: new THREE.Vector3(3, 3, 3),
        opacity: 0.7
    };

    var fast = {
        accel: new THREE.Vector3(1, 1, 1),
        velocity: new THREE.Vector3(2, 2, 2),
        spread: new THREE.Vector3(8, 8, 8),
        opacity: 1.0
    };

    dbs = setInterval(function () {

        var particleColors = [];

        var colorSet = [];

        if (DB_LEVELS[level]) {
            db = DB_LEVELS[level];
            level++;
        } else {
            db = 0;
        }
        if (FB_ACTIVE) {

            fb_db.transaction(function () {
                return parseInt(db, 10);
            });
            if (db === 76.666) {
                GLITCH_MODE_STARTED = true;
                fb_start.transaction(function () {
                    return true;
                });
            }
        }

        var particleColors = [
            "#770810", // redish     0
            "#140581", // dark blue  1
            "#780568", // purplish   2
            "#000000", // black      3
            "#FFFFFF", // white      4
            "#FF0000", // red        5
        ];

        for (var i = 0; i < emitters.length; i++) {
            console.log(emitters[i].activeMultiplier);
            emitters[i].activeMultiplier = db / 60;
            dbLevel.html(parseInt(db, 10));
            if (db >= 105) {
//                console.log(db, '> 105');
                emitters[i].color.value[0].setStyle(particleColors[5]);
                emitters[i].color.value[1].setStyle(particleColors[1]);
                emitters[i].acceleration.value = fast.accel;
                emitters[i].acceleration.spread = fast.spread;
                emitters[i].velocity.value = fast.velocity;
                emitters[i].velocity.spread = fast.spread;
                emitters[i].opacity.value[0] = fast.opacity;
                emitters[i].opacity.value[1] = fast.opacity;
                emitters[i].size.value = 4;
            } else if (db < 105 && db >= 80) {
                // console.log(db, '80 - 100');
                emitters[i].color.value[0].setStyle(particleColors[2]);
                emitters[i].color.value[1].setStyle(particleColors[1]);
                emitters[i].acceleration.value = mid.accel;
                emitters[i].acceleration.spread = mid.spread;
                emitters[i].velocity.value = mid.velocity;
                emitters[i].velocity.spread = mid.spread;
                emitters[i].opacity.value[0] = mid.opacity;
                emitters[i].opacity.value[1] = mid.opacity;
                emitters[i].size.value = 3;
            } else {
                // console.log(db, 'below 80');
                emitters[i].color.value[0].setStyle(particleColors[2]);
                emitters[i].color.value[1].setStyle(particleColors[2]);
                emitters[i].acceleration.value = slow.accel;
                emitters[i].acceleration.spread = slow.spread;
                emitters[i].velocity.value = slow.velocity;
                emitters[i].velocity.spread = slow.spread;
                emitters[i].opacity.value[0] = slow.opacity;
                emitters[i].opacity.value[1] = slow.opacity;
                emitters[i].size.value = 2.5;
            }
            emitters[i].acceleration.value = emitters[i].acceleration.value;
            emitters[i].velocity.value = emitters[i].velocity.value;
            emitters[i].color.value = emitters[i].color.value;
            emitters[i].opacity.value = emitters[i].opacity.value;
            emitters[i].size.value = emitters[i].size.value;

        }
    }, 1000);
}


function createParticleGroups() {
    for (var i = 0; i < BART.routes.length; i++) {
        particleGroups.push(initParticles());
    }
}
function initParticles() {

    // TODO: blog reference for particles
    var pg = new SPE.Group({
        texture: {
            value: THREE.ImageUtils.loadTexture('./images/smoke_particle.png')
        }
    });

    emitter = new SPE.Emitter({
        maxAge: {
            value: 1.5
        },
        position: {
            value: new THREE.Vector3(0, 0, 0),
            spread: new THREE.Vector3(5, 5, 5)
        },

        acceleration: {
            value: new THREE.Vector3(1, 3, 1),
            spread: new THREE.Vector3(25, 25, 25)
        },

        velocity: {
            value: new THREE.Vector3(4, 4, 4),
            spread: new THREE.Vector3(25, 25, 25)
        },

        color: {
            value: [new THREE.Color('white'), new THREE.Color('red')]
        },

        size: {
            value: 3
        },

        particleCount: NUM_PARTICLES,
        activeMultiplier: 0
    });

    emitters.push(emitter);
    pg.addEmitter(emitter);
    return pg;
}


function init() {

    fb_freq = new Firebase(FB_URL + "/freq");
    fb_start = new Firebase(FB_URL + "/start");
    fb_db = new Firebase(FB_URL + "/db");
    fb_riders = new Firebase(FB_URL +  + "/riders");
    numRiders = $('#numRiders');

    if (FB_ACTIVE) {
        fb_riders.on('value', function (data) {
            numRiders.html(data.numChildren());
        });
    }

    container = document.createElement('div');
    document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0, 50, 120);

    // scene
    scene = new THREE.Scene();
    var ambient = new THREE.AmbientLight(0x101030);
    scene.add(ambient);

    var directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    setupRoutes();
    createParticleGroups();

    material = new THREE.ShaderMaterial({
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent
    });

    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

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

    loader.load('models/obj/sound_map.obj', function (object) {
        obj = object.children[0];
        obj.material = material;
        obj.scale.set(10, 10, 10);
        obj.position.set(-50, 0, -50);

        sound = new THREE.PositionalAudio(listener);
        audioLoader.load('sound/web.mp3', function (buffer) {
            sound.setBuffer(buffer);
            sound.setRefDistance(20);
            sound.setVolume(0);
            scene.add(obj);
            analyser = new THREE.AudioAnalyser(sound, 32);
            createSplines(splines, 100, true);

        });

    }, onProgress, onError);


    if (AXIS_HELPER) {
        var axisHelper = new THREE.AxisHelper(20);
        scene.add(axisHelper);
    }

    var audioLoader = new THREE.AudioLoader();

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

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
    render(clock.getDelta());
}

function render(dt) {
    if (BARTVR_ANIMATE) {
        theta += 0.1;
        camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta));
        camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta));

        var fr = analyser.getAverageFrequency() / 256;
        console.log(fr);
        if (FB_ACTIVE) {
            fb_freq.transaction(function () {
                return fr;
            });
        }
    }

    for (var i = 0; i < particleGroups.length; i++) {
        particleGroups[i].tick(dt);
    }

    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}

function setupRoutes() {
    // parse each route and create a spline from the cartesian coordinates.
    for (var r = 0; r < BART.routes.length; r++) {

        /**
         * @type {Object}
         */
        var route = BART.routes[r];

        // lets create a looped route so the "subway" never stops moving.
        /**
         * @type {Array.<T>}
         */
        var returnRouteStops = angular.copy(route.stops).reverse();
        returnRouteStops.shift();
        returnRouteStops.pop();
        var twoWay = route.stops.concat(returnRouteStops);
        var points = [];
        var elevatedPoints = [];
        var stop;
        var factor = 10;
        var halfLength = route.stops.length / 2;
        for (var q = 0; q < route.stops.length; q++) {

            // janky as fuck
            var z = q;
            if (q > halfLength) {
                z = route.stops.length - q;
            }
            stop = route.stops[q];
            if (q === 0 || q === route.stops.length - 1) {
                z = 0;
            }
            elevatedPoints.push(new THREE.Vector3(stop[0], stop[1], z * factor));
        }
        dbSplines.push(new THREE.SplineCurve3(elevatedPoints));

        // glorious glorious tweaking
        var offsetX = 51;
        var offsetZ = -67;
        var scale = 8.6;

        // create the twoway splines.
        for (var s = 0; s < twoWay.length; s++) {
            stop = twoWay[s];
            points.push(new THREE.Vector3((stop[0] / scale) - offsetX, 2.0, (stop[1] / -scale) - offsetZ));
        }
        splines.push(new THREE.SplineCurve3(points));
    }
}

function createSplines(theSplines, numPoints, isSubway) {

    var splinesGroup = new THREE.Object3D();

    for (var j = 0; j < theSplines.length; j++) {
        var route = BART.routes[j];
        var material = new THREE.LineBasicMaterial({
            color: isSubway ? route.color : SETUP.DB.color
        });
        var geometry = new THREE.Geometry();
        var splinePoints = theSplines[j].getPoints(numPoints);
        for (var i = 0; i < splinePoints.length; i++) {
            geometry.vertices.push(splinePoints[i]);
            if (!isSubway) {
                if (i != 0 || i != splinePoints.length - 1) {
                    var lineGeometry = new THREE.Geometry();
                    lineGeometry.vertices.push(splinePoints[i]);
                    lineGeometry.vertices.push(new THREE.Vector3(splinePoints[i].x, splinePoints[i].y, 0));
                    var vertLine = new THREE.Line(lineGeometry, material);
                    splinesGroup.add(vertLine);
                }
            }
        }

        var line = new THREE.Line(geometry, material);
        line.visible = false;
        scene.add(line);


        //TODO: add particle emitters here
        material = new THREE.MeshBasicMaterial({
            color: route.subwayColor,
            alpha: true
        });

        var group = new THREE.Object3D();

        if (isSubway) {
            geometry = new THREE.BoxGeometry(1, 1, 1);
            var subwayMesh = new THREE.Mesh(geometry, material);

            if (!SHOW_SUBWAY) {
                subwayMesh.visible = false;
            }
            group.add(subwayMesh);
            group.add(particleGroups[j].mesh);
            group.userData.normalizer = BART.longestRoute / route.routeLength;
            group.counter = 0;
            subways.push(group);
        }

        scene.add(group);
    }
    scene.add(splinesGroup);
}

function moveSubway() {
    for (var i = 0; i < subways.length; i++) {
        var subway = subways[i];
        var radians;
        if (subway.counter <= 1) {
            subway.position.copy(splines[i].getPointAt(subway.counter));
            tangent = splines[i].getTangentAt(subway.counter).normalize();

            /**
             * `normalizer` is the current track / longest track.
             * the spline length is normalized so we need to modify the
             * length of arc movement.
             *
             * @type {number}
             */
            subway.counter = subway.counter + (delta * multiplier * subway.userData.normalizer);
        } else {
            subway.counter = 0;
        }
    }
}