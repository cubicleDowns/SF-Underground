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
                camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);
                //TODO:  Why is camera looking at origin?
                camera.position.set(SETUP.CAMERA.POSITION.x, SETUP.CAMERA.POSITION.y, SETUP.CAMERA.POSITION.z);
                camera.rotation.set(SETUP.CAMERA.ROTATION.x, SETUP.CAMERA.ROTATION.y, SETUP.CAMERA.ROTATION.z, SETUP.CAMERA.ROTATION.order);
                camera.up.set(0, 1, 0);
//                camera.lookAt(SETUP.CAMERA.LOOK_AT.x, SETUP.CAMERA.LOOK_AT.y, SETUP.CAMERA.LOOK_AT.z);
                scene = new THREE.Scene();
                if (SETUP.CAMERA.CONTROLS) {
                    controls = new THREE.FlyControls(camera);
                    controls.movementSpeed = 1000;
                    controls.domElement = renderer.domElement;
                    controls.rollSpeed = Math.PI / 24;
                    controls.autoForward = false;
                    controls.dragToLook = false;
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

                    geometry = new THREE.BoxGeometry(5, 40, 4);
                    material = new THREE.MeshBasicMaterial({
                        color: route.subwayColor
                    });

                    var group = new THREE.Object3D();
                    var mesh = new THREE.Mesh(geometry, material);
                    group.add(mesh);

                    if (isSubway) {
                        group.userData.normalizer = BART.longestRoute / route.routeLength;
                        group.counter = 0;
                        subways.push(group);
                    } else {

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
                createSplines(dbSplines, 20, false);

            }


            /**
             * Initialize the 3D scene.
             */
            function init() {

                setupScene();
                setupRoutes();


                animate();

                setInterval(moveSubway, 100);
            }


            function moveSubway() {
                for (var i = 0; i < subways.length; i++) {
                    var subway = subways[i];
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

            function makeTextSprite(message, parameters) {

                if (parameters === undefined) parameters = {};
                var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
                var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
                var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
                var borderColor = parameters.hasOwnProperty("borderColor") ? parameters["borderColor"] : {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 1.0
                };
                var backgroundColor = parameters.hasOwnProperty("backgroundColor") ? parameters["backgroundColor"] : {
                    r: 255,
                    g: 255,
                    b: 255,
                    a: 1.0
                };
                var textColor = parameters.hasOwnProperty("textColor") ? parameters["textColor"] : {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 1.0
                };

                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                context.font = "Bold " + fontsize + "px " + fontface;
                var metrics = context.measureText(message);
                var textWidth = metrics.width;

                context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
                context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

                context.lineWidth = borderThickness;
                roundRect(context, borderThickness / 2, borderThickness / 2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);

                context.fillStyle = "rgba(" + textColor.r + ", " + textColor.g + ", " + textColor.b + ", 1.0)";
                context.fillText(message, borderThickness, fontsize + borderThickness);

                var texture = new THREE.Texture(canvas)
                texture.needsUpdate = true;

                var spriteMaterial = new THREE.SpriteMaterial({map: texture, useScreenCoordinates: false});
                var sprite = new THREE.Sprite(spriteMaterial);
                sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);

                return sprite;
            }

            function roundRect(ctx, x, y, w, h, r) {
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.lineTo(x + w - r, y);
                ctx.quadraticCurveTo(x + w, y, x + w, y + r);
                ctx.lineTo(x + w, y + h - r);
                ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
                ctx.lineTo(x + r, y + h);
                ctx.quadraticCurveTo(x, y + h, x, y + h - r);
                ctx.lineTo(x, y + r);
                ctx.quadraticCurveTo(x, y, x + r, y);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
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
