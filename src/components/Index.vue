<template>
  <div id="container">
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    />
    <audio id="playback" src></audio>
    <h3 id="callsign">{{name}}</h3>

    <div class="roomContainer">
      <input class="room" type="text" name id="roomName" placeholder="Room name" />
      <button
        id="pushBtn"
        class="pushBtn"
        style="font-size: 1em; width: 70px; margin-top: 20px; height: 45px; background-color: #99d8d0; color: #70416d; "
        v-on:click="passData"
      >
        <i class="fa fa-save"></i>
      </button>
    </div>

    <div class="usersContainer">
      <ul id="example-1">
        <li v-for="user in usersInRoom" :key="user">{{ user }}</li>
      </ul>
    </div>

    <div class="pushContainer">
      <button
        id="pushBtn"
        class="pushBtn"
        v-long-press="300"
        @long-press-start="onLongPressStart"
        @long-press-stop="onLongPressStop"
      >
        <i class="fa fa-microphone"></i>
      </button>
    </div>
  </div>
</template>

<script>
import LongPress from "vue-directive-long-press";
import RecordRTCPromisesHandler from "recordrtc";
import { setTimeout } from "timers";

export default {
  name: "Index",
  props: {
    msg: String
  },
  directives: {
    "long-press": LongPress
  },
  data: () => {
    return {
      recorder: null,
      stream: null,
      url: "11",
      name: localStorage.name,
      roomName: "",
      usersInRoom: ["someone 1", "someone 2"]
    };
  },
  sockets: {
    users: function(data) {
      this.usersInRoom = data;
      console.log(data);
    },
    msg: function(data) {
      let audio = document.querySelector("#playback");
      audio.src = data;
      audio.play();
    }
  },
  methods: {
    onLongPressStart() {
      let msg = document.querySelector("#message");
      this.recorder.startRecording();
      // msg.innerHTML = "recording";
    },
    onLongPressStop() {
      this.recorder.stopRecording();
      let msg = document.querySelector("#message");
      let that = this;

      setTimeout(async function() {
        await that.recorder.getDataURL(async url => {
          //do stuff here
          //that.socket.broadcast(this.roomName).emit("msg", url);
          console.log(that.$socket);
          that.$socket.emit("msg", {
            room: that.roomName,
            msg: url
          });
          //that.socket.broadcast.emit(url);
          //socket.in(this.roomName).broadcast.emit("msg", url);
        });
      }, 50);
      //msg.innerHTML = "";
    },
    passData(event) {
      console.log("something");
      let details = {
        roomName: document.querySelector("#roomName").value
      };

      if (
        details.roomName === null ||
        typeof details.roomName === "undefined"
      ) {
        alert("something's missing, be sure to fill the stuff!");
      } else {
        this.roomName = details.roomName;
        this.$socket.emit("create", this.roomName);
        document.querySelector(".roomContainer").style.display = "none";
        document.querySelector(".usersContainer").style.display = "block";
      }
    }
  },
  async created() {
    let stream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true
    });
    this.stream = stream;
    let recorder = new RecordRTCPromisesHandler(this.stream, {
      type: "audio",
      mimeType: "audio/webm"
    });

    this.recorder = recorder;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
::-webkit-input-placeholder {
  text-align: center;
  color: #99d8d0;
  font-size: 1em;
}

:-moz-placeholder {
  /* Firefox 18- */
  text-align: center;
  color: #99d8d0;
  font-size: 1em;
}

::-moz-placeholder {
  /* Firefox 19+ */
  text-align: center;
  color: #99d8d0;
  font-size: 1em;
}

:-ms-input-placeholder {
  text-align: center;
  color: #99d8d0;
  font-size: 1em;
}
#container {
  background-color: #e4f2f0;
  width: 100%;
  height: 90vh;
  border-radius: 25px;
}
.pushContainer {
  position: fixed;
  left: 0;
  width: calc(100% - 80px);
  bottom: 30px;
  margin-left: 40px;
  border-radius: 50px;
  background-color: #99d8d0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pushBtn {
  background-color: #70416d;
  border: none;
  color: #99d8d0;
  height: 70px;
  width: 70px;
  border-radius: 50px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
  margin-right: 10px;
  font-size: 2em;
  outline: none;
  transition: width 1s;
}
.pushBtn:active {
  width: 140px;
}
.roomContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.room {
  padding: 20px;
  width: 25%;
  margin-top: 20px;
  border: none;
  outline: none;
  background-color: #70416d;
  color: #e4f2f0;
  font-size: 1em;
  text-align: center;
  border-radius: 30px;
}
.usersContainer {
  display: none;
}

@media only screen and (max-width: 480px) {
  #container {
    height: 80vh;
  }
  .room {
    width: 75%;
  }
}
</style>
