import SoundPlayer from 'react-native-sound-player';

let volumeInterval: string | number | NodeJS.Timeout | null | undefined = null; // store globally so we can clear it later
let currentVolume = 0;

const playSound = async () => {
  try {
    SoundPlayer.setVolume(currentVolume);

    SoundPlayer.playSoundFile('tone', 'mp3');
    SoundPlayer.setNumberOfLoops(-1); // Loop indefinitely
    console.log('Sound is playing');

    // Gradually increase the volume
    volumeInterval = setInterval(() => {
      if (currentVolume < 1) {
        currentVolume += 0.1; // Increase volume by 0.1
        SoundPlayer.setVolume(currentVolume);
      } else {
        clearInterval(volumeInterval);
        volumeInterval = null;
      }
    }, 1000); // Adjust the interval time as needed
  } catch (error) {
    console.log('Cannot play the sound file', error);
  }
};

const stopSound = async () => {
  try {
    SoundPlayer.pause();
    SoundPlayer.stop();
    if (volumeInterval) {
      clearInterval(volumeInterval);
      volumeInterval = null;
    }
    currentVolume = 1; // Reset volume to 1
    SoundPlayer.setVolume(currentVolume);
    SoundPlayer.setNumberOfLoops(0); // Stop looping
    SoundPlayer.unmount(); // Unmount the sound player
    console.log('Sound stopped');
  } catch (error) {
    console.log('Cannot stop the sound file', error);
  }
};

export {playSound, stopSound};
