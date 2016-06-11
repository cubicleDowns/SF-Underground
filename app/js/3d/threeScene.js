angular.module('SFUnderground.3D.scene', [])
    .factory('THREE_SCENE', [
        'BART',
        'SETUP',
        'SCENE',
        function (BART, SETUP, SCENE) {
            var controls,
                heatmapInstance,
                heatMapConfig = {},
                renderer,
                gltf,
                scene,
                camera,
                spot1,
                subways = [],
                dbLevels = [],
                dbSplines = [],
                splines = [];

            function loadCollada() {
                var loader = new THREE.ColladaLoader();
//                loader.setCrossOrigin( '' );

                loader.load(
                    // resource URL
                    './models/collada/bart_sounds.dae',
                    // Function when resource is loaded
                    function ( collada ) {
//                        collada.scene.traverse( function ( child ) {
//
//                            if ( child instanceof THREE.SkinnedMesh ) {
//
//                                var animation = new THREE.Animation( child, child.geometry.animation );
//                                animation.play();
//
//                                camera.lookAt( child.position );
//
//                            }
//
//                            debugger;
//
//                        } );

                        collada.scene.scale.set(1,1,1);
                        collada.scene.rotation.x = Math.PI / 2;
                        scene.add( collada.scene );

                    },
                    // Function called when download progresses
                    function ( xhr ) {
                        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
                    }
                );
            }



            function loadglTF() {
                var sceneInfo = SCENE[1];
                var url = sceneInfo.url;

                var r = eval("/" + '\%s' + "/g");
//                var dir = useMaterialsExtension ? 'glTF-MaterialsCommon' : 'glTF';
//                url = url.replace(r, dir);

                loader.load(url, function (data) {

                    gltf = data;

                    var object = gltf.scene;

//                    var loadEndTime = Date.now();


                    if (sceneInfo.cameraPos)
                        camera.position.copy(sceneInfo.cameraPos);

                    if (sceneInfo.center) {
                        orbitControls.target.copy(sceneInfo.center);
                    }

                    if (sceneInfo.objectPosition) {
                        object.position.copy(sceneInfo.objectPosition);

                        if (spot1) {
                            spot1.position.set(sceneInfo.objectPosition.x - 100, sceneInfo.objectPosition.y + 200, sceneInfo.objectPosition.z - 100);
                            spot1.target.position.copy(sceneInfo.objectPosition);
                        }
                    }

                    if (sceneInfo.objectRotation)
                        object.rotation.copy(sceneInfo.objectRotation);

                    if (sceneInfo.objectScale)
                        object.scale.copy(sceneInfo.objectScale);
//
//                    cameraIndex = 0;
//                    cameras = [];
//                    cameraNames = [];

//                    if (gltf.cameras && gltf.cameras.length) {
//
//                        var i, len = gltf.cameras.length;
//
//                        for (i = 0; i < len; i++) {
//
//                            var addCamera = true;
//                            var cameraName = gltf.cameras[i].parent.name;
//
//                            if (sceneInfo.cameras && !(cameraName in sceneInfo.cameras)) {
//                                addCamera = false;
//                            }
//
//                            if (addCamera) {
//                                cameraNames.push(cameraName);
//                                cameras.push(gltf.cameras[i]);
//                            }
//
//                        }
//
////                        updateCamerasList();
////                        switchCamera(1);
//
//                    }
//                    else {
//
//                        updateCamerasList();
//                        switchCamera(0);
//                    }

//                    if (gltf.animations && gltf.animations.length) {
//
//                        var i, len = gltf.animations.length;
//                        for (i = 0; i < len; i++) {
//                            var animation = gltf.animations[i];
//                            animation.loop = true;
//                            // There's .3333 seconds junk at the tail of the Monster animation that
//                            // keeps it from looping cleanly. Clip it at 3 seconds
//                            if (sceneInfo.animationTime)
//                                animation.duration = sceneInfo.animationTime;
//                            animation.play();
//                        }
//                    }
                    scene.add(object);
//                    onWindowResize();

                });


            }

            var tangent = new THREE.Vector3();
            var axis = new THREE.Vector3();
            var up = new THREE.Vector3(0, 1, 0);

            var delta = 0.005;
            var multiplier = 1;
            var clock = new THREE.Clock();

            var cameraType = SETUP.CAMERA.TYPE;

            var heatmapContainer = $('#heatmap');

            /**
             * @param {number} num
             */
            function setMultiplier(num) {
                multiplier = parseInt(num, 10) || SETUP.MULTIPLIER || 1;
            }

            function setCameraType() {
                if (cameraType === "PERP") {
                    camera.toOrthographic();
                    cameraType = "ORTHO";
                    heatmapContainer.show();
                    camera.position.set(SETUP.CAMERA.ORTHO.POSITION.x, SETUP.CAMERA.ORTHO.POSITION.y, SETUP.CAMERA.ORTHO.POSITION.z);
                    camera.rotation.set(SETUP.CAMERA.ORTHO.ROTATION.x, SETUP.CAMERA.ORTHO.ROTATION.y, SETUP.CAMERA.ORTHO.ROTATION.z, SETUP.CAMERA.ORTHO.ROTATION.order);
                    camera.up.set(1, 0, 0);

                } else {

                    camera.toPerspective();
                    camera.position.set(SETUP.CAMERA.PERP.POSITION.x, SETUP.CAMERA.PERP.POSITION.y, SETUP.CAMERA.PERP.POSITION.z);
                    camera.rotation.set(SETUP.CAMERA.PERP.ROTATION.x, SETUP.CAMERA.PERP.ROTATION.y, SETUP.CAMERA.PERP.ROTATION.z, SETUP.CAMERA.PERP.ROTATION.order);
                    cameraType = "PERP";
                    heatmapContainer.hide();
                }
            }


            function setupScene() {

                renderer = new THREE.WebGLRenderer({ alpha: true });
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(window.innerWidth, window.innerHeight);

                document.body.appendChild(renderer.domElement);
                scene = new THREE.Scene();

//                var ambient = new THREE.AmbientLight(0xFFFFFF);
//                scene.add(ambient);

                /**
                 * TODO:  changed orthoFOV back.
                 * @type {THREE.CombinedCamera}
                 */
                camera = new THREE.CombinedCamera(window.innerWidth / 2, window.innerHeight / 2, 70, 1, 1500, -500, 300000);
                camera.setSize(window.innerWidth, window.innerHeight);

                if (cameraType === "PERP") {
                    camera.toPerspective();
                    camera.position.set(SETUP.CAMERA.PERP.POSITION.x, SETUP.CAMERA.PERP.POSITION.y, SETUP.CAMERA.PERP.POSITION.z);
                    camera.rotation.set(SETUP.CAMERA.PERP.ROTATION.x, SETUP.CAMERA.PERP.ROTATION.y, SETUP.CAMERA.PERP.ROTATION.z, SETUP.CAMERA.PERP.ROTATION.order);
                    camera.up.set(0, 1, 0);
                    if (SETUP.CAMERA.PERP.CONTROLS) {
                        controls = new THREE.FlyControls(camera);
                        controls.movementSpeed = 1000;
                        controls.domElement = renderer.domElement;
                        controls.rollSpeed = Math.PI / 24;
                        controls.autoForward = false;
                        controls.dragToLook = false;
                    }
                } else {
                    camera.toOrthographic();
                    camera.position.set(SETUP.CAMERA.ORTHO.POSITION.x, SETUP.CAMERA.ORTHO.POSITION.y, SETUP.CAMERA.ORTHO.POSITION.z);
                    camera.rotation.set(SETUP.CAMERA.ORTHO.ROTATION.x, SETUP.CAMERA.ORTHO.ROTATION.y, SETUP.CAMERA.ORTHO.ROTATION.z, SETUP.CAMERA.ORTHO.ROTATION.order);
                    camera.up.set(1, 0, 0);
                }

                if (SETUP.AXIS_HELPER) {
                    var axisHelper = new THREE.AxisHelper(50);
                    scene.add(axisHelper);
                }
            }


            function toScreenXYFromOrtho(position, width, height, camera) {
//                var camWidth = camera.right - camera.left;
//                var camHeight = camera.top - camera.bottom;
                var camWidth = camHeight = 1000;
                /**
                 * convert from Orthographic 3D to Screen 2D
                 * - flip Y axis origin position to top left from bottom left
                 */
                var screenX = parseInt((position[0] - (camera.position.x + camera.left)) / camWidth * width, 0);
                var screenY = parseInt(height - (position[1] - (camera.position.y + camera.bottom)) / camHeight * height, 0);

                return {
                    x: screenX,
                    y: screenY
                };
            }

            /**
             * Set the heat map data based upon
             */
            function setHeatMapData() {

                var points = [];
                var width = window.innerWidth,
                    height = window.innerHeight;

                var max = 1;

                var pos, point;


                for (var r = 0; r < BART.routes.length; r++) {
                    var route = BART.routes[r];
                    for (var i = 0; i < route.noise.length; i++) {
                        pos = toScreenXYFromOrtho(route.noise[i], width, height, camera);
                        point = {
                            x: pos.x,
                            y: pos.y,
                            value: route.noise[i][2]
                        };
                        points.push(point);
                    }
                }

                var data = {
                    max: max,
                    data: points
                };

                // this clears out prior instance data.
                heatmapInstance.setData(data);
            }

            function setupHeatMap() {
                heatMapConfig = {
                    container: document.getElementById('heatmap'),
                    radius: 25,
                    maxOpacity: 0.9,
                    minOpacity: .1,
                    blur: 0.9,
                    gradient: {
                        // enter n keys between 0 and 1 here
                        // for gradient color customization
                        '.1': 'black',
                        '.8': 'grey',
                        '.95': 'white'
                    }
                };
                heatmapInstance = h337.create(heatMapConfig);

                setHeatMapData();
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
                        geometry = new THREE.BoxGeometry(5, 40, 4);
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
                createSplines(dbSplines, 100, false);

            }

            function onWindowResize() {
                setHeatMapData();

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize(window.innerWidth, window.innerHeight);
            }

            /**
             * Initialize the 3D scene.
             */
            function init() {

                setupScene();

                if (SETUP.ROUTES) {
                    setupRoutes();
                }

                if (SETUP.HEAT_MAP) {
                    setupHeatMap();
                }
                if (SETUP.MESH) {
//                    load3DScene();
//                    loadglTF();
                    loadCollada();
                }

                window.addEventListener('resize', onWindowResize, false);

                animate();

                setInterval(moveSubway, 100);
            }

            function load3DScene() {

                var onProgress = function (xhr) {
                    if (xhr.lengthComputable) {
                        var percentComplete = xhr.loaded / xhr.total * 100;
                        console.log(Math.round(percentComplete, 2) + '% downloaded');
                    }
                };

                var onError = function (xhr) {
                    console.log('error: ', xhr);
                };

                THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
                var mtlLoader = new THREE.MTLLoader();
//                mtlLoader.setPath('obj/male02/');
//                mtlLoader.load('male02.mtl', function (materials) {
                mtlLoader.setPath('3D_files/obj/');
                mtlLoader.load('SF-BART-with-route-texture.mtl', function (materials) {

                    materials.preload();

                    var objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(materials);
//                    objLoader.setPath('obj/male02/');
//                    objLoader.load('male02.obj', function (object) {
                    objLoader.setPath('obj/');
                    objLoader.load('SF-BART-with-route-texture.obj', function (object) {

//                        object.position.y = - 95;s
                        object.scale.set(1, 1, 1);


                        scene.add(object);

                    }.bind(this), onProgress, onError);

                }.bind(this));

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

            function animate() {
                requestAnimationFrame(animate);
                render();
            }

            function render() {

                if (SETUP.CAMERA.PERP.CONTROLS) {
                    var delta = clock.getDelta();
                    controls.update(delta);
                }
                renderer.render(scene, camera);
            }

            return {
                init: init,
                setMultiplier: setMultiplier,
                setCameraType: setCameraType,
            };
        }])
;
