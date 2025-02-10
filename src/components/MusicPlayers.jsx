import React, { useState, useRef, useEffect } from 'react';
import { PlayCircle, PauseCircle, SkipBack, SkipForward } from 'lucide-react';

const MusicPlayer = () => {
  // State for managing the current song and playback
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

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
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Effect to handle song changes
  useEffect(() => {
    if (audioRef.current) {
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

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col md:flex-row items-center justify-center p-4 gap-8 md:gap-72"
      style={{ backgroundImage: 'url(/Yutah.jpg)' }}
    >
      <div className="w-full md:w-[400px] bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-8 backdrop-blur-sm">
        <h1 className="text-3xl font-light text-white text-center mb-8">
          Steve and John's Album
        </h1>

        {/* Song list */}
        <div className="space-y-4 mb-8">
          {songs.map((song, index) => (
            <div
              key={song.id}
              onClick={() => handleSongSelect(index)}
              className={`flex justify-between items-center cursor-pointer group 
                ${currentSongIndex === index ? 'scale-105' : 'hover:scale-105'} 
                transition-transform duration-200`}
            >
              <p className={`text-white text-lg font-light 
                ${currentSongIndex === index ? 'font-medium' : ''}`}>
                {song.title}
              </p>
              <p className="text-white text-lg font-light">{song.duration}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <span className="text-white min-w-[40px]">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            value={progress}
            min={0}
            max={duration || 100}
            onChange={handleProgressChange}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-white min-w-[40px]">
            {formatTime(duration)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-8">
          <button
            onClick={playPrevious}
            className="text-white hover:scale-110 transition-transform"
          >
            <SkipBack size={24} />
          </button>
          <button
            onClick={togglePlayPause}
            className="text-white hover:scale-110 transition-transform"
          >
            {isPlaying ? (
              <PauseCircle size={48} />
            ) : (
              <PlayCircle size={48} />
            )}
          </button>
          <button
            onClick={playNext}
            className="text-white hover:scale-110 transition-transform"
          >
            <SkipForward size={24} />
          </button>
        </div>

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={playNext}
          onLoadedMetadata={handleTimeUpdate}
        />
      </div>
      <div className="w-full max-w-2xl md:w-[500px]">
        <img 
          src="/stevejohn.png" 
          alt="Steve and John" 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>


    </div>
  );
};

export default MusicPlayer;