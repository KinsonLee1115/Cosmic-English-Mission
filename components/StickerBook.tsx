import React from 'react';
import { Home, CheckCircle } from 'lucide-react';
import { CollectedStickers, Difficulty } from '../types';
import { FullWordDetails, getAllWordsWithDetails } from '../constants'; // Import FullWordDetails
import { getEmojiForPrompt } from '../App'; // Re-use emoji mapping from App

interface StickerBookProps {
  collectedStickers: CollectedStickers;
  onClose: () => void;
}

const StickerBook: React.FC<StickerBookProps> = ({ collectedStickers, onClose }) => {
  const allWords = React.useMemo(() => getAllWordsWithDetails(), []);

  // Group words by category and then by difficulty
  const groupedWords = allWords.reduce((acc, wordDetail) => {
    if (!acc[wordDetail.category]) {
      acc[wordDetail.category] = {};
    }
    if (!acc[wordDetail.category][wordDetail.difficulty]) {
      acc[wordDetail.category][wordDetail.difficulty] = [];
    }
    acc[wordDetail.category][wordDetail.difficulty]!.push(wordDetail);
    return acc;
  }, {} as Record<string, Partial<Record<Difficulty, FullWordDetails[]>>>);


  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-sky-200/80 backdrop-blur-sm">
      <div className="sticker-book-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-blue-700">My Sticker Book</h1>
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-all flex items-center gap-2"
            aria-label="Back to Home"
          >
            <Home size={24} />
            <span className="hidden sm:inline">Back to Home</span>
          </button>
        </div>

        {Object.keys(groupedWords).sort().map(category => (
          <div key={category} className="sticker-category-section">
            <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
              {getEmojiForPrompt(category)} {category}
            </h2>
            {/* Iterate through difficulties (Easy, Medium, Hard) */}
            {Object.values(Difficulty).map(difficulty => {
              const wordsForDifficulty = groupedWords[category]?.[difficulty];
              if (!wordsForDifficulty || wordsForDifficulty.length === 0) {
                return null;
              }
              return (
                <div key={`${category}-${difficulty}`} className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">{difficulty}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {wordsForDifficulty
                      .sort((a, b) => a.word.localeCompare(b.word)) // Sort stickers alphabetically
                      .map(wordDetail => {
                        const isCollected = collectedStickers[wordDetail.word.toUpperCase()]?.collected;
                        return (
                          <div
                            key={wordDetail.word}
                            className={`sticker-slot ${isCollected ? 'collected' : ''}`}
                            aria-label={`${wordDetail.word} sticker: ${isCollected ? 'collected' : 'uncollected'}`}
                          >
                            <span className="sticker-emoji text-3xl mb-1">{getEmojiForPrompt(wordDetail.imagePrompt || wordDetail.word)}</span>
                            <span className={`sticker-word text-sm font-medium ${isCollected ? 'collected' : 'text-gray-500'}`}>
                              {wordDetail.word}
                            </span>
                            {isCollected && (
                              <CheckCircle className="absolute top-1 right-1 text-green-600" size={16} fill="currentColor" />
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StickerBook;