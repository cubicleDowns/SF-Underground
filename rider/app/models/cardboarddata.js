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
      this.sprites = ['build/sprites/person/barvr_rider_idle.png'];
      this.bartAlerts = new Firebase(this.firebaseRef + 'alerts');
      this.currentAlerts = null;
      this.currentRouteID = 0;
      this.babylonMod = null;
      this.init();
    }

  randomArr(arr){
        return arr[Math.floor(Math.random()*arr.length)];
   }

   randomPos(min, max){
        return Math.random() * (max - min) + min;
   }

   generateUserSprites(){
    this.users.once('value', function(userData){
      console.log(userData);
      userData.forEach(function(data) {
        console.log(data);
        this.babylonMod.generateUserSprites(data);
      }.bind(this));
    }.bind(this));
   }


  init(){

    this.bartAlerts.on("child_added", function(alertData) {
      console.log("added", alertData.key());
    });


    this.bartAlerts.once("value", function(alertData) {
      alertData.forEach(function(data) {
        console.log(data.val());
      });
    });


    this.users.once("value", function(userData) {
      userData.forEach(function(data) {
         this.currentRiders.push(data.val());
        console.log(data.val());
      }.bind(this));
    }.bind(this));

    


    /* debugging
  	this.sfunderground.on('value', function(info){
        console.log(info.val());
  	});



    this.users.on("child_added", function(snapshot, key) {
      console.log(snapshot);
      console.log(key);
    });
    */


  }

  setUser(_user = {name: 'userName', position: {x:0, y:0, z:0}}, _pos = {} ){
    console.log(_pos);
    _pos.x = this.randomPos(-6, 6);
    _pos.z = this.randomPos(-1, 1);
    this.currentRouteID = this.randomPos(0, 5).toFixed();
    this.user = {name: this.randomArr(this.fakeUser), position: _pos, rotation: _pos, sprite:this.randomArr(this.sprites), routeID:this.currentRouteID  };
  	this.users = this.users.push( this.user);
  }
 

  updateUser(position, rotation){
    this.users.set({name: this.user.name, position: position, rotation: rotation, sprite: this.user.sprite,  routeID:this.currentRouteID });
  }

  



}
