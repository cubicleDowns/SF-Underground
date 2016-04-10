export class threeMod {


    constructor(_element) {
        this.canvas = document.getElementById('renderCanvas');
        setTimeout(this.init.bind(this), 500);
        this.mode = 'vr';
    }

    init() {
        window.WebVRConfig = {
          /**
           * webvr-polyfill configuration
           */
          // Forces availability of VR mode.
          //FORCE_ENABLE_VR: true, // Default: false.
          // Complementary filter coefficient. 0 for accelerometer, 1 for gyro.
          //K_FILTER: 0.98, // Default: 0.98.
          // How far into the future to predict during fast motion.
          //PREDICTION_TIME_S: 0.040, // Default: 0.040 (in seconds).
          // Flag to disable touch panner. In case you have your own touch controls
          //TOUCH_PANNER_DISABLED: true, // Default: false.
          // Enable yaw panning only, disabling roll and pitch. This can be useful for
          // panoramas with nothing interesting above or below.
          //YAW_ONLY: true, // Default: false.
          /**
           * webvr-boilerplate configuration
           */
          // Forces distortion in VR mode.
          //FORCE_DISTORTION: true, // Default: false.
          // Override the distortion background color.
          // DISTORTION_BGCOLOR: {x: 1, y: 0, z: 0, w: 1}, // Default: (0,0,0,1).
          // Prevent distortion from happening.
          //PREVENT_DISTORTION: true, // Default: false.
          // Show eye centers for debugging.
          // SHOW_EYE_CENTERS: true, // Default: false.
          // Prevent the online DPDB from being fetched.
          // NO_DPDB_FETCH: true,  // Default: false.
        };
    

    var renderer = new THREE.WebGLRenderer({antialias: true, canvas:this.canvas});
    renderer.setPixelRatio(window.devicePixelRatio);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    var controls = new THREE.VRControls(camera);
    var effect = new THREE.VREffect(renderer);
    effect.setSize(window.innerWidth, window.innerHeight);
    var boxWidth = 5;
    var loader = new THREE.TextureLoader();
    loader.load('build/img/textures/_holoDeck_diffuse.png', onTextureLoaded);
    function onTextureLoaded(texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(boxWidth, boxWidth);
      var geometry = new THREE.BoxGeometry(boxWidth, boxWidth, boxWidth);
      var material = new THREE.MeshBasicMaterial({
        map: texture,
        color: 0x01BE00,
        side: THREE.BackSide
      });
      var skybox = new THREE.Mesh(geometry, material);
      scene.add(skybox);
    }
    var params = {
      hideButton: false, // Default: false.
      isUndistorted: false // Default: false.
    };
    var manager = new WebVRManager(renderer, effect, params);
    this.manager = manager;

    var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    var material = new THREE.MeshNormalMaterial();
    var cube = new THREE.Mesh(geometry, material);
    cube.position.z = -1;
    scene.add(cube);
    var lastRender = 0;

    function animate(timestamp) {
      var delta = Math.min(timestamp - lastRender, 500);
      lastRender = timestamp;
      cube.rotation.y += delta * 0.0006;
      controls.update();
      manager.render(scene, camera, timestamp);
      requestAnimationFrame(animate);
    }

    animate(performance ? performance.now() : Date.now());
    manager.onVRClick_();
    function onKey(event) {
      if (event.keyCode == 90) { // z
        controls.resetSensor();
      }
    }
    window.addEventListener('keydown', onKey, true);
    }

    toggle(){
        if(this.mode == 'vr'){
            this.mode = 'nomral';
            this.manager.onBackClick_(); 
        }else{
            this.mode = 'vr';
            this.manager.onVRClick_(); 
        }
    }


}