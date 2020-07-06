!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).MeetJS=e()}}((function(){return function e(t,n,s){function o(i,a){if(!n[i]){if(!t[i]){var c="function"==typeof require&&require;if(!a&&c)return c(i,!0);if(r)return r(i,!0);var l=new Error("Cannot find module '"+i+"'");throw l.code="MODULE_NOT_FOUND",l}var d=n[i]={exports:{}};t[i][0].call(d.exports,(function(e){return o(t[i][1][e]||e)}),d,d.exports,e,t,n,s)}return n[i].exports}for(var r="function"==typeof require&&require,i=0;i<s.length;i++)o(s[i]);return o}({1:[function(e,t,n){t.exports=function(e){e.events={},e.on=function(t,n){"object"!=typeof e.events[t]&&(e.events[t]=[]),e.events[t].push(n)},e.off=function(t,n){let s;"object"==typeof e.events[t]&&(s=e.events[t].indexOf(n),s>-1&&e.events[t].splice(s,1))},e.emit=function(t){var n,s,o,r=[].slice.call(arguments,1);if("object"==typeof e.events[t])for(o=(s=e.events[t].slice()).length,n=0;n<o;n++)s[n].apply(e,r)},e.once=function(t,n){e.on(t,(function s(){e.off(t,s),n.apply(e,arguments)}))}}},{}],2:[function(e,t,n){const s={iceServers:[{urls:["stun:stun.l.google.com:19302"]},{url:"turn:numb.viagenie.ca",credential:"muazkh",username:"webrtc@live.com"}]},o={optional:[{RtpDataChannels:!0}]},r={offerToReceiveAudio:!0,offerToReceiveVideo:!0};class i extends RTCPeerConnection{constructor(e,t=null){super(s,o),this.ms=e,this.peerName=e.userName,this.remotePeer=null,this.rStream=null,this.lStream=null,this.gotStream=null,this.intimateOffer=null,this.awaitOffer=null,this.handleCallEvents=null,this.configureDataChannel(),super.onicecandidate=this.onicecandidate,super.onnegotiationneeded=this.onnegotiationneeded,super.ontrack=this.ontrack,console.log(e.userName+" peer started")}configureDataChannel=()=>{this.dataChannel=this.createDataChannel("dataChannel",{reliable:!0}),this.dataChannel.onerror=function(e){console.log("Error occured on datachannel:",e)},this.dataChannel.onmessage=function(e){console.log("message:",e)},this.dataChannel.onclose=function(){console.log("data channel is closed")},this.callState=!1};configureStream=e=>{e&&(this.lStream=e,e.getTracks().forEach(t=>this.addTrack(t,e)),console.log("stream added : "+e.id))};ontrack=e=>{this.lStream.id!==e.streams[0].id&&(console.log("stream received"),console.log(e.streams[0]),this.rStream=e.streams[0],this.gotStream(this))};setUserName=e=>{this.peerName=e};sendMessage=e=>{console.log("Messaging via data channel"),this.dataChannel.send(JSON.stringify(e))};sendOffer=e=>{this.remotePeer=e,this.createOffer(r).then(this.prepareOffer).catch(e=>this.onError(e))};prepareOffer=e=>{this.localOffer=e,this.setLocalDescription(e),console.log("sending offer"),this.ms.send({peerName:this.peerName,remotePeer:this.remotePeer,event:"offer",data:e})};onnegotiationneeded=()=>{this.callState&&(this.sendOffer(this.remotePeer),console.log("re negotiation is happening"))};onicecandidate=e=>{e.candidate&&(this.ms.send({peerName:this.peerName,remotePeer:this.remotePeer,event:"candidate",data:e.candidate}),console.log("sending iceCandidate to "+this.remotePeer))};acceptOffer=e=>{this.sendOffer(e)};sendInvite=e=>{this.ms.send({peerName:this.peerName,remotePeer:e,event:"invite"})};rejectOffer=e=>{console.log(this.remotePeer,e),this.remotePeer===e?this.ms.send({peerName:this.peerName,remotePeer:this.remotePeer,event:"reject",data:"i can't take calls right now"}):console.log("Peer Invalid")};cancelOffer=e=>{this.remotePeer===e&&this.ms.send({peerName:this.peerName,remotePeer:this.remotePeer,event:"cancel"})};endCall=()=>{this.ms.send({peerName:this.peerName,remotePeer:this.remotePeer,event:"bye",data:"I am gonna end the call!"})};handleOffer=e=>{this.setRemoteDescription(new RTCSessionDescription(e)),this.createAnswer().then(e=>{this.setLocalDescription(e),this.ms.send({peerName:this.peerName,remotePeer:this.remotePeer,event:"answer",data:e}),this.callState=!0,console.log("connection established successfully!!")}).catch(e=>this.onError(e))};handleCandidate=e=>{this.addIceCandidate(new RTCIceCandidate(e)),console.log("Candidate received")};handleAnswer=e=>{this.setRemoteDescription(new RTCSessionDescription(e)),this.callState=!0,console.log("connection established successfully!!")};onError=e=>{console.error(e)}}t.exports=i},{}],3:[function(e,t,n){var s=e("./SignalingChannel"),o=e("./MeetPeer"),r=e("./MessageHandler"),i=e("./EventEmitter"),a={userName:"user"+Math.floor(100*Math.random())+1,transportUrl:{origin:window.location.origin.replace("http","ws"),local:"ws://localhost:8080",remote:"wss://meet-v1.herokuapp.com"},mediaConstrains:{video:!0,audio:!0}};t.exports=function(e){var t;i(this),this.users=[],this.localVideo=async()=>{let t=await navigator.mediaDevices.getUserMedia(e.mediaConstrains||a.mediaConstrains);window.localStream=t,this.emit("devices-connected")},this.on("localVideoConnect",this.localVideo),this.on("connect",n=>{n||console.log("No userName provided, Fallback to random"),this.userName=n||a.userName,(t=window.transport=new s(this.userName,(e.contextPath?e.contextPath:"meet")+(e.token?"?jwt="+e.token:""),e.url||a.transportUrl.local)).onready=e=>{this.emit("ready",e)},t.onmessage=e=>{r(e,this)}}),this.on("sendMessage",({remotePeer:e,data:n})=>{t.send({peerName:this.userName,remotePeer:e,event:"message",data:n})});var n=e=>{var t;return this.users[e]?("failed"===(t=this.users[e]).connectionState&&(delete this.users[e],t=l(e)),t):t=l(e)};this.getUser=n,this.on("conference",({remotePeer:e,users:n})=>{t.send({peerName:this.userName,remotePeer:e,event:"conference",data:{users:n}})}),this.on("conference-connect",e=>{e.users&&(console.log("confere",e),window.conference=e.users,e.users.forEach(e=>{n(e).sendOffer(e)}))}),this.on("createOrGetUser",e=>n(e)),this.on("call",e=>{console.log("calling "+e),this.emit("localVideoConnect"),this.once("devices-connected",()=>{n(e).sendInvite(e)})}),this.on("accept",e=>{console.log("accepting invite from "+e),this.emit("localVideoConnect"),this.once("devices-connected",()=>{n(e).acceptOffer(e)})}),this.on("cancel",e=>{console.log("cancelling the invite from "+e),n(e).cancelOffer(e)}),this.on("reject",e=>{console.log("rejecting the invite from "+e),n(e).rejectOffer(e)}),this.on("bye",e=>{console.log("Hanging up call with "+e),n(e).endCall()}),this.on("removeUser",e=>{n(e).close(),delete this.users[e]});var c=e=>{var t=e.currentTarget;"disconnected"===t.connectionState&&this.emit("disconnected",t.remotePeer),console.log(t.remotePeer,t.connectionState)},l=e=>{var t=new o(window.transport);return t.remotePeer=e,t.gotStream=e=>{this.emit("gotStream",e)},t.onconnectionstatechange=c,t.configureStream(window.localStream),this.users[e]=t,t};window.MeetJS=this}},{"./EventEmitter":1,"./MeetPeer":2,"./MessageHandler":4,"./SignalingChannel":5}],4:[function(e,t,n){const s=(e,t)=>{console.log("received call event"),e.event&&("cancel"===e.event&&t.emit("cancel",e.peerName),"reject"===e.event&&t.emit("reject",e.peerName))},o=(e,t)=>{console.log("received invite"),t.emit("invite",e.peerName)},r=(e,t)=>{console.log("received a ping from "+e.peerName+" with the message "+e.data.message)},i=(e,t)=>{console.log("received offer"),t.getUser(e.peerName).handleOffer(e.data)},a=(e,t)=>{console.log("received iceCandidate from "+e.peerName),t.getUser(e.peerName).handleCandidate(e.data)},c=(e,t)=>{console.log("received answer"),t.getUser(e.peerName).handleAnswer(e.data)};t.exports=(e,t)=>{const n=JSON.parse(e.data);if("pong"!==n.event&&"ping"!==n.event)if(t.userName===n.remotePeer)switch(console.log("MessageHandler",n),n.event){case"offer":i(n,t);break;case"answer":c(n,t);break;case"candidate":a(n,t);break;case"ping":r(n,t);break;case"reject":case"cancel":s(n,t);break;case"invite":o(n,t);break;case"bye":t.emit("bye"),t.emit("removeUser",n.peerName);break;case"message":t.emit("receivedMessage",{userName:n.peerName,data:n.data});case"conference":t.emit("conference-connect",n.data)}else console.log("rejecting message",n)}},{}],5:[function(e,t,n){class s extends WebSocket{constructor(e=null,t="",n=null){const s=(n?"":"https:"===window.location.protocol?"wss://":"ws://")+(null!==n?n:window.location.host)+"/"+t;console.log("connecting... "+s),super(s),this.userName=e,console.log("connected as "+this.userName),this.getUser=null,this.timerID=0,super.onopen=this.onopen,this.interval=29,this.id=Math.floor(2*Math.random())+1}addMp=e=>{this.mp=e};keepAlive=()=>{var e=1e3*this.interval;this.readyState===this.OPEN&&(console.log("Pinging server ... idle timeout: "+e/1e3+"s"),this.send({peerName:this.userName,event:"ping",data:{message:"hello"}})),this.timerId=setTimeout(this.keepAlive,e)};cancelKeepAlive=()=>{this.timerId&&clearTimeout(this.timerId)};onopen=()=>{this.onready(this.url),this.send({peerName:this.userName,peerId:this.id,event:"ping",data:{message:"hello"}}),this.keepAlive()};send=e=>{this.readyState!==this.OPEN?setTimeout(()=>{this.send(e)},1e3):super.send(JSON.stringify(e))};onclose=()=>{console.log("closing"),this.cancelKeepAlive()}}t.exports=s},{}]},{},[3])(3)}));