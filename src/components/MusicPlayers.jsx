import React, { useState, useRef, useEffect } from 'react';
import { PlayCircle, PauseCircle, SkipBack, SkipForward } from 'lucide-react';

const MusicPlayer = () => {
  // State for managing the current song and playback
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // References to audio element and songs
  const audioRef = useRef(null);
  
  // Song data structure
  const songs = [
    {
      id: 'wafimb',
      title: 'What a Feeling it Must Be',
      duration: '3:09',
      src: 'What a Feeling it Must Be.wav'
    },
    {
      id: 'amn',
      title: 'Ask Me Now',
      duration: '7:38',
      src: 'Ask Me Now.wav'
    },
    {
      id: 'sitc',
      title: 'Send in the Clowns',
      duration: '4:42',
      src: 'Send in the Clowns.wav'
    },
    {
      id: 'bas',
      title: 'Body and Soul',
      duration: '3:47',
      src: 'Body and Soul.wav'
    },
    {
      id: 'mi',
      title: 'My Ideal',
      duration: '6:57',
      src: 'My Ideal.wav'
    },
    {
      id: 'lcsc',
      title: 'Loud Cloud Soft Cloud',
      duration: '5:56',
      src: 'Loud Cloud, Soft Cloud.wav'
    }
  ];

  // Helper function to format time
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) {
      return songs[currentSongIndex].duration; 
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Effect to handle song changes
  useEffect(() => {
    if (audioRef.current) {
      setIsLoading(true);
      audioRef.current.src = songs[currentSongIndex].src;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSongIndex]);

  // Handle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle next/previous
  const playNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const playPrevious = () => {
    setCurrentSongIndex((prevIndex) => 
      prevIndex === 0 ? songs.length - 1 : prevIndex - 1
    );
  };

  // Handle progress bar changes
  const handleProgressChange = (e) => {
    const time = parseFloat(e.target.value);
    setProgress(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Handle time updates
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  // Handle song selection
  const handleSongSelect = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  const handleMetadataLoaded = () => {
    setIsLoading(false);
    handleTimeUpdate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 md:bg-[url('/Yutah.jpg')] md:bg-cover md:bg-center md:bg-no-repeat">
      {/* Container for the player that's sized differently for mobile and desktop */}
      <div className="relative h-screen w-full md:h-[90vh] md:w-auto flex items-center justify-center">
        {/* Container for the Steve and John image with proper mobile/desktop handling */}
        <div className="relative h-[80vh] w-full md:h-full md:w-auto flex items-center justify-center overflow-hidden">
          <img 
            src="/stevejohn.jpeg" 
            alt="Steve and John" 
            className="h-full w-auto max-w-none object-contain md:object-cover md:rounded-lg"
          />
          
          {/* Controls overlay positioned consistently across viewport sizes */}
          <div className="absolute top-6 left-0 right-0 px-4 md:px-6">
            <div className="flex items-center justify-between gap-2 md:gap-3 mb-2">
              <span className="text-white min-w-[32px] text-xs">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                value={progress}
                min={0}
                max={duration || 100}
                onChange={handleProgressChange}
                className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-white min-w-[32px] text-xs">
                {isLoading ? songs[currentSongIndex].duration : formatTime(duration)}
              </span>
            </div>

            <div className="flex justify-center items-center gap-4">
              <button onClick={playPrevious} className="text-white hover:scale-110 transition-transform">
                <SkipBack size={20} />
              </button>
              <button onClick={togglePlayPause} className="text-white hover:scale-110 transition-transform">
                {isPlaying ? <PauseCircle size={36} /> : <PlayCircle size={36} />}
              </button>
              <button onClick={playNext} className="text-white hover:scale-110 transition-transform">
                <SkipForward size={20} />
              </button>
            </div>
          </div>

          {/* Track listing */}
          <div className="absolute bottom-6 right-4 w-72 md:w-64">
            {songs.map((song, index) => (
              <div
                key={song.id}
                onClick={() => handleSongSelect(index)}
                className={`flex justify-between items-center cursor-pointer group py-0.5
                  ${currentSongIndex === index ? 'scale-105' : 'hover:scale-105'} 
                  transition-transform duration-200`}
              >
                <p className={`text-black text-sm ${currentSongIndex === index ? 'font-medium' : 'font-light'}`}>
                  {song.title}
                </p>
                <p className="text-black text-sm font-light ml-2">{song.duration}</p>
              </div>
            ))}
          </div>
        </div>

        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={playNext}
          onLoadedMetadata={handleMetadataLoaded}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;