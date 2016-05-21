export class GazeEvent {

    constructor(_target, _callback = null, _gazeTime = 2000) {
    	this.target = _target;
    	this.hitTime = null;
    	this.gazeTime = _gazeTime;
    	this.intervalID = null;
    	this.callback = _callback;
    }

	setTimerInterval(){
	 	this.clear();
	 	this.intervalID = setInterval(this.hitCallback.bind(this), this.gazeTime);
	 }

	 clear(){
	 	try{
		clearInterval(this.intervalID);
	 	}catch(e){}
	 }

	 hitCallback(){
	 	this.clear();
	 	this.callback();
	 }

	 setGaze(){
	 	this.hitTime = new Date().getTime();
	 	this.setTimerInterval.apply(this);
	 }

	 endGaze(){
	 	var end = new Date().getTime();
		var time = end - this.hitTime;
		this.hitTime = null;
		this.clear();
		return time;
	 }
}