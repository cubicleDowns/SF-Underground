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
      this.currentAlerts = [];
      this.currentRouteID = 0;
      this.babylonMod = null;
      this.currentUserKey = null;
      this.isCurrentlyUsingBart = false;
      this.userToUpdate = 'https://sf-noise.firebaseio.com/riders/'
      this.brartRoutes = ['Pittsburg / Bay Point', 'Richmond / Millbrae', 'Richmond / Fremont', 'Fremont / Daily City', 'Dublin Pleasanton / Daily City'];
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


    this.users.once("value", function(userData) {
      userData.forEach(function(data) {
        if(window.localStorage.getItem("bart_vr_user_key") != null && data.key() == window.localStorage.getItem("bart_vr_user_key") ){
          this.user = data.val();
          this.currentUserKey = data.key();
          this.userToUpdate +=  data.key();
          this.userToUpdate = new Firebase(this.userToUpdate);
          this.isCurrentlyUsingBart = true;
        }
         this.currentRiders.push(data.val());
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
      if(window.localStorage.getItem("bart_vr_user") == null){
        _pos.x = this.randomPos(-85, 6);
        _pos.y = this.randomPos(-4, 15);
        _pos.z = 6;
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
          this.user = {name:_username, position: _pos, rotation: _pos, sprite:this.randomArr(this.sprites), routeID:this.currentRouteID  };
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
      this.userToUpdate.set({name: this.user.name, position: position, rotation: rotation, sprite: this.user.sprite,  routeID:this.currentRouteID });
    }else{
      this.users.set({name: this.user.name, position: position, rotation: rotation, sprite: this.user.sprite,  routeID:this.currentRouteID });
    }
  }

  



}
