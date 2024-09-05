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
      class="flex flex-col gap-4 border border-emerald-200 p-6 rounded-xl"
    >
      <TimeInputWindow
        label="Play Window"
        v-model:hours="play.hours"
        v-model:minutes="play.minutes"
        v-model:seconds="play.seconds"
      />
      <p v-if="isLooping && isPlaying && totalTimeInSeconds > 0">
        {{ formattedCountdown }}
      </p>
      <TimeInputWindow
        label="Pause Window"
        v-model:hours="pause.hours"
        v-model:minutes="pause.minutes"
        v-model:seconds="pause.seconds"
      />
      <p v-if="isLooping && !isPlaying && totalTimeInSeconds > 0">
        {{ formattedCountdown }}
      </p>
      <div class="controls flex items-center space-x-4">
        <button
          @click="toggleLoop"
          :disabled="!canToggleLoop"
          class="px-4 py-2 bg-emerald-800 rounded-full hover:bg-emerald-500 cursor-pointer disabled:bg-gray-500 disabled:cursor-not-allowed "
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
import TimeInputWindow from "./TimeInputWindow.vue"; // A reusable time input component

export default {
  components: {
    TimeInputWindow,
  },
  data() {
    return {
      brownNoise:
        "https://dn720003.ca.archive.org/0/items/brownnoise_202103/10%20HOURS%20BROWN%20NOISE%20Noise%20Blocker%20for%20Sleep%2C%20Study%2C%20Tinnitus%20%2C%20insomnia.mp3",
      isPlaying: false,
      isLooping: false,
      volume: 1,
      countdownInterval: null,
      play: { hours: 0, minutes: 0, seconds: 0 },
      pause: { hours: 0, minutes: 0, seconds: 0 },
      totalTimeInSeconds: 0,
    };
  },
  computed: {
    formattedCountdown() {
      const totalTimeInSeconds = this.totalTimeInSeconds;
      return `${Math.floor(totalTimeInSeconds / 3600)}:${Math.floor(
        (totalTimeInSeconds % 3600) / 60
      )}:${totalTimeInSeconds % 60}`;
    },
    canToggleLoop() {
      const playTotal = this.play.hours + this.play.minutes + this.play.seconds;
      const pauseTotal =
        this.pause.hours + this.pause.minutes + this.pause.seconds;

      return playTotal > 0 && pauseTotal > 0; // Both play and pause times must be greater than 0
    },
  },
  mounted() {
    this.$refs.audioPlayer.volume = this.volume;
  },
  methods: {
    toggleLoop() {
      const audio = this.$refs.audioPlayer;

      if (this.isLooping) {
        this.stopLoop();
        audio.pause();
        return;
      }

      this.isLooping = true;
      this.startCountdown();
    },
    startCountdown() {
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }

      this.countdownInterval = setInterval(() => {
        if (this.totalTimeInSeconds > 0) {
          this.totalTimeInSeconds--;
        } else {
          this.togglePlayPause();
        }
      }, 1000);
    },
    stopLoop() {
      this.isLooping = false;
      this.totalTimeInSeconds = 0;
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }
    },
    togglePlayPause() {
      const audio = this.$refs.audioPlayer;
      if (this.isPlaying) {
        audio.pause();
        this.totalTimeInSeconds = this.convertToSeconds(
          this.pause.hours,
          this.pause.minutes,
          this.pause.seconds
        );
      } else {
        audio.currentTime = 12;
        audio.play();
        this.totalTimeInSeconds = this.convertToSeconds(
          this.play.hours,
          this.play.minutes,
          this.play.seconds
        );
      }
      this.isPlaying = !this.isPlaying;
    },
    convertToSeconds(hours, minutes, seconds) {
      console.log({ hours, minutes, seconds });
      return hours * 3600 + minutes * 60 + seconds;
    },
    setVolume() {
      this.$refs.audioPlayer.volume = this.volume;
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
