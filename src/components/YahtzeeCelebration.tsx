import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import useSound from 'use-sound';
import { YahtzeePlayer } from '../types/yahtzee';

interface YahtzeeCelebrationProps {
  player: YahtzeePlayer;
  onComplete: () => void;
}

function YahtzeeCelebration({ player, onComplete }: YahtzeeCelebrationProps) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  const [playYahtzee] = useSound('/sounds/yahtzee.mp3', { volume: 0.5 });

  useEffect(() => {
    playYahtzee();
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black/50" />
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          colors={[player.color, '#FFD700', '#00FFFF', '#FF1493']}
          recycle={true}
          numberOfPieces={200}
        />
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: 1, 
            rotate: 0,
            transition: { 
              type: "spring",
              stiffness: 260,
              damping: 20 
            } 
          }}
          exit={{ scale: 0, rotate: 180 }}
          className="relative"
        >
          <div className="bg-white dark:bg-scoreboard-dark-surface p-8 rounded-xl shadow-2xl text-center">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                transition: { 
                  repeat: Infinity,
                  duration: 1
                }
              }}
            >
              <h1 className="font-cyber text-6xl mb-4 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text">
                YAHTZEE!
              </h1>
            </motion.div>
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: player.color }}
              />
              <p className="font-cyber text-2xl text-scoreboard-dark-primary">
                {player.name}
              </p>
            </div>
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                transition: { 
                  repeat: Infinity,
                  duration: 0.5
                }
              }}
            >
              <span className="text-4xl">🎲</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default YahtzeeCelebration; 
