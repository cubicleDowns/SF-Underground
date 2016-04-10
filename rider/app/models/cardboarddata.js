export class CardBoardData{
  constructor(fbURL =  "https://sf-noise.firebaseio.com/"){
    this.stereoEffect = false;
    this.landscapeMode = false;
    this.firebaseRef = fbURL;
    this.sfunderground = new Firebase(this.firebaseRef);
    this.users = new Firebase(this.firebaseRef + 'riders');
    this.user = {name:null, position:{x:0, y:0, z:0}, rotation:{x:0, y:0, z:0}};
    this.init();
    this.fakeUser = ['Tom','Richard','Jane','John','Dan','Josh','Brendon','Emma','Peter'];
  }

  randomArr(arr){
        return arr[Math.floor(Math.random()*arr.length)];
   }

  init(){

    /*
  	this.sfunderground.on('value', function(info){
        console.log(info.val());
  	});

  	this.users.on('value', function(info){
        console.log(info.val());
  	});

    this.users.on("child_added", function(snapshot, key) {
      console.log(snapshot);
      console.log(key);
    });
    */


  }

  setUser(_user = {name: 'userName', position: {x:0, y:0, z:0}}, _pos = {} ){
    this.user = {name: this.randomArr(this.fakeUser), position: _pos, rotation: _pos};
  	this.users = this.users.push( this.user);
  }
 

  updateUser(position, rotation){
    this.users.set({name: this.user.name, position: position, rotation: rotation});
  }

  



}
