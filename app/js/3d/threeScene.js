angular.module('SFUnderground.3D.scene', [])
    .factory('ThreeScene', [ 'BART',
        function (BART) {
            var controls, renderer, scene, camera, boxes = [], splines = [], counter = 0;

            var tangent = new THREE.Vector3();
            var axis = new THREE.Vector3();
            var up = new THREE.Vector3(0, 1, 0);

            var multiplier = 0.1;

            /**
             * @param {number} num
             */
            function setMultiplier(num) {
                multiplier = parseInt(num, 10) || 1;
                console.log('multiplier: ' + multiplier);
            }


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

                for (var r = 0; r < BART.routes.length; r++) {
                    var route = BART.routes[r];

                    // lets create a looped route so the "train" never stops moving.
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

                var material = new THREE.LineBasicMaterial({
                    color: 0xff00f0
                });

                for (var j = 0; j < splines.length; j++) {
                    var geometry = new THREE.Geometry();
                    var splinePoints = splines[j].getPoints(numPoints);
                    for (var i = 0; i < splinePoints.length; i++) {
                        geometry.vertices.push(splinePoints[i]);
                    }
                    var line = new THREE.Line(geometry, material);
                    scene.add(line);
                    geometry = new THREE.BoxGeometry(5, 40, 4);
                    material = new THREE.MeshBasicMaterial({
                        color: 0xff0000
                    });
                    // these are the 'trains'
                    var box = new THREE.Mesh(geometry, material);
                    boxes.push(box);
                    scene.add(box);
                }


                animate();

                setInterval(moveBox, 100);
            }


            function moveBox() {
                for (var i = 0; i < boxes.length; i++) {
                    var box = boxes[i];
                    var radians;
                    if (counter <= 1) {
                        box.position.copy(splines[i].getPointAt(counter));

                        tangent = splines[i].getTangentAt(counter).normalize();

                        axis.crossVectors(up, tangent).normalize();

                        radians = Math.acos(up.dot(tangent));

                        box.quaternion.setFromAxisAngle(axis, radians);

                        counter = counter + (multiplier * 0.005);

                    } else {
                        counter = 0;
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