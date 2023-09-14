
import React, { useEffect } from 'react';

import wavFile from './alarm.wav';

export default function Notification() {

  useEffect(() => {
    const audio = new Audio(wavFile)
     audio.play()
  }, []);

  return <div/ >
};