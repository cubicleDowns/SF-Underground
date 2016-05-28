angular.module('SFUnderground.3D.scene', [])
    .factory('ThreeScene', [
        'BART',
        'SETUP',
        function (BART, SETUP) {
            var controls,
                renderer,
                scene,
                camera,
                subways = [],
                dbLevels = [],
                dbSplines = [],
                splines = [];

            var tangent = new THREE.Vector3();
            var axis = new THREE.Vector3();
            var up = new THREE.Vector3(0, 1, 0);

            var delta = 0.005;
            var multiplier = 1;
            var clock = new THREE.Clock();

            /**
             * @param {number} num
             */
            function setMultiplier(num) {
                multiplier = parseInt(num, 10) || SETUP.MULTIPLIER || 1;
            }

            function setupScene() {

                renderer = new THREE.WebGLRenderer();
                renderer.setSize(window.innerWidth, window.innerHeight);
                document.body.appendChild(renderer.domElement);
                scene = new THREE.Scene();

                camera = new THREE.CombinedCamera(window.innerWidth / 2, window.innerHeight / 2, 70, 1, 1000, -500, 2000);


                if (SETUP.CAMERA.TYPE === "PERP") {
                    debugger;
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
//                    camera.rotation.set(SETUP.CAMERA.ORTHO.ROTATION.x, SETUP.CAMERA.ORTHO.ROTATION.y, SETUP.CAMERA.ORTHO.ROTATION.z, SETUP.CAMERA.ORTHO.ROTATION.order);
                    camera.rotation.set(SETUP.CAMERA.ORTHO.ROTATION.x, SETUP.CAMERA.ORTHO.ROTATION.y, SETUP.CAMERA.ORTHO.ROTATION.z, SETUP.CAMERA.ORTHO.ROTATION.order);

                    camera.up.set(1, 0, 0);
                }

                if (SETUP.AXIS_HELPER) {
                    var axisHelper = new THREE.AxisHelper(50);
                    scene.add(axisHelper);
                }
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
                camera.setSize(window.innerWidth, window.innerHeight);
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }

            /**
             * Initialize the 3D scene.
             */
            function init() {

                setupScene();
                setupRoutes();
                window.addEventListener('resize', onWindowResize, false);

                animate();

                setInterval(moveSubway, 100);
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

                if (SETUP.CAMERA.CONTROLS) {
                    var delta = clock.getDelta();
                    controls.update(delta);
                }
                renderer.render(scene, camera);
            }

            return {
                init: init,
                setMultiplier: setMultiplier
            };
        }])
;
