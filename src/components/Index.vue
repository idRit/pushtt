<template>
  <div id="container">
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    />
    <audio id="playback" src></audio>
    <p id="message"></p>

    <div class="roomContainer">
      <input type="text" name id="room" placeholder="Enter Room name or create one!" />
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
      url: "11"
    };
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

          let audio = document.querySelector("#playback");
          audio.src = url;
          audio.play();
        });
      }, 50);
      msg.innerHTML = "";
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
#room {
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

@media only screen and (max-width: 480px) {
  #container {
    height: 80vh;
  }
  #room {
    width: 75%;
  }
}
</style>
