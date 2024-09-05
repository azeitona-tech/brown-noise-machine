<template>
  <div
    v-if="brownNoise"
    class="audio-player flex flex-col items-center space-y-4 text-emerald-200"
  >
    <audio ref="audioPlayer">
      <source :src="brownNoise" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>

    <section
      class="flex flex-col gap-4 border border-emerald-200 p-6 rounded rounded-xl"
    >
      <div class="flex flex-col justify-start">
        <span class="text-xl">Play Window</span>
        <div class="flex space-x-2">
          <input
            type="number"
            class="w-12 border border-emerald-200 bg-transparent rounded px-2 py-1 text-center focus:bg-emerald-200 focus:text-emerald-950 outline-none"
            v-model="play.hours"
            placeholder="0"
            min="0"
            max="6"
          />
          <input
            type="number"
            class="w-12 border border-emerald-200 bg-transparent rounded px-2 py-1 text-center focus:bg-emerald-200 focus:text-emerald-950 outline-none"
            v-model="play.minutes"
            placeholder="0"
            min="0"
            max="59"
          />
          <input
            type="number"
            class="w-12 border border-emerald-200 bg-transparent rounded px-2 py-1 text-center focus:bg-emerald-200 focus:text-emerald-950 outline-none"
            v-model="play.seconds"
            placeholder="0"
            min="0"
            max="59"
          />
        </div>
        <span v-if="isPlaying && isLooping" class="text-md">{{
          this.formattedCountdown
        }}</span>
      </div>

      <div class="flex flex-col justify-start mt-4">
        <span class="text-xl">Pause Window</span>
        <div class="flex space-x-2">
          <input
            type="number"
            class="w-12 border border-emerald-200 bg-transparent rounded px-2 py-1 text-center focus:bg-emerald-200 focus:text-emerald-950 outline-none"
            v-model="pause.hours"
            placeholder="0"
            min="0"
            max="6"
          />
          <input
            type="number"
            class="w-12 border border-emerald-200 bg-transparent rounded px-2 py-1 text-center focus:bg-emerald-200 focus:text-emerald-950 outline-none"
            v-model="pause.minutes"
            placeholder="0"
            min="0"
            max="59"
          />
          <input
            type="number"
            class="w-12 border border-emerald-200 bg-transparent rounded px-2 py-1 text-center focus:bg-emerald-200 focus:text-emerald-950 outline-none"
            v-model="pause.seconds"
            placeholder="0"
            min="0"
            max="59"
          />
        </div>
        <span v-if="!isPlaying && isLooping" class="text-md">{{
          this.formattedCountdown
        }}</span>
      </div>
      <div class="controls flex items-center space-x-4">
        <button
          @click="startStop"
          class="px-4 py-2 bg-emerald-800 rounded rounded-full hover:bg-emerald-500"
        >
          {{ isLooping ? "Stop" : "Start" }}
        </button>

        <div class="flex items-center space-x-2">
          <label class="text-emerald-500">Volume:</label>
          <input
            type="range"
            v-model="volume"
            min="0"
            max="1"
            step="0.01"
            @input="setVolume"
            class="w-32 bg-transparent appearance-none"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      brownNoise:
        "https://dn720003.ca.archive.org/0/items/brownnoise_202103/10%20HOURS%20BROWN%20NOISE%20Noise%20Blocker%20for%20Sleep%2C%20Study%2C%20Tinnitus%20%2C%20insomnia.mp3",
      isPlaying: false,
      isLooping: false,
      volume: 1,
      currentTime: 0,
      duration: 0,
      countdownInterval: null,
      play: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      pause: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      totalTimeInSeconds: 0,
      formattedCountdown: "",
    };
  },
  mounted() {
    const audio = this.$refs.audioPlayer;
    audio.volume = this.volume;

    audio.onloadedmetadata = () => {
      this.duration = audio.duration;
    };

    audio.ontimeupdate = () => {
      this.currentTime = audio.currentTime;
    };
  },
  computed: {
    playHours() {
      return this.play.hours > 99
        ? 99
        : this.play.hours < 0
        ? 0
        : this.play.hours;
    },
    playMinutes() {
      return this.play.minutes > 59
        ? 59
        : this.play.minutes < 0
        ? 0
        : this.play.minutes;
    },
    playSeconds() {
      return this.play.seconds > 59
        ? 59
        : this.play.seconds < 0
        ? 0
        : this.play.seconds;
    },
    pauseHours() {
      return this.pause.hours > 99
        ? 99
        : this.pause.hours < 0
        ? 0
        : this.pause.hours;
    },
    pauseMinutes() {
      return this.pause.minutes > 59
        ? 59
        : this.pause.minutes < 0
        ? 0
        : this.pause.minutes;
    },
    pauseSeconds() {
      return this.pause.seconds > 59
        ? 59
        : this.pause.seconds < 0
        ? 0
        : this.pause.seconds;
    },
  },
  watch: {
    // Watchers to update the model values with the computed properties when user inputs are invalid
    playHours(newValue) {
      this.play.hours = newValue;
    },
    playMinutes(newValue) {
      this.play.minutes = newValue;
    },
    playSeconds(newValue) {
      this.play.seconds = newValue;
    },
    pauseHours(newValue) {
      this.pause.hours = newValue;
    },
    pauseMinutes(newValue) {
      this.pause.minutes = newValue;
    },
    pauseSeconds(newValue) {
      this.pause.seconds = newValue;
    },
  },
  methods: {
    playPause() {
      const audio = this.$refs.audioPlayer;
      if (this.isPlaying) {
        audio.pause();
      } else {
        audio.currentTime = 5;
        audio.play();
      }
      this.isPlaying = !this.isPlaying;
    },
    startStop() {
      const audio = this.$refs.audioPlayer;

      if (!this.isLooping) {
        this.isLooping = true;

        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
        }

        this.countdownInterval = setInterval(() => {
          let totalTimeInSeconds = this.totalTimeInSeconds;

          if (totalTimeInSeconds > 0) {
            totalTimeInSeconds--;
            this.formattedCountdown = `${Math.floor(
              totalTimeInSeconds / 3600
            )}:${Math.floor((totalTimeInSeconds % 3600) / 60)}:${
              totalTimeInSeconds % 60
            }`;
            this.totalTimeInSeconds = totalTimeInSeconds;
          } else {
            if (this.isPlaying) {
              audio.pause();
              this.totalTimeInSeconds = this.convertToSeconds(
                this.pause.hours,
                this.pause.minutes,
                this.pause.seconds
              );
            } else {
              audio.currentTime = 10;
              audio.play();
              this.totalTimeInSeconds = this.convertToSeconds(
                this.play.hours,
                this.play.minutes,
                this.play.seconds
              );
            }

            this.isPlaying = !this.isPlaying;
          }
        }, 1000);
      } else {
        this.isLooping = false;
        audio.pause();
        this.isPlaying = false;
        this.totalTimeInSeconds = 0;
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
        }
      }
    },
    convertToSeconds(hours, minutes, seconds) {
      return hours * 3600 + minutes * 60 + seconds;
    },
    setVolume() {
      this.$refs.audioPlayer.volume = this.volume;
    },
    seek() {
      this.$refs.audioPlayer.currentTime = this.currentTime;
    },
    formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60)
        .toString()
        .padStart(2, "0");
      return `${minutes}:${seconds}`;
    },
  },
};
</script>

<style scoped>
input[type="range"] {
  background: linear-gradient(to right, #4ade80, #d1d5db);
  height: 4px;
  border-radius: 4px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #4ade80;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #4ade80;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-ms-thumb {
  width: 16px;
  height: 16px;
  background: #4ade80;
  border-radius: 50%;
  cursor: pointer;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
