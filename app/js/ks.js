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
var attributes;
var numRiders;
var subways = [], dbSplines = [], splines = [];
var delta = 0.005;
var multiplier = 0.5;
var tangent = new THREE.Vector3();
var axis = new THREE.Vector3();
var up = new THREE.Vector3(0, 1, 0);
var particle, delay;
var PARTICLES_ACTIVE = false;
var FB_ACTIVE = false;
var AXIS_HELPER = false;
var BARTVR_ANIMATE = false;
var currentMessage = 0;
var emitter, particleGroup;
var clock = new THREE.Clock();
var NUM_PARTICLES = 1000;

var MESSAGES = [
    "SOUNDS OF THE SAN FRANCISCO UNDERGROUND",
    "A SOUND DISPLACEMENT MAP OF BART",
    "150,000 SAMPLES. 35 HOURS",
    "AVG 89 dB. MAX 129.7 dB",
    "125 dB === PAIN",
    "The transportation in Japan is so quiet...",
    "they ask you to turn off your phones",
    "Here in SF headphones are your only hope",
    "What a wonderful way to start and end a workday",
    " "];


function go() {
    BARTVR_ANIMATE = true;
    document.getElementById('BART').play();
    document.getElementById('go').style.visibility = "hidden";
    sound.play();

    dbLevels();

    setInterval(moveSubway, 100);

    setTimeout(function(){
        setInterval(changeMessage, 7500);
    }, 40000);
}


function changeMessage() {
    var msg = MESSAGES[currentMessage];
    if(msg) {
        $('.messages').html(msg);
        currentMessage++;
    }
}


function dbLevels() {
    dbs = setInterval(function () {
        console.log(DB_LEVELS[level]);
        if (FB_ACTIVE) {
            fb_db.transaction(function () {
                if (DB_LEVELS[level]) {
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

function generateSprite() {
    var canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    var context = canvas.getContext('2d');
    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
    gradient.addColorStop(1, 'rgba(0,0,0,1)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    return canvas;
}

function initParticles() {

    particleGroup = new SPE.Group({
        texture: {
            value: THREE.ImageUtils.loadTexture('./images/smoke_particle.png')
        }
    });

    emitter = new SPE.Emitter({
        maxAge: {
            value: 1
        },
        position: {
            value: new THREE.Vector3(0, 0.5, 0),
            spread: new THREE.Vector3( 0, 0, 0 )
        },

        acceleration: {
            value: new THREE.Vector3(0, 5, 0),
            spread: new THREE.Vector3( 0, 10, 0)
        },

        velocity: {
            value: new THREE.Vector3(0, 10, 0),
            spread: new THREE.Vector3(20, 7.5, 20)
        },

        color: {
            value: [ new THREE.Color('white'), new THREE.Color('red') ]
        },

        size: {
            value: 1
        },

        particleCount: NUM_PARTICLES
    });

    particleGroup.addEmitter( emitter );
}


function init() {

    fb = new Firebase("https://sf-noise.firebaseio.com/freq");
    fb_db = new Firebase("https://sf-noise.firebaseio.com/db");
    fb_riders = new Firebase("https://sf-noise.firebaseio.com/riders");
    numRiders = $('#numRiders');

    if (FB_ACTIVE) {
        fb_riders.on('value', function (data) {
            numRiders.html(data.numChildren());
        });
    }

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

    setupRoutes();
    initParticles();

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
        audioLoader.load('sound/sound.mp3', function (buffer) {
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
        if (FB_ACTIVE) {
            fb.transaction(function () {
                console.log(fr);
                return fr;
            });
        }
    }

    particleGroup.tick(dt);

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
            group.add(subwayMesh);
            group.add(particleGroup.mesh);

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