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
                splines = [];

            var tangent = new THREE.Vector3();
            var axis = new THREE.Vector3();
            var up = new THREE.Vector3(0, 1, 0);

            var delta = 0.005;
            var multiplier = 1;

            /**
             * @param {number} num
             * TODO: WTF isn't this working.
             */
            function setMultiplier(num) {
                multiplier = parseInt(num, 10) || SETUP.MULTIPLIER || 1;
                console.log('multiplier: ' + multiplier);
            }

            /**
             * Initialize the 3D scene.
             */
            function init() {

                renderer = new THREE.WebGLRenderer();
                renderer.setSize(window.innerWidth, window.innerHeight);
                document.body.appendChild(renderer.domElement);
                camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);
                //TODO:  Why is camera looking at origin?
                camera.position.set(500, 500, 1500);
                scene = new THREE.Scene();
//                controls = new THREE.TrackballControls(camera, renderer.domElement);
                var axisHelper = new THREE.AxisHelper( 50 );
                scene.add( axisHelper );

                var numPoints = 100;

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
                    subwayGroup.userData.normalizer = BART.longestRoute / route.routeLength;
                    subwayGroup.counter = 0;
                    subways.push(subwayGroup);

                    var testGeo = new THREE.BoxGeometry(40,5,5);
                    var testMesh = new THREE.Mesh(testGeo, material);

                    subwayGroup.add(testMesh);
                    scene.add(subwayGroup);
                }

                var midmarker = new THREE.BoxGeometry(25,25,25);
                var tm = new THREE.Mesh(midmarker, material);

                camera.lookAt(midmarker);
                tm.position.set(250, 250, 0);
                scene.add(tm);

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
//                controls.update();
                renderer.render(scene, camera);
            }

            return {
                init: init,
                setMultiplier: setMultiplier
            };
        }])
;
