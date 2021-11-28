var hostJoin = document.querySelector('#host')
var audienceJoin = document.querySelector('#audience')
var leaveCall = document.querySelector('#leave-call')
var channelName = document.querySelector('#channel_name')
var user = document.querySelector('#user')
var a =[]
var username1 = document.querySelector('#username1').value



let handleError = function(err){
  console.log("Error: ", err);
};


let remoteContainer = document.getElementById("remote-container");

// Add video streams to the container.
function addVideoStream(elementId){
        // Creates a new div for every stream
  let streamDiv = document.createElement("div");
        // Assigns the elementId to the div.
  streamDiv.id = elementId;
        // Takes care of the lateral inversion
  streamDiv.style.transform = "";
        // Adds the div to the container.
   remoteContainer.appendChild(streamDiv);
};

// Remove the video stream from the container.
function removeVideoStream(elementId) {
        let remoteDiv = document.getElementById(elementId);
        if (remoteDiv) remoteDiv.parentNode.removeChild(remoteDiv);
};

var options = {
  // Pass your app ID here.
  appId: "b5f44774a39043c7b277f615348ddb91",
  // Set the channel name.
  channel: null,
  // Pass a token if your project enables the App Certificate.
  token: null,

}
let client = AgoraRTC.createClient({
    mode: "live",
    codec: "vp8",
});

var file = document.getElementById('music_file').value;

var music_options = {
    filePath: 'http://www.hochmuth.com/mp3/Haydn_Cello_Concerto_D-1.mp3', 
    cycle: 1, 
    replace: false, 
    playTime:0
  }
hostJoin.addEventListener('click',()=>{
  startCall(role='host');
  channelName.disabled=true
  channelName.style.visibility='hidden'
  hostJoin.disabled = true
  hostJoin.style.visibility='hidden'
  audienceJoin.disabled=true
  audienceJoin.style.visibility='hidden'
  channel = channelName.value
  var channel_Name = document.querySelector('#label-channel_name');
  channel_Name.innerHTML='<h1>'+channel+'</h1>'
  username  = user.value
  user.innerHTML += '<p>is the host </p>'
})

audienceJoin.addEventListener('click',()=>{
  channelName.disabled=true
  channelName.style.visibility='hidden'
  hostJoin.disabled = true
  hostJoin.style.visibility='hidden'
  audienceJoin.disabled=true
  audienceJoin.style.visibility='hidden'
  channel = channelName.value
  var channel_Name = document.querySelector('#label-channel_name');
  channel_Name.innerHTML=channel
})
function startCall(role){

  if(role=='audience'){
    var channel = document.querySelector('#channel_name').value
    console.log(channel)
    client.init(options.appId);
    client.join(options.token, channel, username1, (uid)=>{
    	a.push(uid)
		console.log(a)
    	console.log('audience joined ' , uid)
      // Create a local stream
    }, handleError);

    let localStream = AgoraRTC.createStream({
    	audio: true,
    	video: false,
	});
	// Initialize the local stream
	localStream.init(()=>{
	    // Play the local stream
	    localStream.play("me");
	    // Publish the local stream
	    client.publish(localStream, handleError);
	}, handleError);
	// Subscribe to the remote stream when it is published
	client.on("stream-added", function(evt){
	    client.subscribe(evt.stream, handleError);
	});
	// Play the remote stream when it is subsribed
	client.on("stream-subscribed", function(evt){
	    let stream = evt.stream;
	    let streamId = String(stream.getId());
	    addVideoStream(streamId);
	    stream.play(streamId);
	});
	// Remove the corresponding view when a remote user unpublishes.
	client.on("stream-removed", function(evt){
	    let stream = evt.stream;
	    let streamId = String(stream.getId());
	    stream.close();
	    removeVideoStream(streamId);
	});
	// Remove the corresponding view when a remote user leaves the channel.
	client.on("peer-leave", function(evt){
	    let stream = evt.stream;
	    let streamId = String(stream.getId());
	    stream.close();
	    removeVideoStream(streamId);
	});
  }
    else if(role=='host'){
      var channel = document.querySelector('#channel_name').value
      console.log(channel)
      client.init(options.appId, function() {
          client.join( options.token,channel, username1, function(uid) {
            console.log('the uid is ' , uid)
              // Create the stream for screen sharing.
              const localStream = {
                  streamID: uid,
                  audio: false,
                  video:false,
                  screen: true,
                  screenAudio: true,
                }
                // Set relevant properties according to the browser.
                // Note that you need to implement isFirefox and isCompatibleChrome.

              var screenStream = AgoraRTC.createStream(localStream);
              // Initialize the stream.
              screenStream.init(function() {
                  // Play the stream.
                  screenStream.play('me');
                  // Publish the stream.
                  client.publish(screenStream);

              }, function(err) {
                  console.log(err);
              });

          }, function(err) {
              console.log(err);
          })
      });

    document.getElementById('play-music').onclick=()=>{
      screenStream.startAudioMixing(music_options, function(err){
         if (err){
          console.log("Failed to start audio mixing. " + err);
          }
          console.log('playing')
          screenStream.adjustAudioMixingVolume(volume);

          // Gets the playback position (ms) of the mixed audio.
          screenStream.getAudioMixingCurrentPosition();

          // Sets the playback position of the mixed audio.
          screenStream.setAudioMixingPosition(pos);

          // Pauses audio mixing.
          screenStream.pauseAudioMixing();

          // Resumes audio mixing.
          screenStream.resumeAudioMixing();

          // Gets the duration (ms) of audio mixing. 
          screenStream.getAudioMixingDuration();

          // Stops audio mixing.
          screenStream.stopAudioMixing();
      });
    }
    // Subscribe to the remote stream when it is published
    client.on("stream-added", function(evt){
      client.subscribe(evt.stream, handleError);
      
    });
    // Play the remote stream when it is subsribed
    client.on("stream-subscribed", function(evt){
        let stream = evt.stream;
        let streamId = String(stream.getId());
        addVideoStream(streamId);
        stream.play(streamId);
        console.log('audio muted')
        document.getElementById('mute').onclick = () =>{
          stream.setAudioVolume(0);
          console.log('audio muted')
        }
        
    });

    // Remove the corresponding view when a remote user unpublishes.
    leaveCall.addEventListener('click',function(){
      client.on("stream-removed", function(evt){
        console.log('removing')
          let stream = evt.stream;
          let streamId = String(stream.getId());
          stream.close();
          removeVideoStream(streamId);
      });

      client.on("peer-leave", function(evt){
          let stream = evt.stream;
          let streamId = String(stream.getId());
          stream.close();
          removeVideoStream(streamId);
      });
    })
  }
}




