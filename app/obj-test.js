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
var subways = [], dbSplines = [], splines = [];

var FB_ACTIVE = false;

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
//    camera.position.set(0, 50, 150);
    camera.position.set(0, 50, 150);
    // scene
    scene = new THREE.Scene();
    var ambient = new THREE.AmbientLight(0x101030);
    scene.add(ambient);
    var directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    setupRoutes();

    material = new THREE.ShaderMaterial({
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent
    });

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

    loader.load('models/obj/sound_map.obj', function (object) {
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

    setInterval(moveSubway, 100);
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
            // TODO: Fix this.
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

        // create the twoway splines.
        for (var s = 0; s < twoWay.length; s++) {
            stop = twoWay[s];
            points.push(new THREE.Vector3(stop[0], stop[1], stop[2]));
        }
        splines.push(new THREE.SplineCurve3(points));
    }

    createSplines(splines, 100, true);

}

function createSplines(theSplines, numPoints, isSubway) {
    // 1 spline for each route.
    // create a geometry and material for each route


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
                    scene.add(vertLine);
                }
            }
        }

        var line = new THREE.Line(geometry, material);
        scene.add(line);

        material = new THREE.MeshBasicMaterial({
            color: isSubway ? route.subwayColor : SETUP.DB.color
        });

        var group = new THREE.Object3D();

        if (isSubway) {
            geometry = new THREE.BoxGeometry(1, 1, 1);
            var subwayMesh = new THREE.Mesh(geometry, material);
            group.add(subwayMesh);

            group.userData.normalizer = BART.longestRoute / route.routeLength;
            group.counter = 0;
            subways.push(group);
        } else {
            geometry = new THREE.BoxGeometry(5, 5, 5);
            var dbMesh = new THREE.Mesh(geometry, material);
            group.add(dbMesh);
            dbLevels.push(group);
        }
        scene.add(group);
    }
}

function moveSubway() {
    for (var i = 0; i < subways.length; i++) {
        var subway = subways[i];
        var radians;
        var dbLevel = dbLevels[i];
        if (subway.counter <= 1) {
            subway.position.copy(splines[i].getPointAt(subway.counter));
            var dbPoint = splines[i].getPointAt(subway.counter);

            dbLevel.position.copy(splines[i].getPointAt(subway.counter));
//                        dbLevel.position.setZ(dbSplines[i].getPointAt(subway.counter / 2));
            tangent = splines[i].getTangentAt(subway.counter).normalize();

            axis.crossVectors(up, tangent).normalize();

            radians = Math.acos(up.dot(tangent));

            subway.quaternion.setFromAxisAngle(axis, radians);
//                        dbLevel.quaternion.setFromAxisAngle(axis, radians);

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