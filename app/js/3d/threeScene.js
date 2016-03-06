angular.module('SFUnderground.3D.scene', [])
    .factory('ThreeScene', ['BART',
        function (BART) {
            var controls, renderer, scene, camera, boxes = [], splines = [],
                counter0 = 0,
                counter1 = 0,
                counter2 = 0,
                counter3 = 0,
                counter4 = 0;

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
                        color: 0xff0000
                    });
                    // these are the 'trains'
                    var box = new THREE.Mesh(geometry, material);
                    box.userData.length = route.length;
                    boxes.push(box);
                    scene.add(box);
                }

                animate();

                setInterval(moveBox0, boxes[0].userData.length * 2);
                setInterval(moveBox1, boxes[1].userData.length * 2);
                setInterval(moveBox2, boxes[2].userData.length * 2);
                setInterval(moveBox3, boxes[3].userData.length * 2);
                setInterval(moveBox4, boxes[4].userData.length * 2);
            }

            function moveBox0() {
                var box = boxes[0];
                var radians;
                if (counter0 <= 1) {
                    box.position.copy(splines[0].getPointAt(counter0));

                    tangent = splines[0].getTangentAt(counter0).normalize();

                    axis.crossVectors(up, tangent).normalize();

                    radians = Math.acos(up.dot(tangent));

                    box.quaternion.setFromAxisAngle(axis, radians);

                    counter0 = counter0 + (multiplier * 0.005);

                } else {
                    counter0 = 0;
                }
            }

            function moveBox1() {
                var box = boxes[1];
                var radians;
                if (counter1 <= 1) {
                    box.position.copy(splines[1].getPointAt(counter1));

                    tangent = splines[1].getTangentAt(counter1).normalize();

                    axis.crossVectors(up, tangent).normalize();

                    radians = Math.acos(up.dot(tangent));

                    box.quaternion.setFromAxisAngle(axis, radians);

                    counter1 = counter1 + (multiplier * 0.005);

                } else {
                    counter1 = 0;
                }
            }

            function moveBox2() {
                var box = boxes[2];
                var radians;
                if (counter2 <= 1) {
                    box.position.copy(splines[2].getPointAt(counter2));

                    tangent = splines[2].getTangentAt(counter2).normalize();

                    axis.crossVectors(up, tangent).normalize();

                    radians = Math.acos(up.dot(tangent));

                    box.quaternion.setFromAxisAngle(axis, radians);

                    counter2 = counter2 + (multiplier * 0.005);

                } else {
                    counter2 = 0;
                }
            }

            function moveBox3() {
                var box = boxes[3];
                var radians;
                if (counter3 <= 1) {
                    box.position.copy(splines[3].getPointAt(counter3));

                    tangent = splines[3].getTangentAt(counter3).normalize();

                    axis.crossVectors(up, tangent).normalize();

                    radians = Math.acos(up.dot(tangent));

                    box.quaternion.setFromAxisAngle(axis, radians);

                    counter3 = counter3 + (multiplier * 0.005);

                } else {
                    counter3 = 0;
                }
            }

            function moveBox4() {
                var box = boxes[4];
                var radians;
                if (counter4 <= 1) {
                    box.position.copy(splines[4].getPointAt(counter4));

                    tangent = splines[4].getTangentAt(counter4).normalize();

                    axis.crossVectors(up, tangent).normalize();

                    radians = Math.acos(up.dot(tangent));

                    box.quaternion.setFromAxisAngle(axis, radians);

                    counter4 = counter4 + (multiplier * 0.005);

                } else {
                    counter4 = 0;
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
