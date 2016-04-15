export class AugmentedReality {

    constructor(_element, app) {
        this.getUserMedia = navigator.getUserMedia ? function(a, b, c) {
            navigator.getUserMedia(a, b, c);
        } : (navigator.webkitGetUserMedia ? function(a, b, c) {
            navigator.webkitGetUserMedia(a, b, c);
        } : null);
        this.isMobile = true;
        this.fullScreenRequested = true;
        this.camCaptureState = 0;
        this.videoPlaying = false;
        this.screenWidth;
        this.screenHeight;
        this.screenHalfWidth;
        this.screenHalfHeight;
        this.verticalMargin;
        this.cameraImage;
        this.cameraImageContext;
        this.leftCamCanvas;
        this.leftCamContext;
        this.rightCamCanvas;
        this.rightCamContext;
        this.videoSource = null;
        this.initDom();
        this.init();
    }

    initDom(){
        this.container = document.getElementById('container');
        this.leftcam = document.getElementById('leftcam');
        this.rightcam = document.getElementById('rightcam');
        this.leftCamCanvas = document.getElementById("leftcam");
        this.leftCamContext = this.leftCamCanvas.getContext("2d");
        this.rightCamCanvas = document.getElementById("rightcam");
        this.rightCamContext = this.rightCamCanvas.getContext("2d");
        this.video = document.getElementById("video");
        this.cameraImage = document.createElement('canvas');
        this.cameraImage.setAttribute("width", "640");
        this.cameraImage.setAttribute("height", "480");
        this.cameraImage.width = 640;
        this.cameraImage.height = 480;
        this.cameraImageContext = this.cameraImage.getContext("2d");
        this.screenWidth = this.container.offsetWidth;
        this.screenHeight = this.container.offsetHeight; 
        this.screenHalfWidth = ((this.screenWidth / 2) | 0);
        this.screenHalfHeight = ((this.screenHeight / 2) | 0);
        this.horizontalMargin = 0;
        // adjust margin so that we have a near 4:3 ratio.
        this.verticalMargin = 0 ; 
        this.cameraImageWidth = 800; 
        this.cameraImageHeight = 600; 
        this.cameraImage.width = this.cameraImageWidth;
        this.cameraImage.height = this.cameraImageHeight;
        this.cameraImage.setAttribute("width", '' + this.cameraImageWidth);
        this.cameraImage.setAttribute("height", '' + this.cameraImageHeight);
        this.cameraImage.style.width = this.cameraImageWidth + 'px';
        this.cameraImage.style.height = this.cameraImageHeight + 'px';
        this.leftcam.style.left = this.horizontalMargin + 'px';
        this.leftcam.style.top = this.verticalMargin + 'px';
        this.leftcam.width = (this.screenHalfWidth - (2 * this.horizontalMargin));
        this.leftcam.height = (this.screenHeight - (2 * this.verticalMargin));
        this.leftcam.style.width = (this.screenHalfWidth - (2 * this.horizontalMargin)) + 'px';
        this.leftcam.style.height = (this.screenHeight - (2 * this.verticalMargin)) + 'px';
        this.rightcam.style.left = (this.screenHalfWidth + this.horizontalMargin) + 'px';
        this.rightcam.style.top = this.verticalMargin + 'px';
        this.rightcam.width = (this.screenHalfWidth - (2 * this.horizontalMargin));
        this.rightcam.height = (this.screenHeight - (2 * this.verticalMargin));
        this.rightcam.style.width = (this.screenHalfWidth - (2 * this.horizontalMargin)) + 'px';
        this.rightcam.style.height = (this.screenHeight - (2 * this.verticalMargin)) + 'px';
    }

    init() {
        if (this.getUserMedia != null) {
            navigator.mediaDevices.enumerateDevices().then(
                function(sourceInfos) {
                    this.streamPromise(sourceInfos);
                }.bind(this)
            ).catch(
                function(e) {
                    console.log(e);
                });
        } else {
            alert("HTML5 video not supported");

        }
    }

    streamPromise(sourceInfos) {
        for (var i = 0; i < sourceInfos.length; i++) {
            var sourceInfo = sourceInfos[i];
            if ((sourceInfo.kind === 'video') || (sourceInfo.kind === 'videoinput')) {
                this.videoSource = sourceInfo.deviceId;
            }
        }

        if (this.videoSource != null) {

            this.getUserMedia.call(this, {
                video: {
                    optional: [{
                        sourceId: this.videoSource
                    }, {
                        minWidth: 640
                    }, {
                        maxWidth: 640
                    }, {
                        minHeight: 480
                    }, {
                        maxHeight: 480
                    }]
                },
                //video: true, 
                audio: false
            }, function(stream) {
                this.getStream(stream)
            }.bind(this), function() {
                this.stremError(error)
            }.bind(this))
        } else {
            alert("Video capture not available");
            if (this.isMobile) {
                if (!this.fullScreenRequested) {
                    alert('Tap screen for full screen mode');
                }
            }
            alert('Please wait while textures load');
            if (this.isMobile) {
                alert('Tip: increase your phone\'s display sleep timeout');
            }
        }
    }

    getStream(stream) {
        if (window.URL && window.URL.createObjectURL) {
            this.video.src = window.URL.createObjectURL(stream);
        } else if (window.webkitURL) {
            this.video.src = window.webkitURL.createObjectURL(stream);
        } else {
            this.video.src = stream;
        }
        this.video.play();

        this.videoPlaying = true;
        alert('Video setup ok');
        if (this.isMobile) {
            if (!this.fullScreenRequested) {
                alert('Tap screen for full screen mode');
            }
        }
        alert('Please wait while textures load');
        if (this.isMobile) {
            alert('Tip: increase your phone\'s display sleep timeout');
        }
    }

    stremError(error) {
        console.log(error);
        this.videoPlaying = false;
        alert("Video capture disabled");
        if (this.isMobile) {
            if (!this.fullScreenRequested) {
                alert('Tap screen for full screen mode');
            }
        }
        alert('Please wait while textures load');
        if (this.isMobile) {
            alert('Tip: increase your phone\'s display sleep timeout');
        }

    }

    camCapture() {
        if (this.videoPlaying) {
            this.cameraImageContext.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight, 0, 0, this.cameraImage.width, this.cameraImage.height);
            this.leftCamContext.drawImage(this.cameraImage, 0, 0, this.cameraImage.width, this.cameraImage.height, 0, 0, this.leftcam.width, this.leftcam.height);
            this.rightCamContext.drawImage(this.cameraImage, 0, 0, this.cameraImage.width, this.cameraImage.height, 0, 0, this.leftcam.width, this.leftcam.height);
        }
    }

}