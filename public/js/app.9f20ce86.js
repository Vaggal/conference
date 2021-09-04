(function(e){function t(t){for(var s,i,a=t[0],c=t[1],d=t[2],l=0,m=[];l<a.length;l++)i=a[l],Object.prototype.hasOwnProperty.call(o,i)&&o[i]&&m.push(o[i][0]),o[i]=0;for(s in c)Object.prototype.hasOwnProperty.call(c,s)&&(e[s]=c[s]);u&&u(t);while(m.length)m.shift()();return r.push.apply(r,d||[]),n()}function n(){for(var e,t=0;t<r.length;t++){for(var n=r[t],s=!0,a=1;a<n.length;a++){var c=n[a];0!==o[c]&&(s=!1)}s&&(r.splice(t--,1),e=i(i.s=n[0]))}return e}var s={},o={app:0},r=[];function i(t){if(s[t])return s[t].exports;var n=s[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=s,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)i.d(n,s,function(t){return e[t]}.bind(null,s));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/";var a=window["webpackJsonp"]=window["webpackJsonp"]||[],c=a.push.bind(a);a.push=t,a=a.slice();for(var d=0;d<a.length;d++)t(a[d]);var u=c;r.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"09c2":function(e,t,n){},"0ecc":function(e,t,n){},1:function(e,t){},"2b19":function(e,t,n){},3806:function(e,t,n){},"3dd0":function(e,t,n){"use strict";n("9833")},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var s=n("2b0e"),o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},r=[],i=(n("5c0b"),n("2877")),a={},c=Object(i["a"])(a,o,r,!1,null,null,null),d=c.exports,u=n("8c4f"),l=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"home container-fluid"},[n("div",{staticClass:"row"},[n("div",{staticClass:"col-sm-2",attrs:{id:"typeArea"}},[n("form",[n("div",{staticClass:"form-group align-items-center text-center"},[n("label",{attrs:{for:"conversationType"}},[e._v("Conversation Type")]),n("select",{staticClass:"custom-select mr-sm-2",attrs:{id:"conversationType",disabled:e.conversationIsSet()},on:{change:function(t){return e.conversationTypeSelected(t)}}},[n("option",{attrs:{selected:""}},[e._v("Choose...")]),n("option",{attrs:{value:"byturn"}},[e._v("By Turn")]),n("option",{attrs:{value:"loose"}},[e._v("Loose")])])])]),e.conversationIsSet()?n("div",{staticClass:"text-center"},[e._v(" Conversation is set to: "),n("br"),n("strong",[e._v(e._s(e.conversation.friendlyType))])]):e._e(),void 0!==e.countdown.secondsLeft?n("Countdown",{attrs:{"seconds-left":e.countdown.secondsLeft,"update-id":e.countdown.updateId}}):e._e()],1),n("div",{staticClass:"col-xs col-sm-7 d-flex flex-column",attrs:{id:"mainArea"}},[n("div",{staticClass:"row d-flex flex-grow-1",attrs:{id:"video-wrapper"}},[n("div",{directives:[{name:"show",rawName:"v-show",value:e.error,expression:"error"}],staticClass:"alert alert-warning",attrs:{id:"errorAlert"}},[n("span",[e._v(e._s(e.error))])]),n("div",{attrs:{id:"localVideoContainer"}},[n("video",{attrs:{id:"localVideo",autoplay:"",muted:""},domProps:{muted:!0}})]),e.conversationIsSet()&&!e.conversationIsLoose()?n("div",{staticClass:"col d-flex"},[n("div",{staticClass:"row flex-grow-1"},[n("div",{staticClass:"col-xs col-sm d-flex justify-content-center embed-responsive"},[e.activePeerExists?n("VideoPlayer",{attrs:{"peer-index":e.activePeer.id,"peer-stream":e.activePeer.stream}}):e._e()],1)])]):e._e(),e.conversationIsSet()&&e.conversationIsLoose()?n("div",{staticClass:"col d-flex"},[n("div",{staticClass:"row flex-grow-1"},e._l(e.peers,(function(t,s){return n("div",{key:s,staticClass:"col-xs col-sm d-flex justify-content-center embed-responsive m-1"},[n("VideoPlayer",{attrs:{"peer-index":s,"peer-stream":t.stream,"conversation-type":e.conversation.type}})],1)})),0)]):e._e()]),n("div",{staticClass:"row mt-1"},[n("div",{staticClass:"col-8 offset-2"},[n("div",{staticClass:"row justify-content-center"},e._l(e.peers,(function(t,s){return n("div",{key:s,staticClass:"col-auto"},[n("PeerThumbnail",{attrs:{"voting-enabled":e.conversationIsSet()&&!e.conversationIsLoose(),"peer-id":t.id,"peer-username":t.username,"peer-active":t.active,"peer-votes":e.getPeerVotes(t.id)},on:{"votes-increment":function(t){return e.incrementVotes(t)}}})],1)})),0)]),n("div",{staticClass:"col-2 d-flex justify-content-center"},[n("SelfThumbnail",{attrs:{"voting-enabled":e.conversationIsSet()&&!e.conversationIsLoose(),"self-username":e.self.username,"self-active":e.self.active,"self-votes":e.getPeerVotes(e.self.id)}})],1)])]),n("div",{staticClass:"col-sm-3"},[n("Chat",{attrs:{comments:e.comments,"self-id":e.self.id},on:{"new-comment":e.sendComment}})],1)]),n("Overlay",{on:{"save-username":e.saveUsername}})],1)},m=[],f=(n("4de4"),n("7db0"),n("4160"),n("b64b"),n("159b"),n("b85c")),v=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("video",{staticClass:"embed-responsive-item",attrs:{id:e.peerIndexId,autoplay:""}})},p=[],h=(n("a9e3"),{name:"VideoPlayer",props:{peerIndex:{type:Number,default:1e3},peerStream:MediaStream},data:function(){return{peerIndexId:"peer"+this.peerIndex}},watch:{peerIndex:function(){this.peerIndexId="peer"+this.peerIndex}},updated:function(){this.setVideoStream()},mounted:function(){this.setVideoStream()},methods:{setVideoStream:function(){var e=document.getElementById(this.peerIndexId);e.srcObject=this.peerStream}}}),g=h,b=Object(i["a"])(g,v,p,!1,null,"6fbcce6b",null),y=b.exports,C=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"thumbnail",class:{active:e.peerActive,votable:e.votingEnabled&&!e.voted},on:{click:e.incrementVotes}},[n("div",[n("font-awesome-icon",{staticClass:"peer-icon",attrs:{icon:"user"}}),e.votingEnabled?n("span",{staticClass:"user-badge badge badge-pill badge-info"},[e._v(" "+e._s(e.votes)+" ")]):e._e()],1),n("div",[e._v(e._s(e.peerUsername))])])},w=[],_={name:"PeerThumbnail",props:{votingEnabled:Boolean,peerId:{type:Number,default:0},peerUsername:{type:String,default:""},peerActive:Boolean,peerVotes:{type:Number,default:0}},data:function(){return{voted:!1,votes:this.peerVotes}},watch:{peerVotes:function(){0==this.peerVotes&&(this.voted=!1),this.votes=this.peerVotes}},methods:{incrementVotes:function(){this.votingEnabled&&!this.voted&&(this.voted=!0,this.votes++,this.$emit("votes-increment",this.peerId))}}},x=_,I=(n("b99d"),Object(i["a"])(x,C,w,!1,null,"bf760c56",null)),P=I.exports,S=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"thumbnail",class:{active:e.selfActive}},[n("div",[n("font-awesome-icon",{staticClass:"self-icon",attrs:{icon:"user-alt"}}),e.votingEnabled?n("span",{staticClass:"user-badge badge badge-pill badge-info"},[e._v(e._s(e.votes))]):e._e()],1),n("div",[e._v(e._s(e.selfUsername))])])},T=[],E={name:"SelfThumbnail",props:{votingEnabled:Boolean,selfActive:Boolean,selfUsername:{type:String,default:""},selfVotes:{type:Number,default:0}},data:function(){return{votes:this.selfVotes}},watch:{selfVotes:function(){this.votes=this.selfVotes}}},k=E,j=(n("dc2a"),Object(i["a"])(k,S,T,!1,null,"4798914e",null)),O=j.exports,V=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"base-timer mt-3"},[n("svg",{attrs:{viewBox:"0 0 100 100",xmlns:"http://www.w3.org/2000/svg"}},[n("g",{staticClass:"base-timer-circle"},[n("circle",{staticClass:"base-timer-path-elapsed",attrs:{cx:"50",cy:"50",r:"45"}}),n("text",{staticClass:"svg-text",attrs:{x:"50%",y:"50%","text-anchor":"middle",dy:".3em"}},[e._v(" "+e._s(e.minutes)+":"+e._s(e.seconds)+" ")]),n("path",{staticClass:"base-timer-path-remaining",class:e.currentColor,attrs:{id:"base-timer-path-remaining","stroke-dasharray":"283",d:"M 50, 50\n            m -45, 0\n            a 45,45 0 1,0 90,0\n            a 45,45 0 1,0 -90,0"}})])])])},L=[],A=(n("fb6a"),n("b680"),n("66d4")),R={name:"Countdown",props:{secondsLeft:{type:Number,default:0},updateId:{type:String,default:"0"}},data:function(){return{timer:new A["Timer"],minutes:0,seconds:0,colorCodes:{info:{color:"green"},warning:{color:"orange",threshold:Math.round(.3*this.secondsLeft)},alert:{color:"red",threshold:Math.round(.1*this.secondsLeft)}},currentColor:"green",fullDashArray:283}},watch:{updateId:{immediate:!0,handler:function(){this.colorCodes.warning.threshold=Math.round(.3*this.secondsLeft),this.colorCodes.alert.threshold=Math.round(.1*this.secondsLeft),this.startTimer()}}},methods:{startTimer:function(){var e=this;this.currentColor=this.colorCodes.info.color,this.timer.stop(),this.timer.start({startValues:{seconds:this.secondsLeft},precision:"seconds",target:0,countdown:!0}),this.timer.addEventListener("secondsUpdated",(function(){var t=e.timer.getTimeValues();e.minutes=t.minutes,e.seconds=("0"+t.seconds).slice(-2);var n=e.timer.getTotalTimeValues(),s=e.secondsLeft-(e.secondsLeft-n.seconds);e.setCircleDasharray(s),e.setRemainingPathColor(s)}))},setRemainingPathColor:function(e){e<=this.colorCodes.alert.threshold?this.currentColor=this.colorCodes.alert.color:e<=this.colorCodes.warning.threshold&&(this.currentColor=this.colorCodes.warning.color)},calculateTimeFraction:function(e){var t=e/this.secondsLeft;return t-1/this.secondsLeft*(1-t)},setCircleDasharray:function(e){var t="".concat((this.calculateTimeFraction(e)*this.fullDashArray).toFixed(0)," 283");document.getElementById("base-timer-path-remaining").setAttribute("stroke-dasharray",t)}}},$=R,B=(n("9b0d"),Object(i["a"])($,V,L,!1,null,"a4b2eff4",null)),U=B.exports,M=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"chat"},[n("div",{staticClass:"card chat-card"},[e._m(0),n("div",{ref:"cardBody",staticClass:"card-body msg_card_body"},e._l(e.comments,(function(t,s){return n("div",{key:s,staticClass:"d-flex mb-4",class:[t.userId==e.selfId?"justify-content-start flex-row-reverse":"justify-content-start flex-row"]},[n("div",{staticClass:"img_cont_msg flex-shrink-0"},[n("span",[e._v(e._s(t.username.charAt(0)))])]),n("div",{class:[t.userId==e.selfId?"msg_container_send":"msg_container"]},[n("div",{staticClass:"msg_username_container"},[n("span",{class:[t.userId==e.selfId?"msg_username_send":"msg_username"]},[e._v(e._s(t.username))])]),n("div",{staticClass:"msg"},[e._v(" "+e._s(t.message)+" ")]),n("span",{class:[t.userId==e.selfId?"msg_time_send":"msg_time"]},[e._v(e._s(t.fromNow))])])])})),0),n("div",{staticClass:"card-footer"},[n("div",{staticClass:"input-group"},[n("textarea",{directives:[{name:"model",rawName:"v-model",value:e.message,expression:"message"}],staticClass:"form-control type_msg",attrs:{placeholder:"Write your message..."},domProps:{value:e.message},on:{input:function(t){t.target.composing||(e.message=t.target.value)}}}),n("div",{staticClass:"input-group-append",on:{click:function(t){return e.sendComment(t)}}},[n("span",{staticClass:"input-group-text send_btn"},[n("font-awesome-icon",{attrs:{icon:"location-arrow"}})],1)])])])])])},N=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"card-header msg_head"},[n("span",[e._v("Chat with peers")])])}],D=(n("498a"),n("19e9")),F=n.n(D),H=n("6de8"),q={name:"Chat",props:{comments:{type:Array,default:function(){return[]}},selfId:{type:Number,default:0}},data:function(){return{message:"",commentsCount:0}},watch:{},updated:function(){this.commentsCount<this.comments.length&&(this.commentsCount=this.comments.length,this.$refs.cardBody.scrollTop=this.$refs.cardBody.scrollHeight)},mounted:function(){var e=this,t=document.querySelector("textarea");F()(t),t.addEventListener("keydown",(function(t){t.ctrlKey||13!==t.keyCode?t.ctrlKey&&13===t.keyCode&&(e.message+="\n"):(t.preventDefault(),e.sendComment())})),setInterval((function(){e.comments.forEach((function(e){var t="just now"===Object(H["a"])(e.date)?"":" ago";e.fromNow=Object(H["a"])(e.date)+t}))}),1e3)},methods:{sendComment:function(){this.message.trim().length>0&&this.$emit("new-comment",this.message),this.message=""}}},J=q,K=(n("8eb2"),Object(i["a"])(J,M,N,!1,null,"4404d9e6",null)),W=K.exports,Y=(n("4989"),n("ec26")),z=(n("3410"),n("131a"),n("d3b7"),n("8055")),G=n.n(z);if("undefined"===typeof G.a)throw new Error("Socket.io required");var Q,X=G.a,Z="production";Q="production"===Z?window.location.host:"localhost:5555";var ee,te,ne,se={SignalingServerUrl:Q,RTCConfiguration:{iceServers:[{urls:"stun:stun.l.google.com:19302"}]}},oe=se,re=n("e0ef"),ie=n.n(re),ae={},ce=!1;function de(e){return ae[e]?ae[e]:ue(e)}function ue(e){var t=new RTCPeerConnection(oe.RTCConfiguration);return ae[e]=t,ne.getTracks().forEach((function(e){t.addTrack(e,ne)})),t.onicecandidate=function(t){fe.emit("msg",{by:ee,username:te,to:e,ice:t.candidate,type:"ice"})},t.ontrack=function(t){ve.trigger("peer.track",[{id:e,track:t.track}])},t}function le(e){var t=de(e);t.createOffer({mandatory:{offerToReceiveVideo:!0,offerToReceiveAudio:!0}}).then((function(n){t.setLocalDescription(n),console.log("Creating an offer for",e),fe.emit("msg",{by:ee,username:te,to:e,sdp:n,type:"sdp-offer"})})).catch((function(e){console.log("Error making offer: ",e)}))}function me(e){var t,n=de(e.by);switch(e.type){case"sdp-offer":t=new RTCSessionDescription(e.sdp),n.setRemoteDescription(t).then((function(){console.log("Setting remote description by offer"),n.createAnswer().then((function(t){n.setLocalDescription(t),fe.emit("msg",{by:ee,username:te,to:e.by,sdp:t,type:"sdp-answer"})})).catch((function(e){console.log("Error creating answer: ",e)}))})).catch((function(e){console.log("Error setting remote description: ",e)})),ve.trigger("add.peer",[{id:e.by,username:e.username}]);break;case"sdp-answer":t=new RTCSessionDescription(e.sdp),ve.trigger("add.peer",[{id:e.by,username:e.username}]),n.setRemoteDescription(t).then((function(){console.log("Set the remote description by answer")})).catch((function(e){console.log("Error setting remote description: ",e)}));break;case"ice":if(e.ice){console.log("Adding ice candidates");var s=new RTCIceCandidate(e.ice);n.addIceCandidate(s)}break}}var fe=X.connect(oe.SignalingServerUrl);fe.on("peer.connected",(function(e){console.log("peer.connected: ",e),le(e.id)})),fe.on("peer.disconnected",(function(e){ve.trigger("peer.disconnected",[e])})),fe.on("msg",(function(e){me(e)})),fe.on("comment",(function(e){ve.trigger("comment",[e])})),fe.on("votes.update",(function(e){ve.trigger("votes.update",[e])})),fe.on("conversation.type.set",(function(e){ve.trigger("conversation.type.set",[e])})),fe.on("active.peer",(function(e){ve.trigger("active.peer",[e])})),fe.on("time.left",(function(e){ve.trigger("time.left",[e])}));var ve={joinRoom:function(e){var t=new Promise((function(t,n){ce?n():(fe.emit("init",{room:e,username:te},(function(e,n){t(),ee=n})),ce=!0)}));return t},createRoom:function(){var e=new Promise((function(e){fe.emit("init",{username:te},(function(t,n,s){ve.trigger("conversation.type.set",[s]),e(t),ee=n,ce=!0}))}));return e},init:function(e){ne=e},getSelfId:function(){return ee},setSelfUsername:function(e){te=e}},pe=new ie.a;Object.setPrototypeOf(ve,Object.getPrototypeOf(pe)),ve.on("votes.increment",(function(e){fe.emit("votes.increment",{id:e})})),ve.on("conversation.type.selected",(function(e,t){fe.emit("conversation.type.selected",{by:e,conversation:{type:t}})})),ve.on("new-comment",(function(e,t,n){fe.emit("new-comment",{message:e,id:t,username:n})}));var he=ve,ge=n("5014"),be=n.n(ge);function ye(e){var t=e.target,n=parseFloat(t.getAttribute("data-x"))||0,s=parseFloat(t.getAttribute("data-y"))||0;n+=e.dx,s+=e.dy,e.target.style.webkitTransform=e.target.style.transform="translate("+n+"px, "+s+"px)",t.setAttribute("data-x",n),t.setAttribute("data-y",s)}var Ce,we=function(e){be()(e).draggable({inertia:!0,restrict:{restriction:"parent",endOnly:!0,elementRect:{top:0,left:0,bottom:1,right:1}},onmove:window.dragMoveListener}).on("dragmove",ye)},_e={setup:we},xe={audio:!0,video:!0},Ie=function(){var e=new Promise((function(e,t){Ce?e(Ce):navigator.mediaDevices.getUserMedia(xe).then((function(t){t.onremovetrack=function(e){console.log("Removed track: ",e)},Ce=t,e(Ce)})).catch((function(e){t(e)}))}));return e},Pe={get:Ie},Se=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"overlay",class:{invisible:e.usernameSaved}},[n("div",{staticClass:"centering-wrapper"},[e._m(0),n("div",{staticClass:"form-container"},[n("div",{staticClass:"note mb-2"},[e._v(" Please set a username before entering the chat ")]),n("form",{staticClass:"form-inline",attrs:{id:"username-form"},on:{submit:function(t){return t.preventDefault(),e.saveUsername()}}},[n("div",{staticClass:"form-group"},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.username,expression:"username"}],staticClass:"form-control",attrs:{id:"username-input",type:"text","aria-describedby":"username",placeholder:"Enter username"},domProps:{value:e.username},on:{input:function(t){t.target.composing||(e.username=t.target.value)}}})]),n("button",{staticClass:"btn btn-primary ml-1",attrs:{type:"button"},on:{click:function(t){return e.saveUsername()}}},[e._v(" Save ")])])])])])},Te=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"header-container"},[n("h1",{staticClass:"header"},[e._v("THESIS CHAT")])])}],Ee={name:"Overlay",data:function(){return{usernameSaved:!1,username:""}},mounted:function(){document.getElementById("username-input").focus()},methods:{saveUsername:function(){this.usernameSaved=!0,this.$emit("save-username",this.username)}}},ke=Ee,je=(n("b5ca"),Object(i["a"])(ke,Se,Te,!1,null,null,null)),Oe=je.exports,Ve={name:"Room",components:{VideoPlayer:y,PeerThumbnail:P,SelfThumbnail:O,Countdown:U,Chat:W,Overlay:Oe},data:function(){return{error:"",self:{username:"",id:void 0,stream:void 0,active:!1},peers:[],activePeer:{},votes:[],conversation:{type:""},countdown:{secondsLeft:void 0,updateId:void 0},comments:[]}},beforeMount:function(){},mounted:function(){document.getElementById("username-input").focus();var e=document.getElementById("localVideo");_e.setup(e)},methods:{isNumeric:function(e){return/^\d+$/.test(e)},incrementVotes:function(e){he.trigger("votes.increment",[e])},activePeerExists:function(){return Object.keys(this.activePeer).length>0},conversationIsSet:function(){return""!==this.conversation.type},conversationIsLoose:function(){return"loose"===this.conversation.type},getPeerFromId:function(e){if(this.self.id==e)return this.self;var t,n=Object(f["a"])(this.peers);try{for(n.s();!(t=n.n()).done;){var s=t.value;if(s.id==e)return s}}catch(o){n.e(o)}finally{n.f()}},conversationTypeSelected:function(e){"byturn"!==e.target.value&&"loose"!==e.target.value||he.trigger("conversation.type.selected",[this.self.id,e.target.value])},activatePeer:function(e){this.activePeer.id=e.id,this.activePeer.username=e.username,this.activePeer.stream=e.stream.clone(),this.activePeer.stream.getTracks().forEach((function(e){e.enabled=!0})),this.activePeer.active=!0,e.active=!0,e.id==this.self.id&&(this.self.active=!0)},deactivatePeer:function(){this.activePeer.active,this.activePeer.stream.getTracks().forEach((function(e){e.enabled=!1}));var e=this.getPeerFromId(this.activePeer.id);e.active=!1,e.id!=this.self.id&&e.stream.getTracks().forEach((function(e){e.enabled=!1}))},sendComment:function(e){he.trigger("new-comment",[e,this.self.id,this.self.username])},saveUsername:function(e){this.self.username=e,he.setSelfUsername(this.self.username),this.setupSocketCommunication()},getPeerVotes:function(e){var t=this.votes.find((function(t){return t.id===e})),n=0;return t&&(n=t.votes),n},setupSocketCommunication:function(){var e=this;window.RTCPeerConnection&&navigator.getUserMedia?(Pe.get().then((function(t){e.self.stream=t,he.init(e.self.stream),e.$route.params.roomId?he.joinRoom(e.$route.params.roomId).then((function(){e.self.id=he.getSelfId()})).catch((function(e){console.log("Error joining room: ",e)})):he.createRoom().then((function(t){e.self.id=he.getSelfId(),e.$router.push({name:"active-room",params:{roomId:t}})})).catch((function(e){console.log("Error creating room: ",e)}));var n=document.getElementById("localVideo");n.srcObject=e.self.stream})).catch((function(t){console.log("Error getting local video stream: ",t),e.error="No audio/video permissions. Please refresh your browser and allow the audio/video capturing."})),he.on("add.peer",(function(t){var n=new MediaStream;e.peers.push({id:t.id,username:t.username,stream:n,active:!1})})),he.on("peer.track",(function(t){e.peers.forEach((function(e){e.id===t.id&&(console.log("Adding new track for client"),t.track.enabled=!1,e.stream.addTrack(t.track))}))})),he.on("peer.disconnected",(function(t){console.log("Client disconnected, removing stream"),e.peers=e.peers.filter((function(e){return e.id!==t.id}))})),he.on("comment",(function(t){t.fromNow="just now",e.comments.push(t)})),he.on("votes.update",(function(t){e.votes=t})),he.on("conversation.type.set",(function(t){"loose"===t.type?(e.peers.forEach((function(e){e.active=!0,e.stream.getTracks().forEach((function(e){e.enabled=!0}))})),e.conversation=t,e.conversation.friendlyType="Loose"):"byturn"===t.type&&(e.conversation=t,e.conversation.friendlyType="By Turn")})),he.on("time.left",(function(t){e.countdown.secondsLeft=t,e.countdown.updateId=Object(Y["a"])()})),he.on("active.peer",(function(t){if(t!=e.activePeer.id){e.activePeerExists()&&e.deactivatePeer();var n=e.getPeerFromId(t);e.activatePeer(n)}}))):this.error="WebRTC is not supported by your browser. You can try the app with Chrome and Firefox."}}},Le=Ve,Ae=(n("3dd0"),Object(i["a"])(Le,l,m,!1,null,null,null)),Re=Ae.exports;s["a"].use(u["a"]);var $e=new u["a"]({mode:"history",base:"/",routes:[{path:"/room/:roomId",name:"active-room",component:Re},{path:"/room",name:"room",component:Re},{path:"*",name:"default-room",component:Re}]}),Be=(n("d093"),n("ecee")),Ue=n("ad3d"),Me=n("c074");Be["c"].add([Me["d"],Me["e"],Me["a"],Me["b"],Me["c"]]),s["a"].component("FontAwesomeIcon",Ue["a"]),s["a"].config.productionTip=!1,new s["a"]({router:$e,render:function(e){return e(d)}}).$mount("#app")},"5c0b":function(e,t,n){"use strict";n("9c0c")},"8eb2":function(e,t,n){"use strict";n("0ecc")},9833:function(e,t,n){},"9b0d":function(e,t,n){"use strict";n("3806")},"9c0c":function(e,t,n){},b5ca:function(e,t,n){"use strict";n("09c2")},b99d:function(e,t,n){"use strict";n("ef3f")},dc2a:function(e,t,n){"use strict";n("2b19")},ef3f:function(e,t,n){}});
//# sourceMappingURL=app.9f20ce86.js.map