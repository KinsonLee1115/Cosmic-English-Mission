import React, { useState, useCallback, useEffect } from 'react';
import { WordPuzzle, GameState, BridgeState, Difficulty, CollectedStickers } from './types';
import { BUS_IMAGE_URL, getInitialPuzzles, allCategorizedWords, getAllWordsWithDetails } from './constants';
import Bridge from './components/Bridge';
import Character from './components/Character';
import StickerBook from './components/StickerBook';
import { Star, Volume2, Trophy, Home, ArrowLeft } from 'lucide-react';

const emojiMap: { [key: string]: string } = {};

const addEmoji = (key: string, emoji: string) => {
  if (!(key in emojiMap)) {
    emojiMap[key] = emoji;
  }
};

// Category Emojis
addEmoji('Common Sight-Words', '⭐');
addEmoji('People & Family', '👨‍👩‍👧‍👦');
addEmoji('Animals', '🐾');
addEmoji('Food & Drink', '🍎裝');
addEmoji('Actions (Verbs)', '🏃‍♀️');
addEmoji('Colors', '🎨');
addEmoji('Numbers', '🔢');
addEmoji('Body Parts', '💪');
addEmoji('Everyday Objects', '🛋️');
addEmoji('Nature & Environment', '🏞️');
addEmoji('Feelings & Emotions', '😄');
addEmoji('School Items', '🏫');
addEmoji('Daily Routines', '🗓️');
addEmoji('Sports & Interests', '⚽🎨');

// Word Emojis
addEmoji('cat', '🐱'); addEmoji('sun', '☀️'); addEmoji('dog', '🐶'); addEmoji('bug', '🐛'); addEmoji('hen', '🐔');
addEmoji('sheep', '🐑'); addEmoji('chair', '🪑'); addEmoji('phone', '☎️'); addEmoji('whale', '🐋'); addEmoji('clock', '⏰');
addEmoji('train', '🚂'); addEmoji('brush', '🖌️'); addEmoji('spoon', '🥄'); addEmoji('grapes', '🍇'); addEmoji('flower', '🌸');
addEmoji('mom', '👩‍👧'); addEmoji('dad', '👨‍👧'); addEmoji('sister', '👧'); addEmoji('brother', '👦'); addEmoji('baby', '👶'); addEmoji('boy', '👦'); addEmoji('girl', '👧'); addEmoji('friend', '👫');
addEmoji('lion', '🦁'); addEmoji('cow', '🐄'); addEmoji('horse', '🐎'); addEmoji('fish', '🐠'); addEmoji('bird', '🐦'); addEmoji('mouse', '🐭'); addEmoji('goat', '🐐'); addEmoji('chick', '🐥'); addEmoji('snail', '🐌');
addEmoji('apple', '🍎'); addEmoji('banana', '🍌'); addEmoji('bread', '🍞'); addEmoji('milk', '🥛'); addEmoji('water', '💧'); addEmoji('juice', '🧃'); addEmoji('egg', '🥚'); addEmoji('cake', '🍰'); addEmoji('cookie', '🍪'); addEmoji('cheese', '🧀'); addEmoji('pizza', '🍕'); addEmoji('fruit', '🍇'); addEmoji('candy', '🍬'); addEmoji('honey', '🍯'); addEmoji('yogurt', '🍦'); addEmoji('sandwich', '🥪'); addEmoji('burger', '🍔'); addEmoji('chips', '🍟'); addEmoji('soda', '🥤'); addEmoji('soup', '🍲');
addEmoji('eat', '🍽️'); addEmoji('drink', '🥤'); addEmoji('sleep', '😴'); addEmoji('run', '🏃'); addEmoji('jump', '🤸'); addEmoji('walk', '🚶'); addEmoji('play', '🎲'); addEmoji('sit', '🪑'); addEmoji('stand', '🧍'); addEmoji('read', '📖'); addEmoji('write', '✍️'); addEmoji('look', '👀'); addEmoji('listen', '👂'); addEmoji('sing', '🎤'); addEmoji('dance', '💃'); addEmoji('draw', '✏️'); addEmoji('help', '🤝'); addEmoji('talk', '🗣️'); addEmoji('laugh', '😂'); addEmoji('cry', '😭');
addEmoji('red', '🟥'); addEmoji('blue', '🟦'); addEmoji('yellow', '🟨'); addEmoji('green', '🟩'); addEmoji('black', '⬛'); addEmoji('white', '⬜'); addEmoji('pink', '🩷'); addEmoji('orange', '🟧'); addEmoji('purple', '🟪'); addEmoji('brown', '🟫'); addEmoji('grey', '🌫️'); addEmoji('gold', '🥇'); addEmoji('silver', '🥈'); addEmoji('dark', '🌑'); addEmoji('light', '💡');
addEmoji('one', '1️⃣'); addEmoji('two', '2️⃣'); addEmoji('three', '3️⃣'); addEmoji('four', '4️⃣'); addEmoji('five', '5️⃣'); addEmoji('six', '6️⃣'); addEmoji('seven', '7️⃣'); addEmoji('eight', '8️⃣'); addEmoji('nine', '9️⃣'); addEmoji('ten', '🔟'); addEmoji('zero', '0️⃣'); addEmoji('count', '🔢'); addEmoji('many', '➕'); addEmoji('few', '➖'); addEmoji('first', '🥇');
addEmoji('eyes', '👀'); addEmoji('ears', '👂'); addEmoji('nose', '👃'); addEmoji('mouth', '👄'); addEmoji('hands', '✋'); addEmoji('feet', '👣'); addEmoji('head', '👤'); addEmoji('arm', '💪'); addEmoji('leg', '🦵'); addEmoji('finger', '👇'); addEmoji('toe', '🦶'); addEmoji('hair', '💇‍♀️'); addEmoji('skin', '✋🏽'); addEmoji('face', '🙂'); addEmoji('tooth', '🦷');
addEmoji('ball', '⚽'); addEmoji('book', '📚'); addEmoji('car', '🚗'); addEmoji('table', '🪑'); addEmoji('door', '🚪'); addEmoji('window', '🪟'); addEmoji('bag', '🎒'); addEmoji('pen', '🖊️'); addEmoji('toy', '🧸');
addEmoji('cup', '🥛'); addEmoji('bed', '🛏️'); addEmoji('lamp', '💡');
addEmoji('rain', '🌧️'); addEmoji('snow', '🌨️'); addEmoji('wind', '💨'); addEmoji('tree', '🌳'); addEmoji('grass', '🌿'); addEmoji('leaf', '🍂'); addEmoji('sky', '☁️'); addEmoji('cloud', '☁️');
addEmoji('river', '🌊'); addEmoji('lake', '🏞️'); addEmoji('mountain', '🏔️'); addEmoji('rock', '🪨'); addEmoji('sea', '🌊');
addEmoji('happy', '😊'); addEmoji('sad', '😔'); addEmoji('angry', '😡'); addEmoji('excited', '🤩'); addEmoji('scared', '😱');
addEmoji('shy', '😳'); addEmoji('proud', '😌'); addEmoji('silly', '🤪'); addEmoji('calm', '🧘'); addEmoji('tired', '🥱'); addEmoji('sleepy', '😴');
addEmoji('hungry', '😋'); addEmoji('thirsty', '💧'); addEmoji('fun', '🥳');
addEmoji('pencil', '✏️'); addEmoji('paper', '📄'); addEmoji('desk', '🗄️');
addEmoji('board', '📋'); addEmoji('teacher', '👩‍🏫'); addEmoji('crayon', '🖍️'); addEmoji('glue', '🧴'); addEmoji('scissors', '✂️');
addEmoji('ruler', '📏'); addEmoji('eraser', '🧼'); addEmoji('marker', '🖊️');
addEmoji('chalk', '📝'); addEmoji('computer', '💻');
addEmoji('wake', '⏰'); addEmoji('wash', '🧼'); addEmoji('brush', '🪥');
addEmoji('go', '🚶‍♀️'); addEmoji('come', '🚶'); addEmoji('stop', '🛑'); addEmoji('morning', '🌄'); addEmoji('night', '🌙'); addEmoji('early', '🌅');
addEmoji('painting', '🎨'); addEmoji('drawing', '🖍️'); addEmoji('singing', '🎤'); addEmoji('dancing', '💃'); addEmoji('reading', '📖');
addEmoji('taekwondo', '🥋'); addEmoji('karate', '🥋'); addEmoji('swimming', '🏊‍♀️'); addEmoji('cycling', '🚴‍♀️'); addEmoji('running', '🏃');
addEmoji('football', '🏈'); addEmoji('basketball', '🏀'); addEmoji('baseball', '⚾'); addEmoji('tennis', '🎾'); addEmoji('golf', '⛳');
addEmoji('ice skating', '⛸️'); addEmoji('figure skate', '⛸️'); addEmoji('skiing', '⛷️'); addEmoji('surfing', '🏄‍♂️'); addEmoji('hiking', '🥾');

export const getEmojiForPrompt = (prompt = '', categoryFallback?: string) => {
  const lowerCasePrompt = prompt.toLowerCase();
  for (const key in emojiMap) {
    if (lowerCasePrompt.includes(key.toLowerCase())) {
      return emojiMap[key];
    }
  }
  if (categoryFallback && emojiMap[categoryFallback]) {
      return emojiMap[categoryFallback];
  }
  return '❔';
};

const categoryColors = [
  'from-purple-400 to-purple-600 shadow-[0_6px_0_rgb(126,34,206)] active:shadow-[0_2px_0_rgb(126,34,206)]',
  'from-blue-400 to-blue-600 shadow-[0_6px_0_rgb(30,64,175)] active:shadow-[0_2px_0_rgb(30,64,175)]',
  'from-green-400 to-green-600 shadow-[0_6px_0_rgb(22,101,52)] active:shadow-[0_2px_0_rgb(22,101,52)]',
  'from-yellow-400 to-yellow-600 shadow-[0_6px_0_rgb(161,98,7)] active:shadow-[0_2px_0_rgb(161,98,7)]',
  'from-red-400 to-red-600 shadow-[0_6px_0_rgb(153,27,27)] active:shadow-[0_2px_0_rgb(153,27,27)]',
  'from-pink-400 to-pink-600 shadow-[0_6px_0_rgb(192,38,211)] active:shadow-[0_2px_0_rgb(192,38,211)]',
  'from-teal-400 to-teal-600 shadow-[0_6px_0_rgb(13,124,117)] active:shadow-[0_2px_0_rgb(13,124,117)]',
  'from-orange-400 to-orange-600 shadow-[0_6px_0_rgb(194,65,12)] active:shadow-[0_2px_0_rgb(194,65,12)]',
];

const balloonColors = [
  'bg-default', 'bg-red', 'bg-green', 'bg-blue', 'bg-yellow',
  'bg-purple', 'bg-pink', 'bg-orange', 'bg-cyan', 'bg-lime', 'bg-indigo'
];

export default function App() {
  const [puzzles, setPuzzles] = useState<WordPuzzle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [bridgeState, setBridgeState] = useState<BridgeState>(BridgeState.BROKEN);
  const [characterPos, setCharacterPos] = useState<'start' | 'crossing' | 'crossed' | 'drivingOff'>('start');
  const [score, setScore] = useState(0);
  const [shake, setShake] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [feedback, setFeedback] = useState<{ option: string; status: 'correct' | 'incorrect' } | null>(null);
  const [scoreKey, setScoreKey] = useState(0);
  const [isResetting, setIsResetting] = useState(true);
  const [isTraveling, setIsTraveling] = useState(false);
  const [balloonPositions, setBalloonPositions] = useState<{top: string, left: string}[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hasMadeMistakeForCurrentPuzzle, setHasMadeMistakeForCurrentPuzzle] = useState(false);
  const [collectedStickers, setCollectedStickers] = useState<CollectedStickers>(() => {
    try {
      const storedStickers = localStorage.getItem('collectedStickers');
      return storedStickers ? JSON.parse(storedStickers) : {};
    } catch (error) {
      console.error("Failed to parse collected stickers from localStorage", error);
      return {};
    }
  });

  const successSound = new Audio('https://cdn.pixabay.com/audio/2022/03/10/audio_f5edc2144a.mp3');
  const errorSound = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_17e997f70b.mp3');
  const bridgeFixSound = new Audio('https://ling.cuhk.edu.hk/files/others/fixing.mp3');
  const moveSound = React.useMemo(() => new Audio('https://ling.cuhk.edu.hk/files/others/bus_moving.mp3'), []);
  const hornSound = new Audio('https://ling.cuhk.edu.hk/files/others/horn.mp3');

  useEffect(() => {
     if (gameState === GameState.PLAYING && isResetting) {
        setTimeout(() => {
            setIsResetting(false);
            setCharacterPos('start');
        }, 100);
     }
  }, [gameState, isResetting]);

  useEffect(() => {
    if (score > 0) {
      setScoreKey(key => key + 1);
    }
  }, [score]);
  
  useEffect(() => {
    try {
      localStorage.setItem('collectedStickers', JSON.stringify(collectedStickers));
    } catch (error) {
      console.error("Failed to save collected stickers to localStorage", error);
    }
  }, [collectedStickers]);

  useEffect(() => {
    if (gameState !== GameState.PLAYING || puzzles.length === 0) return; 
    const numOptions = puzzles[currentIndex].options.length;
    const positions = [];
    if (numOptions === 3) {
      positions.push({ top: '12%', left: '20%' }); 
      positions.push({ top: '22%', left: '50%' });
      positions.push({ top: '15%', left: '70%' });
    } else {
      positions.push({ top: '7%', left: '15%' });
      positions.push({ top: '14%', left: '35%' });
      positions.push({ top: '11%', left: '65%' });
      positions.push({ top: '22%', left: '80%' });
    }
    setBalloonPositions(positions);
  }, [currentIndex, puzzles, gameState]);

  useEffect(() => {
    if (characterPos === 'crossed' || characterPos === 'crossing') {
      moveSound.loop = true;
      moveSound.currentTime = 0;
      moveSound.play().catch(() => {});
    } else {
      moveSound.pause();
      moveSound.currentTime = 0;
    }
    return () => {
      moveSound.pause();
    };
  }, [characterPos, moveSound]);

  const playSound = (type: 'success' | 'error' | 'bridgeFix' | 'horn') => {
    let audio: HTMLAudioElement | null = null;
    switch (type) {
      case 'success': audio = successSound; break;
      case 'error': audio = errorSound; break;
      case 'bridgeFix': audio = bridgeFixSound; break;
      case 'horn': audio = hornSound; break;
    }
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
      }, 150);
    }
  };

  const handleStart = (category: string, selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    const generatedPuzzles = getInitialPuzzles(category, selectedDifficulty);
    if (generatedPuzzles.length > 0) {
      setPuzzles(generatedPuzzles);
      setCurrentIndex(0);
      setBridgeState(BridgeState.BROKEN);
      setScore(0);
      setIsResetting(true); 
      setFeedback(null);
      setHasMadeMistakeForCurrentPuzzle(false);
      setGameState(GameState.PLAYING);
    } else {
      setGameState(GameState.START);
      setSelectedCategory(null);
    }
  };

  const goHome = () => {
    setGameState(GameState.START);
    setSelectedCategory(null);
    setPuzzles([]);
    setHasMadeMistakeForCurrentPuzzle(false);
  };

  const openStickerBook = () => setGameState(GameState.STICKER_BOOK);
  const closeStickerBook = () => setGameState(GameState.START);
  const handleBusClick = useCallback(() => {
    if (gameState === GameState.PLAYING) playSound('horn');
  }, [gameState]);

  const handleOptionClick = useCallback((option: string) => {
    const currentPuzzle = puzzles[currentIndex]; 
    if (bridgeState !== BridgeState.BROKEN || !currentPuzzle) return;

    if (option === currentPuzzle.missing) {
      setFeedback({ option, status: 'correct' });
      playSound('success');
      setBridgeState(BridgeState.FIXING);
      playSound('bridgeFix');
      speakWord(currentPuzzle.word);

      if (!hasMadeMistakeForCurrentPuzzle) {
        setCollectedStickers(prev => {
          const newStickers = { ...prev };
          newStickers[currentPuzzle.word.toUpperCase()] = { 
            collected: true, 
            category: selectedCategory!,
            difficulty: difficulty,
            imagePrompt: currentPuzzle.imagePrompt,
          };
          return newStickers;
        });
      }

      setTimeout(() => {
        setBridgeState(BridgeState.FIXED);
        setTimeout(() => {
          setCharacterPos('crossed');
          setIsTraveling(true); // START parallax movement when bus crosses bridge
          setTimeout(() => {
            setCharacterPos('drivingOff');
            setTimeout(() => {
              // Now that it's driving off, keep traveling for a bit then stop for next puzzle
              setTimeout(() => {
                setIsTraveling(false);
                setScore(prev => prev + 10);
                if (currentIndex < puzzles.length - 1) {
                  setIsResetting(true); 
                  setCurrentIndex(prev => prev + 1);
                  setBridgeState(BridgeState.BROKEN);
                  setFeedback(null);
                  setHasMadeMistakeForCurrentPuzzle(false);
                  setTimeout(() => {
                    setIsResetting(false);
                    setCharacterPos('start');
                  }, 100);
                } else {
                  setGameState(GameState.GAME_OVER);
                  setFeedback(null);
                }
              }, 1500);
            }, 600);
          }, 1600);
        }, 500);
      }, 500);
    } else {
      setFeedback({ option, status: 'incorrect' });
      playSound('error');
      setShake(true);
      setHasMadeMistakeForCurrentPuzzle(true);
      setTimeout(() => {
        setShake(false);
        setFeedback(null);
      }, 500);
    }
  }, [bridgeState, puzzles, currentIndex, hasMadeMistakeForCurrentPuzzle, selectedCategory, difficulty]); 

  const puzzle = puzzles[currentIndex];

  const renderWordDisplay = () => {
    if (!puzzle) return null;
    const display = puzzle.display;
    const placeholderMatch = display.match(/(_+)/);
    if (!placeholderMatch) return null;
    const placeholderStr = placeholderMatch[0];
    const parts = display.split(placeholderStr);
    const prefix = parts[0];
    const suffix = parts[1];
    const isRevealed = bridgeState === BridgeState.FIXING || bridgeState === BridgeState.FIXED;

    return (
      <div className="flex flex-wrap justify-center items-center gap-2" aria-label={`Word puzzle: ${display}`}>
        {prefix.split('').map((char, i) => (
          <div key={`prefix-${i}`} className="min-w-8 h-12 text-2xl md:min-w-10 md:h-14 md:text-3xl lg:w-12 lg:h-16 lg:text-4xl bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-700 shadow-inner">
            {char}
          </div>
        ))}
        {placeholderStr.split('').map((_, i) => (
          <div key={`placeholder-${i}`} className={`min-w-8 h-12 text-2xl md:min-w-10 md:h-14 md:text-3xl lg:w-12 lg:h-16 lg:text-4xl rounded-lg flex items-center justify-center font-bold text-slate-700 transition-colors duration-300 ${isRevealed ? 'bg-green-200 border-2 border-green-400' : 'bg-sky-100 border-2 border-dashed border-sky-400 animate-pulse-placeholder'}`}>
            {isRevealed && (
              <span className="animate-reveal-char" style={{ animationDelay: `${i * 100}ms` }}>
                {puzzle.missing[i]}
              </span>
            )}
          </div>
        ))}
        {suffix.split('').map((char, i) => (
          <div key={`suffix-${i}`} className="min-w-8 h-12 text-2xl md:min-w-10 md:h-14 md:text-3xl lg:w-12 lg:h-16 lg:text-4xl bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-700 shadow-inner">
            {char}
          </div>
        ))}
      </div>
    );
  };

  const backgroundWrapper = (
    <div className={`fixed inset-0 z-0 bg-animated-sky ${isTraveling ? 'travel-mode' : ''}`}>
      <div className="parallax-layer parallax-hills"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 200'%3E%3Cpath d='M0 200 L0 100 Q 100 50, 200 100 T 400 110 T 600 90 T 800 120 L800 200 Z' fill='%2368d391'/%3E%3Cpath d='M0 200 L0 120 Q 150 90, 300 120 T 600 100 T 800 130 L800 200 Z' fill='%2348bb78'/%3E%3C/svg%3E")`, backgroundSize: '40% auto' }}></div>
      <div className="parallax-layer parallax-buildings"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 200'%3E%3C!-- Small House 1 --%3E%3Crect x='50' y='120' width='60' height='50' fill='%236b7280' /%3E%3Cpolygon points='50,120 80,90 110,120' fill='%234b5563' /%3E%3C!-- CLASSIC SCHOOL BUILDING --%3E%3Crect x='180' y='90' width='160' height='80' fill='%23b91c1c' /%3E%3C!-- Central Tower --%3E%3Crect x='230' y='40' width='60' height='50' fill='%23b91c1c' /%3E%3Cpolygon points='230,40 260,10 290,40' fill='%23991b1b' /%3E%3C!-- Clock --%3E%3Ccircle cx='260' cy='60' r='12' fill='white' /%3E%3Crect x='259.5' y='52' width='1' height='8' fill='%23333' /%3E%3C!-- Flag --%3E%3Crect x='285' y='10' width='2' height='30' fill='%234b5563' /%3E%3Cpolygon points='287,10 287,20 305,15' fill='%23ef4444' /%3E%3C!-- Windows --%3E%3Crect x='195' y='110' width='20' height='25' fill='%23bfdbfe' /%3E%3Crect x='225' y='110' width='20' height='25' fill='%23bfdbfe' /%3E%3Crect x='275' y='110' width='20' height='25' fill='%23bfdbfe' /%3E%3Crect x='305' y='110' width='20' height='25' fill='%23bfdbfe' /%3E%3C!-- Door --%3E%3Crect x='245' y='135' width='30' height='35' fill='%238c5a2b' /%3E%3C!-- House 2 --%3E%3Crect x='420' y='110' width='70' height='60' fill='%23a78bfa' /%3E%3Crect x='435' y='125' width='15' height='15' fill='%23bfdbfe' /%3E%3C!-- Tall Shop --%3E%3Crect x='600' y='80' width='60' height='90' fill='%23fde68a' /%3E%3Crect x='610' y='95' width='12' height='15' fill='%23bfdbfe' /%3E%3C/svg%3E")`, backgroundSize: '40% auto' }}></div>
      <div className="parallax-layer parallax-trees"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%2338a169'/%3E%3Crect x='45' y='80' width='10' height='20' fill='%238c5a2b'/%3E%3Ccircle cx='150' cy='60' r='30' fill='%2338a169'/%3E%3Crect x='145' y='80' width='10' height='20' fill='%238c5a2b'/%3E%3Ccircle cx='280' cy='40' r='50' fill='%2348bb78'/%3E%3Crect x='275' y='80' width='10' height='20' fill='%238c5a2b'/%3E%3Ccircle cx='400' cy='55' r='35' fill='%2338a169'/%3E%3Crect x='395' y='80' width='10' height='20' fill='%238c5a2b'/%3E%3Ccircle cx='550' cy='45' r='45' fill='%2348bb78'/%3E%3Crect x='545' y='80' width='10' height='20' fill='%238c5a2b'/%3E%3Ccircle cx='700' cy='60' r='30' fill='%2338a169'/%3E%3Crect x='695' y='80' width='10' height='20' fill='%238c5a2b'/%3E%3C/svg%3E")`, backgroundSize: '30% auto' }}></div>
    </div>
  );

  if (gameState === GameState.STICKER_BOOK) {
    return <StickerBook collectedStickers={collectedStickers} onClose={closeStickerBook} />;
  }

  if (gameState === GameState.START) {
    return (
      <div className="min-h-screen flex flex-col items-center py-12 px-4 relative">
        {backgroundWrapper}
        <div className="z-10 bg-white/90 backdrop-blur-sm p-6 md:p-10 rounded-3xl shadow-2xl text-center w-full max-w-xl md:max-w-2xl lg:max-w-3xl border-4 border-white mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-2 tracking-wider">Freya Phonics Adventure</h1>
          <h2 className="text-xl md:text-2xl font-semibold text-sky-500 mb-6">Bridge Builder</h2>
          <img src={BUS_IMAGE_URL} alt="School Bus" className="w-40 h-auto mx-auto animate-float drop-shadow-lg mb-6" />
          
          {!selectedCategory ? (
            <>
              <p className="text-gray-600 mb-8 text-lg">Choose a category to explore!</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(allCategorizedWords).map((categoryName, index) => (
                  <button 
                    key={categoryName} 
                    onClick={() => setSelectedCategory(categoryName)}
                    className={`flex flex-col items-center justify-center bg-gradient-to-b ${categoryColors[index % categoryColors.length]} hover-wobble text-white text-xl font-bold py-4 rounded-xl animate-float-category transition-all`}
                  >
                    <span className="text-5xl mb-2">{getEmojiForPrompt(categoryName)}</span>
                    <span className="text-lg">{categoryName}</span>
                  </button>
                ))}
              </div>
              <button 
                onClick={openStickerBook} 
                className="w-full mt-8 bg-amber-400 hover:bg-amber-500 text-white text-xl font-bold py-3 rounded-xl shadow-[0_6px_0_rgb(180,83,9)] active:shadow-[0_2px_0_rgb(180,83,9)] active:translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <Trophy size={24}/> My Sticker Book
              </button>
            </>
          ) : (
            <>
              <h3 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4">Category: {selectedCategory} {getEmojiForPrompt(selectedCategory)}</h3>
              <p className="text-gray-600 mb-8 text-lg">Now choose a difficulty:</p>
              <div className="flex flex-col gap-4 max-sm mx-auto">
                <button onClick={() => handleStart(selectedCategory, Difficulty.EASY)} className="bg-gradient-to-b from-green-400 to-green-600 hover-wobble text-white text-2xl font-bold py-3 rounded-xl shadow-[0_6px_0_rgb(22,101,52)] active:shadow-[0_2px_0_rgb(22,101,52)] transition-all">Easy</button>
                <button onClick={() => handleStart(selectedCategory, Difficulty.MEDIUM)} className="bg-gradient-to-b from-blue-400 to-blue-600 hover-wobble text-white text-2xl font-bold py-3 rounded-xl shadow-[0_6px_0_rgb(30,64,175)] active:shadow-[0_2px_0_rgb(30,64,175)] transition-all">Medium</button>
                <button onClick={() => handleStart(selectedCategory, Difficulty.HARD)} className="bg-gradient-to-b from-red-400 to-red-600 hover-wobble text-white text-2xl font-bold py-3 rounded-xl shadow-[0_6px_0_rgb(153,27,27)] active:shadow-[0_2px_0_rgb(153,27,27)] transition-all">Hard</button>
                <button onClick={() => setSelectedCategory(null)} className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 text-xl font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                  <ArrowLeft size={20}/> Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (gameState === GameState.GAME_OVER) {
    const allWords = getAllWordsWithDetails();
    const currentDifficultyWords = allWords.filter(w => w.category === selectedCategory && w.difficulty === difficulty);
    const isPerfectScore = !hasMadeMistakeForCurrentPuzzle && score === currentDifficultyWords.length * 10;
    
    return (
      <div className="min-h-screen flex flex-col items-center py-16 px-4 relative">
        {backgroundWrapper}
        <div className="z-10 bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full animate-float mb-10 border-4 border-white/50">
          <div className="flex flex-col items-center">
            {isPerfectScore ? (
                <Star className="text-yellow-400 w-24 h-24 mb-4 animate-score-pop" fill="currentColor" />
            ) : (
                <Trophy className="text-yellow-400 w-20 h-20 mb-4" fill="currentColor" />
            )}
            <h2 className="text-3xl font-bold text-blue-600 mb-2">{isPerfectScore ? 'Awesome! You got a Star!' : 'Great Job!'}</h2>
            <p className="text-lg text-gray-600 mb-6">Level: {difficulty}</p>
          </div>
          <div className="text-3xl font-bold text-amber-500 mb-8">Score: {score}</div>
          <div className="space-y-4">
            <button onClick={() => handleStart(selectedCategory!, difficulty)} className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-3 rounded-xl shadow-[0_4px_0_rgb(29,78,216)] active:translate-y-1 transition-all">Play Again</button>
            <button onClick={goHome} className="w-full bg-gray-500 hover:bg-gray-600 text-white text-xl font-bold py-3 rounded-xl shadow-[0_4px_0_rgb(75,85,99)] active:translate-y-1 transition-all">Choose Category</button>
            <button onClick={openStickerBook} className="w-full bg-amber-400 hover:bg-amber-500 text-white text-xl font-bold py-3 rounded-xl shadow-[0_6px_0_rgb(180,83,9)] active:translate-y-1 transition-all flex items-center justify-center gap-2">
              <Trophy size={20}/> My Stickers
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!puzzle) return null;

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {backgroundWrapper}
      <div className="absolute top-0 left-0 w-full p-2 md:p-4 flex justify-center items-center gap-x-2 md:gap-x-4 z-50">
        <button onClick={goHome} className="header-action-btn header-home-btn" aria-label="Go Home">
          <Home size={24} />
        </button>
        <div className="header-action-btn header-score-btn">
          <Star className="text-yellow-200 fill-yellow-200 mr-2" size={20} />
          <span key={scoreKey} className="animate-score-pop">{score}</span>
        </div>
        <button onClick={openStickerBook} className="header-action-btn header-sticker-btn" aria-label="Open Sticker Book">
          <Trophy size={24} />
        </button>
        <div className="header-action-btn header-progress-btn">
          <span className="text-sm md:text-base">{currentIndex + 1} / {puzzles.length}</span>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-40">
        {puzzle.options.map((option, idx) => {
          const isFeedbackActive = feedback?.option === option;
          const isSuccess = isFeedbackActive && feedback.status === 'correct';
          const isError = isFeedbackActive && feedback.status === 'incorrect';
          
          let buttonClasses = `balloon-option pointer-events-auto transition-all duration-300 ${balloonColors[idx % balloonColors.length]} `;

          if (isSuccess) {
            buttonClasses += "bg-green-500 !bg-gradient-to-b !from-green-300 !to-green-500 scale-110 ring-4 ring-green-200";
          } else if (isError) {
            buttonClasses += "bg-red-500 !bg-gradient-to-b !from-red-300 !to-red-500 animate-shake ring-4 ring-red-200";
          } else if (bridgeState !== BridgeState.BROKEN) {
            buttonClasses += "opacity-0 cursor-not-allowed scale-90";
          } else {
            buttonClasses += "hover:scale-110 hover:z-10";
          }
          
          buttonClasses += idx % 2 === 0 ? ' float-anim-1' : ' float-anim-2';
          const positionStyle = balloonPositions[idx] || { opacity: 0 };

          return (
            <button
              key={`${puzzle.id}-${idx}`}
              onClick={() => handleOptionClick(option)}
              disabled={bridgeState !== BridgeState.BROKEN}
              className={buttonClasses}
              style={positionStyle}
            >
              <span className="z-10 relative">{option}</span>
            </button>
          );
        })}
      </div>

      <div className="absolute bottom-6 md:bottom-20 w-full left-1/2 -translate-x-1/2 max-w-4xl z-10 flex flex-col items-center">
        <div className={`mb-4 md:mb-8 flex flex-col items-center transition-all duration-300 ${shake ? 'scale-105' : ''}`}>
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl shadow-lg border-4 border-white mb-4 flex items-center justify-center">
            <span className="text-5xl md:text-6xl select-none">{getEmojiForPrompt(puzzle.imagePrompt, selectedCategory ?? undefined)}</span>
          </div>
          <div className={`bg-white px-4 md:px-6 py-3 md:py-4 rounded-2xl shadow-xl border-b-8 border-blue-200 flex items-center justify-center gap-4 ${shake ? 'animate-shake' : ''}`}>
            {renderWordDisplay()}
            <button onClick={() => speakWord(puzzle.word)} className="bg-blue-100 hover:bg-blue-200 p-2 md:p-3 rounded-full transition-colors">
              <Volume2 size={24} className="text-blue-600" />
            </button>
          </div>
        </div>

        <div className="w-full relative h-32 md:h-48">
          <Character position={characterPos} isResetting={isResetting} onClick={handleBusClick}/>
          <Bridge state={bridgeState} correctAnswer={puzzle.missing} />
        </div>
      </div>
    </div>
  );
}