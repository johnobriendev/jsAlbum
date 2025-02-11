import React, { useState, useRef, useEffect } from 'react';
import { PlayCircle, PauseCircle, SkipBack, SkipForward, ChevronLeft, ChevronRight } from 'lucide-react';

const MusicPlayer = () => {
  // State for managing the current song and playback
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  //const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeView, setActiveView] = useState('A'); // 'A' or 'B'

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

  const aSideSongs = songs.slice(0, 3);
  const bSideSongs = songs.slice(3);

  // Effect to handle automatic side switching when playing through songs
  useEffect(() => {
    if (currentSongIndex < 3) {
      setActiveView('A');
    } else {
      setActiveView('B');
    }
  }, [currentSongIndex]);

  // Handle manual side switching
  const switchSide = (side) => {
    //setIsTransitioning(true);
    setActiveView(side);
    //setTimeout(() => setIsTransitioning(false), 300);
  };


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

  // const playNext = () => {
  //   setCurrentSongIndex((prevIndex) => {
  //     const nextIndex = (prevIndex + 1) % songs.length;
  //     if (prevIndex === 2 && nextIndex === 3) {
  //       setIsTransitioning(true);
  //     }
  //     return nextIndex;
  //   });
  // };

  // // Modified playPrevious to handle side transitions
  // const playPrevious = () => {
  //   setCurrentSongIndex((prevIndex) => {
  //     const nextIndex = prevIndex === 0 ? songs.length - 1 : prevIndex - 1;
  //     if (prevIndex === 3 && nextIndex === 2) {
  //       setIsTransitioning(true);
  //     }
  //     return nextIndex;
  //   });
  // };

  // Simplified playback controls
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


  const renderPlaybackControls = () => (
    <div className="absolute left-0 right-0 md:top-6 top-6 px-4 md:px-6">  
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
  );

  const renderSongList = (songs, startIndex) => (
    <div className="absolute bottom-6 md:bottom-6 right-4 w-56 md:w-64">  
      {songs.map((song, index) => (
        <div
          key={song.id}
          onClick={() => handleSongSelect(startIndex + index)}
          className={`flex justify-between items-center cursor-pointer group py-0.5
            ${currentSongIndex === startIndex + index ? 'scale-105' : 'hover:scale-105'} 
            transition-transform duration-200`}
        >
          <p className={`text-black text-sm ${currentSongIndex === startIndex + index ? 'font-medium' : 'font-light'}`}>
            {song.title}
          </p>
          <p className="text-black text-sm font-light ml-2">{song.duration}</p>
        </div>
      ))}
    </div>
  );

  const renderCarouselContent = (isMobile = false) => (
    <div className='relative'>
      {activeView === 'A' ? (
        <div className="relative">
          <img 
            src="/stevejohn.png" 
            alt="Steve and John A Side" 
            className={`${isMobile ? 'h-[70vh]' : 'h-[90vh]'} w-auto object-cover rounded-lg`}
          />
          <div className="absolute inset-0 flex flex-col">
            {renderPlaybackControls()}
            {renderSongList(aSideSongs, 0)}
            <span className="absolute bottom-6 left-8 md:left-12 text-black text-lg font-medium">A Side</span>
          </div>
        </div>
      ) : (
        <div className="relative">
          <img 
            src="/johnsteve2.png" 
            alt="Steve and John B Side" 
            className={`${isMobile ? 'h-[70vh]' : 'h-[90vh]'} w-auto object-cover rounded-lg`}
          />
          <div className="absolute inset-0 flex flex-col">
            {renderPlaybackControls()}
            {renderSongList(bSideSongs, 3)}
            <span className="absolute bottom-6 left-8 text-black text-lg font-medium">B Side</span>
          </div>
        </div>
      )}
    </div>
  );




  return (
    <div className="min-h-screen bg-gray-800 md:bg-[url('/Yutah.jpg')] md:bg-cover md:bg-center md:bg-no-repeat">
      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col">
        {/* Title for mobile */}
        <div className="w-full pt-8 px-4 text-center">
          <h1 className="text-4xl font-thin text-white">Steve and John</h1>
        </div>

        {/* Mobile Carousel Container */}
        <div className="relative w-full flex items-center justify-center mt-4">
          {/* Mobile Carousel Navigation */}
          <button 
            onClick={() => switchSide('A')}
            className={`absolute left-4 z-10 text-white hover:text-white/80 transition-colors ${
              activeView === 'A' ? 'hidden' : ''
            }`}
          >
            <ChevronLeft size={32} />
          </button>
          <button 
            onClick={() => switchSide('B')}
            className={`absolute right-4 z-10 text-white hover:text-white/80 transition-colors ${
              activeView === 'B' ? 'hidden' : ''
            }`}
          >
            <ChevronRight size={32} />
          </button>

          {/* Mobile Carousel Content */}
          {renderCarouselContent(true)}
        </div>

        {/* Personnel section for mobile */}
        <div className="w-full py-8 px-4 text-white">
          <h2 className="text-2xl font-thin mb-4">Personnel</h2>
          <p className="text-lg mb-2 font-thin">Steve Ippolito: drums</p>
          <p className="text-lg font-thin mb-2">John O'Brien: guitar</p>
          <p className="text-lg font-thin">Dante Villagomez: mixing</p>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex min-h-screen items-center justify-center px-12">
        {/* Title and Personnel section */}
        <div className="w-96 pr-12 pb-12">
          <h1 className="text-5xl font-thin text-white mb-8">Steve and John</h1>
          
          <div className="text-white">
            <h2 className="text-2xl font-thin mb-4">Personnel</h2>
            <p className="text-lg mb-2 font-thin">Steve Ippolito: drums</p>
            <p className="text-lg mb-2 font-thin">John O'Brien: guitar</p>
            <p className="text-lg font-thin">Dante Villagomez: mixing</p>

          </div>
        </div>

        {/* Desktop Carousel section */}
        <div className="relative h-[90vh] w-auto flex items-center justify-center overflow-hidden">
          {/* Desktop Carousel Navigation */}
          <button 
            onClick={() => switchSide('A')}
            className={`absolute left-4 z-10 text-white hover:text-white/80 transition-colors ${
              activeView === 'A' ? 'hidden' : ''
            }`}
          >
            <ChevronLeft size={40} />
          </button>
          <button 
            onClick={() => switchSide('B')}
            className={`absolute right-4 z-10 text-white hover:text-white/80 transition-colors ${
              activeView === 'B' ? 'hidden' : ''
            }`}
          >
            <ChevronRight size={40} />
          </button>

          {/* Desktop Carousel Content */}
          {renderCarouselContent(false)}
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
        onLoadedMetadata={handleMetadataLoaded}
      />
    </div>
  );
};

export default MusicPlayer;




