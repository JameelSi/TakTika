import React, { useEffect, useState } from 'react';
import loadingMessages from "../game/data/loading-messages.json"

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Installing bug fixes... literally.');
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    // load image before rendering
    let imageLoaded = false;
    const img = new Image();
      img.src = "assets/loading_bg.png";
      img.onload = () => {
        imageLoaded = true;
        setBgLoaded(true); 
      };

    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + Math.random() * 1;
        return newProgress >= 99 ? 99 : newProgress;
      });
    }, 50); 

    const messageInterval = setInterval(() => {
      setLoadingText(
        loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
      );
    }, 2500); 

    
    const clearIntervals = () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
      
    return clearIntervals;
  }, []);
  
  if (!bgLoaded) {
    return <div className="bg-white"></div>;
  }

  return (
    <div className={`fixed inset-0 bg-loading-bg bg-cover bg-center transition-opacity duration-500 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="min-h-screen w-full bg-black/10 backdrop-blur-sm flex flex-col items-center justify-center px-4 bg-black/40">
        <div className="w-full max-w-md text-center">

          <h1 className="text-8xl font-bold text-center text-ice">Tak<span className='text-sky'>Tika</span></h1>
          <h3 className="text-s mb-8  text-center text-white">One Antarctica, Too Many Penguins.</h3>
          
          {/* Progress bar */}
          <div className="mb-4">
            <div className="relative h-6 max-w-xs bg-white rounded-full overflow-hidden mx-auto">
              <div 
                className="absolute top-0 left-0 h-full bg-teal transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center mt-2 text-sm text-white">{loadingText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;