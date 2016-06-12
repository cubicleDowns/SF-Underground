export class CardBoardData{
  
  constructor(fbURL =  "https://sf-noise.firebaseio.com/"){
      this.stereoEffect = false;
      this.landscapeMode = false;
      this.firebaseRef = fbURL;
      this.sfunderground = new Firebase(this.firebaseRef);
      this.users = new Firebase(this.firebaseRef + 'riders');
      this.user = {name:null, position:{x:0, y:0, z:0}, rotation:{x:0, y:0, z:0}, sprite:null};
      this.currentRiders = [];
      this.fakeUser = ['Tom','Richard','Jane','John','Dan','Josh','Brendon','Emma','Peter'];
      this.sprites = ['bartvr/sprites/person/barvr_rider_idle.png'];
      this.bartAlerts = new Firebase(this.firebaseRef + 'alerts');
      this.currentAlerts = [];
      this.currentRouteID = 0;
      this.babylonMod = null;
      this.currentUserKey = null;
      this.isCurrentlyUsingBart = false;
      this.executeUserRemoval = null;
      this.userToUpdate = 'https://sf-noise.firebaseio.com/riders/';
      this.dbLevelIO = new Firebase(this.firebaseRef + 'db');
      this.frequencyIO = new Firebase(this.firebaseRef + 'freq');
      this.sound = new Firebase(this.firebaseRef + 'start');
      this.soundVal = null;
      this.soundStart = false;
      this.frequencyLevel = 0.0;
      this.dbLevel = 0;
      this.brartRoutes = ['Pittsburg / Bay Point', 'Richmond / Millbrae', 'Richmond / Fremont', 'Fremont / Daily City', 'Dublin Pleasanton / Daily City'];
      this.spriteAnimations = [20,40,60,80];
      this.zombieMode = false;
      this.init();
    }

  randomArr(arr){
        return arr[Math.floor(Math.random()*arr.length)];
   }

   randomPos(min, max){
        return Math.random() * (max - min) + min;
   }



  init(){
    this.bartAlerts.on("child_added", function(alertData) {
      this.currentAlerts.push(alertData.val());
    }.bind(this));


    this.bartAlerts.once("value", function(alertData) {
      alertData.forEach(function(data) {
        this.currentAlerts.push(data.val());
      }.bind(this));
    }.bind(this));

    this.users.on("child_added", function(userData) {
       this.currentRiders.push({data:userData.val(), key: userData.key()});
    }.bind(this));

    this.users.on("child_changed", function(userData) {
        for(let i = 0; i < this.currentRiders.length; i++){
            if(userData.key() == this.currentRiders[i].key){
               this.currentRiders[i].data =  userData.val();
            }
        }
    }.bind(this));

    this.frequencyIO.on("value", function(data) {
       this.frequencyLevel =  data.val();
    }.bind(this));


    this.dbLevelIO.on("value", function(data) {
       this.dbLevel =  data.val();
       if(parseInt(this.dbLevel) >= 105){
          this.zombieMode = true;
       }else{
          this.zombieMode = false;
       }
    }.bind(this));


     this.sound.on("value", function(data) {
       this.soundVal =  data.val();
       if(this.soundVal == true){
          this.soundStart = true;
       }else{
          this.soundStart = false;
       }
    }.bind(this));


    /*
    this.users.on("value", function(userData) {
      this.currentRiders = [];
      userData.forEach(function(data) {
         this.currentRiders.push({data:data.val(), key: data.key()});
      }.bind(this));
    }.bind(this));
    */

    this.users.once("value", function(userData) {
      userData.forEach(function(data) {
        if(window.localStorage.getItem("bart_vr_user_key") != null && data.key() == window.localStorage.getItem("bart_vr_user_key") ){
          this.user = data.val();
          this.currentUserKey = data.key();
          this.userToUpdate +=  data.key();
          this.userToUpdate = new Firebase(this.userToUpdate);
          this.isCurrentlyUsingBart = true;
        } 
        // this.currentRiders.push({data:data.val(), key: data.key()});
      }.bind(this));
    }.bind(this));
  }

  deleteUser(_dkey){
      var userRef = new Firebase('https://sf-noise.firebaseio.com/riders/'  + _dkey);
      userRef.once("value", function(_data) {
        console.log(_data.val());
        console.log('pass');
        var fountain = BABYLON.Mesh.CreateBox("foutain", 1.0, this.babylonMod.scene);
        fountain.isVisible = false;
        fountain.position = new BABYLON.Vector3(_data.val().position.x, _data.val().position.y, _data.val().position.z)
        var particleSystem = new BABYLON.ParticleSystem("particles", 1000, this.babylonMod.scene);
        particleSystem.particleTexture = new BABYLON.Texture("bartvr/img/textures/flare.png", this.babylonMod.scene);
        particleSystem.emitter = fountain; // the starting object, the emitter
        particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
        particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...
        particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.5;
        particleSystem.minLifeTime = 0.1;
        particleSystem.maxLifeTime = 0.3;
        particleSystem.emitRate = 1000;
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
        particleSystem.direction1 = new BABYLON.Vector3(-4, 6, 4);
        particleSystem.direction2 = new BABYLON.Vector3(4, 6, -4);
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 3;
        particleSystem.updateSpeed = 0.005;
        particleSystem.start();
        setTimeout(function(){
          particleSystem.stop();
          particleSystem.dispose();
          for(let i = 0; i < this.babylonMod.scene.spriteManagers.length; i++){
              if(  this.babylonMod.scene.spriteManagers[i].name == _dkey){
                  this.babylonMod.scene.spriteManagers[i].dispose();
              }
          }
          userRef.remove();
        }.bind(this), 5000);       
        }.bind(this), function (errorObject) {
         // console.log(errorObject);
      });
  }

  setUser(_user = {name: 'userName', position: {x:0, y:0, z:0}}, _pos = {} ){
      if(window.localStorage.getItem("bart_vr_user") == null){
        _pos.x = this.randomPos(-85, 2);
        _pos.y = 10;
        _pos.z = this.randomPos(5, 15);
        var _username = null;
        if(this.user.name == null){
          _username =  this.randomArr(this.fakeUser);
        }else{
          _username = this.user.name;
        }
        try{
          window.localStorage.setItem("bart_vr_user", _username);
        }catch(e){
          alert('please allow local storage please disable private mode');
        }
          this.user = {name:_username, position: _pos, rotation: _pos, sprite:this.randomArr(this.sprites), routeID:this.currentRouteID, spriteID: this.randomArr(this.spriteAnimations) };
          this.users = this.users.push( this.user);  
          this.currentUserKey = this.users.key();
          try{
          window.localStorage.setItem("bart_vr_user_key", this.currentUserKey );
        }catch(e){
         
        }

     }
  }
 

  updateUser(position, rotation){
    if(this.isCurrentlyUsingBart){
      this.userToUpdate.set({name: this.user.name, position: position, rotation: rotation, sprite: this.user.sprite,  routeID:this.currentRouteID, spriteID: this.user.spriteID });
    }else{
      this.users.set({name: this.user.name, position: position, rotation: rotation, sprite: this.user.sprite,  routeID:this.currentRouteID, spriteID: this.user.spriteID });
    }
  }

  



}
