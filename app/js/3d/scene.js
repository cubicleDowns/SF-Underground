var controls, renderer, scene, camera, boxes = [], splines = [], counter = 0;

var tangent = new THREE.Vector3();
var axis = new THREE.Vector3();
var up = new THREE.Vector3(0, 1, 0);

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(0, 0, 600);
    camera.lookAt(new THREE.Vector3(0, 100, 0));
    scene = new THREE.Scene();
    controls = new THREE.TrackballControls(camera, render.domElement);

    var numPoints = 50;


    splines.push(new THREE.SplineCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 200, 0),
        new THREE.Vector3(150, 150, 0),
        new THREE.Vector3(150, 50, 0),
        new THREE.Vector3(250, 100, 0),
        new THREE.Vector3(250, 300, 0)]));

    splines.push(new THREE.SplineCurve3([
        new THREE.Vector3(150, 200, 100),
        new THREE.Vector3(0, 200, 0),
        new THREE.Vector3(50, 25, 0),
        new THREE.Vector3(50, 50, 0),
        new THREE.Vector3(200, 100, 0),
        new THREE.Vector3(250, 100, 0)]));

    var material = new THREE.LineBasicMaterial({
        color: 0xff00f0
    });

    for(var j = 0; j < splines.length; j++){
        var geometry = new THREE.Geometry();
        var splinePoints = splines[j].getPoints(numPoints);
        for(var i = 0; i < splinePoints.length; i++){
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
    for(var i = 0; i < boxes.length; i++){
        var box = boxes[i];

        if (counter <= 1) {
            box.position.copy( splines[i].getPointAt(counter) );

            tangent = splines[i].getTangentAt(counter).normalize();

            axis.crossVectors(up, tangent).normalize();

            var radians = Math.acos(up.dot(tangent));

            box.quaternion.setFromAxisAngle(axis, radians);

            counter += 0.005
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