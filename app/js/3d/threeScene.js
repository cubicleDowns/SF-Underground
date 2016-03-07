angular.module('SFUnderground.3D.scene', [])
    .factory('ThreeScene', ['BART',
        function (BART) {
            var controls, renderer, scene, camera, subways = [], splines = [];

            var tangent = new THREE.Vector3();
            var axis = new THREE.Vector3();
            var up = new THREE.Vector3(0, 1, 0);

            var delta = 0.005;
            var multiplier = 0.1;

            /**
             * @param {number} num
             * TODO: WTF isn't this working.
             */
            function setMultiplier(num) {
                multiplier = parseInt(num, 10) || 1;
                console.log('multiplier: ' + multiplier);
            }

            /**
             * Initialize the 3D scene.
             */
            function init() {

                renderer = new THREE.WebGLRenderer();
                renderer.setSize(window.innerWidth, window.innerHeight);
                document.body.appendChild(renderer.domElement);
                camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
                camera.position.set(500, 500, 3000);
                camera.lookAt(new THREE.Vector3(500, 500, 0));
                scene = new THREE.Scene();
                controls = new THREE.TrackballControls(camera, render.domElement);

                var numPoints = 50;

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
                    route.stops = route.stops.concat(returnRouteStops);
                    var points = [];
                    for (var s = 0; s < route.stops.length; s++) {
                        var stop = route.stops[s];
                        points.push(new THREE.Vector3(stop[0], stop[1], stop[3]));
                    }
                    splines.push(new THREE.SplineCurve3(points));
                }

                // 1 spline for each route.
                // create a geometry and material for each route
                for (var j = 0; j < splines.length; j++) {
                    route = BART.routes[j];
                    var geometry = new THREE.Geometry();
                    var splinePoints = splines[j].getPoints(numPoints);
                    for (var i = 0; i < splinePoints.length; i++) {
                        geometry.vertices.push(splinePoints[i]);
                    }
                    var material = new THREE.LineBasicMaterial({
                        color: route.color
                    });

                    var line = new THREE.Line(geometry, material);
                    scene.add(line);

                    geometry = new THREE.BoxGeometry(5, 40, 4);
                    material = new THREE.MeshBasicMaterial({
                        color: route.subwayColor
                    });
                    // these are the 'subways'
                    // Yay!  Subway group.  This is a simple container to add sprites/fx to.
                    var subwayGroup = new THREE.Object3D();
                    var subway = new THREE.Mesh(geometry, material);
                    subwayGroup.add(subway);
                    subwayGroup.userData.normalizer =  BART.longestRoute / route.routeLength;
                    subwayGroup.counter = 0;
                    subways.push(subwayGroup);
                    scene.add(subwayGroup);
                }

                animate();

                setInterval(moveSubway, 100);
            }


            function moveSubway() {
                for (var i = 0; i < subways.length; i++) {
                    var subway= subways[i];
                    var radians;
                    if (subway.counter <= 1) {
                        subway.position.copy(splines[i].getPointAt(subway.counter));

                        tangent = splines[i].getTangentAt(subway.counter).normalize();

                        axis.crossVectors(up, tangent).normalize();

                        radians = Math.acos(up.dot(tangent));

                        subway.quaternion.setFromAxisAngle(axis, radians);

                        /**
                         * `normalizer` is the current track / longest track.
                         * the spline length is normalized so we need to modify the
                         * length of arc movement.
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
                controls.update();
                renderer.render(scene, camera);
            }

            return {
                init: init,
                setMultiplier: setMultiplier
            };
        }]);
