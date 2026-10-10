import { WordPuzzle, Difficulty } from './types';

export const BUS_IMAGE_URL = "https://ling.cuhk.edu.hk/files/others/schoolbus.svg";

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export interface WordInfo {
  word: string;
  imagePrompt?: string;
}

// Extended WordInfo for Sticker Book, including category and difficulty
export interface FullWordDetails extends WordInfo {
  category: string;
  difficulty: Difficulty;
}

const commonConsonants = 'BCDFGHJKLMNPQRSTVWXYZ'.split('');
const commonVowels = 'AEIOU'.split('');
const commonBlends = ['CH', 'SH', 'TH', 'WH', 'BL', 'CL', 'FL', 'GL', 'PL', 'SL', 'BR', 'CR', 'DR', 'FR', 'GR', 'PR', 'TR', 'SC', 'SK', 'SM', 'SN', 'SP', 'ST', 'SW', 'TW'];
const complexBlends = ['STR', 'SPL', 'THR', 'SCH', 'SCR', 'SHR', 'SPR', 'SQU'];
const vowelTeams = ['AI', 'AY', 'EE', 'EA', 'IE', 'EI', 'OO', 'OU', 'OW', 'OY', 'OI', 'AU', 'AW', 'EW', 'UI'];
const rControlled = ['AR', 'ER', 'IR', 'OR', 'UR'];

const pickRandom = <T>(arr: T[], exclude: T[] = []): T => {
  const available = arr.filter(item => !exclude.includes(item));
  if (available.length === 0) return arr[Math.floor(Math.random() * arr.length)]; // Fallback if all are excluded
  return available[Math.floor(Math.random() * available.length)];
};

const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Function to dynamically generate missing parts and options based on word and difficulty
const generatePuzzleDetails = (wordInfo: WordInfo, difficulty: Difficulty): Omit<WordPuzzle, 'id'> => {
  const word = wordInfo.word.toUpperCase();
  let missing = '';
  let display = '';
  let options: string[] = [];
  const imagePrompt = wordInfo.imagePrompt || `A picture of a ${word.toLowerCase()}`;

  const getCommonDistractors = (correct: string, num: number, source: string[]): string[] => {
    const distractors: string[] = [];
    while (distractors.length < num) {
      const candidate = pickRandom(source, [correct, ...distractors]);
      if (candidate !== correct) {
        distractors.push(candidate);
      }
    }
    return distractors;
  };

  if (difficulty === Difficulty.EASY) {
    // Focus on single letters, CVC words
    if (word.length >= 3) {
      // Prioritize middle vowel for CVC, then initial consonant
      if (commonVowels.includes(word[1])) {
        missing = word[1];
        display = word[0] + '_' + word.slice(2);
        options = [missing, ...getCommonDistractors(missing, 2, commonVowels)];
      } else if (commonConsonants.includes(word[0])) {
        missing = word[0];
        display = '_' + word.slice(1);
        options = [missing, ...getCommonDistractors(missing, 2, commonConsonants)];
      } else { // Fallback
        missing = word[0];
        display = '_' + word.slice(1);
        options = [missing, ...getCommonDistractors(missing, 2, commonConsonants.concat(commonVowels))];
      }
    } else { // Very short words, take first letter
      missing = word[0];
      display = '_' + word.slice(1);
      options = [missing, ...getCommonDistractors(missing, 2, commonConsonants.concat(commonVowels))];
    }
    options = shuffleArray(options).slice(0, 3);
  } else if (difficulty === Difficulty.MEDIUM) {
    // Focus on common digraphs and blends
    let found = false;
    for (const blend of commonBlends) {
      if (word.startsWith(blend) && blend.length <= word.length -1) { // Blend at start, leave at least one letter
        missing = blend;
        display = '_'.repeat(blend.length) + word.slice(blend.length);
        options = [missing, ...getCommonDistractors(missing, 3, commonBlends)];
        found = true;
        break;
      }
    }
    if (!found && word.length >= 2) { // Fallback to first two letters if no common blend
      missing = word.substring(0, 2);
      display = '__' + word.slice(2);
      options = [missing, ...getCommonDistractors(missing, 3, commonBlends.concat(['AN', 'IN', 'ON']))]; // Mixed distractors
    } else if (!found) { // Single letter fallback
      missing = word[0];
      display = '_' + word.slice(1);
      options = [missing, ...getCommonDistractors(missing, 3, commonConsonants.concat(commonVowels))];
    }
    options = shuffleArray(options).slice(0, 4);
  } else { // Difficulty.HARD
    // Focus on complex blends, vowel teams, r-controlled vowels, or longer segments
    let found = false;
    const allSegments = [...complexBlends, ...vowelTeams, ...rControlled, ...commonBlends];
    for (const segment of allSegments) {
      if (word.includes(segment) && segment.length < word.length) { // Can be anywhere, and not the whole word
        const startIndex = word.indexOf(segment);
        missing = segment;
        display = word.substring(0, startIndex) + '_'.repeat(segment.length) + word.substring(startIndex + segment.length);
        options = [missing, ...getCommonDistractors(missing, 3, allSegments)];
        found = true;
        break;
      }
    }
    if (!found && word.length >= 3) { // Fallback to first three letters
      missing = word.substring(0, 3);
      display = '___' + word.slice(3);
      options = [missing, ...getCommonDistractors(missing, 3, ['STR', 'SPL', 'THR', 'QUA', 'SCR', 'SHR'])];
    } else if (!found && word.length >= 2) { // Fallback to first two letters
      missing = word.substring(0, 2);
      display = '__' + word.slice(2);
      options = [missing, ...getCommonDistractors(missing, 3, allSegments)];
    } else if (!found) { // Single letter fallback
      missing = word[0];
      display = '_' + word.slice(1);
      options = [missing, ...getCommonDistractors(missing, 3, commonConsonants.concat(commonVowels))];
    }
    options = shuffleArray(options).slice(0, 4);
  }

  // Final check to ensure options are always unique and contain the missing part
  if (!options.includes(missing)) {
    options[Math.floor(Math.random() * options.length)] = missing; // Replace a random option if missing is absent
  }
  options = Array.from(new Set(options)); // Ensure uniqueness

  // Trim or pad options to match difficulty requirement
  const targetOptionCount = difficulty === Difficulty.EASY ? 3 : 4;
  while (options.length < targetOptionCount) {
      options.push(pickRandom(commonConsonants.concat(commonVowels), options));
      options = Array.from(new Set(options));
  }
  options = options.slice(0, targetOptionCount);
  if (!options.includes(missing)) { // Final check after slicing
      options[Math.floor(Math.random() * options.length)] = missing;
  }
  
  return { word, missing, display, options: shuffleArray(options), imagePrompt };
};

// --- Word Lists by Category ---
const sightWords: { easy: WordInfo[], medium: WordInfo[], hard: WordInfo[] } = {
  easy: [
    { word: 'the' }, { word: 'to' }, { word: 'and' }, { word: 'a' }, { word: 'I' },
    { word: 'go' }, { word: 'see' }, { word: 'my' }, { word: 'for' }, { word: 'is' },
    { word: 'little' }, { word: 'can' }, { word: 'me' }, { word: 'we' }, { word: 'have' },
    { word: 'in' }, { word: 'not' }, { word: 'big' }, { word: 'red' }, { word: 'run' }
  ],
  medium: [
    { word: 'it' }, { word: 'do' }, { word: 'he' }, { word: 'no' }, { word: 'up' },
    { word: 'look' }, { word: 'one' }, { word: 'get' }, { word: 'said' }, { word: 'play' },
    { word: 'away' }, { word: 'come' }, { word: 'down' }, { word: 'find' }, { word: 'help' },
    { word: 'make' }, { word: 'here' }, { word: 'blue' }, { word: 'funny' }, { word: 'jump' }
  ],
  hard: [
    { word: 'come' }, { word: 'did' }, { word: 'eat' }, { word: 'four' }, { word: 'good' },
    { word: 'new' }, { word: 'out' }, { word: 'please' }, { word: 'pretty' }, { word: 'saw' },
    { word: 'that' }, { word: 'this' }, { word: 'under' }, { word: 'want' }, { word: 'what' },
    { word: 'white' }, { word: 'who' }, { word: 'with' }, { word: 'yes' }, { word: 'from' }
  ]
};

const peopleFamilyWords: WordInfo[] = [
  { word: 'mom' }, { word: 'dad' }, { word: 'sister' }, { word: 'brother' }, { word: 'baby' },
  { word: 'boy' }, { word: 'girl' }, { word: 'friend' }, { word: 'cousin' }, { word: 'aunt' },
  { word: 'uncle' }, { word: 'grandma' }, { word: 'grandpa' }, { word: 'family' }, { word: 'child' },
  { word: 'man' }, { word: 'woman' }, { word: 'love' }, { word: 'share' }, { word: 'hug' }
];

const animalWords: WordInfo[] = [
  { word: 'cat' }, { word: 'dog' }, { word: 'bird' }, { word: 'fish' }, { word: 'lion' },
  { word: 'cow' }, { word: 'horse' }, { word: 'bear' }, { word: 'duck' }, { word: 'frog' },
  { word: 'pig' }, { word: 'sheep' }, { word: 'monkey' }, { word: 'rabbit' }, { word: 'tiger' },
  { word: 'mouse' }, { word: 'goat' }, { word: 'hen' }, { word: 'chick' }, { word: 'snail' }
];

const foodDrinkWords: WordInfo[] = [
  { word: 'apple' }, { word: 'banana' }, { word: 'bread' }, { word: 'milk' }, { word: 'water' },
  { word: 'juice' }, { word: 'egg' }, { word: 'cake' }, { word: 'cookie' }, { word: 'cheese' },
  { word: 'soup' }, { word: 'pizza' }, { word: 'fruit' }, { word: 'candy' }, { word: 'honey' },
  { word: 'yogurt' }, { word: 'sandwich' }, { word: 'burger' }, { word: 'chips' }, { word: 'soda' }
];

const actionWords: WordInfo[] = [
  { word: 'eat' }, { word: 'drink' }, { word: 'sleep' }, { word: 'run' }, { word: 'jump' },
  { word: 'walk' }, { word: 'play' }, { word: 'sit' }, { word: 'stand' }, { word: 'read' },
  { word: 'write' }, { word: 'look' }, { word: 'listen' }, { word: 'sing' }, { word: 'dance' },
  { word: 'draw' }, { word: 'help' }, { word: 'talk' }, { word: 'laugh' }, { word: 'cry' }
];

const colorWords: WordInfo[] = [
  { word: 'red' }, { word: 'blue' }, { word: 'yellow' }, { word: 'green' }, { word: 'black' },
  { word: 'white' }, { word: 'pink' }, { word: 'orange' }, { word: 'purple' }, { word: 'brown' },
  { word: 'grey' }, { word: 'gold' }, { word: 'silver' }, { word: 'dark' }, { word: 'light' }
];

const numberWords: WordInfo[] = [
  { word: 'one' }, { word: 'two' }, { word: 'three' }, { word: 'four' }, { word: 'five' },
  { word: 'six' }, { word: 'seven' }, { word: 'eight' }, { word: 'nine' }, { word: 'ten' },
  { word: 'zero' }, { word: 'count' }, { word: 'many' }, { word: 'few' }, { word: 'first' }
];

const bodyPartWords: WordInfo[] = [
  { word: 'eyes' }, { word: 'ears' }, { word: 'nose' }, { word: 'mouth' }, { word: 'hands' },
  { word: 'feet' }, { word: 'head' }, { word: 'arm' }, { word: 'leg' }, { word: 'finger' },
  { word: 'toe' }, { word: 'hair' }, { word: 'skin' }, { word: 'face' }, { word: 'tooth' }
];

const everydayObjectWords: WordInfo[] = [
  { word: 'ball' }, { word: 'book' }, { word: 'car' }, { word: 'chair' }, { word: 'table' },
  { word: 'door' }, { word: 'window' }, { word: 'bag' }, { word: 'pen' }, { word: 'toy' },
  { word: 'cup' }, { word: 'plate' }, { word: 'bed' }, { word: 'lamp' }, { word: 'clock' }
];

const natureEnvironmentWords: WordInfo[] = [
  { word: 'sun' }, { word: 'rain' }, { word: 'snow' }, { word: 'wind' }, { word: 'flower' },
  { word: 'tree' }, { word: 'grass' }, { word: 'leaf' }, { word: 'sky' }, { word: 'cloud' },
  { word: 'river' }, { word: 'lake' }, { word: 'mountain' }, { word: 'rock' }, { word: 'sea' }
];

const feelingsEmotionsWords: WordInfo[] = [
  { word: 'happy' }, { word: 'sad' }, { word: 'angry' }, { word: 'excited' }, { word: 'scared' },
  { word: 'shy' }, { word: 'proud' }, { word: 'silly' }, { word: 'calm' }, { word: 'tired' },
  { word: 'sleepy' }, { word: 'hungry' }, { word: 'thirsty' }, { word: 'love' }, { word: 'fun' }
];

const schoolItemWords: WordInfo[] = [
  { word: 'book' }, { word: 'pencil' }, { word: 'paper' }, { word: 'desk' }, { word: 'board' },
  { word: 'teacher' }, { word: 'crayon' }, { word: 'glue' }, { word: 'scissors' }, { word: 'backpack' },
  { word: 'ruler' }, { word: 'eraser' }, { word: 'marker' }, { word: 'chalk' }, { word: 'computer' }
];

const dailyRoutineWords: WordInfo[] = [
  { word: 'wake' }, { word: 'wash' }, { word: 'brush' }, { word: 'go' }, { word: 'come' },
  { word: 'stop' }, { word: 'eat' }, { word: 'drink' }, { word: 'sleep' }, { word: 'play' },
  { word: 'walk' }, { word: 'run' }, { word: 'morning' }, { word: 'night' }, { word: 'early' }
];

const sportInterestsWords: WordInfo[] = [
  { word: 'painting' }, { word: 'drawing' }, { word: 'singing' }, { word: 'dancing' }, { word: 'reading' },
  { word: 'taekwondo' }, { word: 'karate' }, { word: 'swimming' }, { word: 'cycling' }, { word: 'running' },
  { word: 'football' }, { word: 'basketball' }, { word: 'baseball' }, { word: 'tennis' }, { word: 'golf' },
  { word: 'ice skating' }, { word: 'figure skate' }, { word: 'skiing' }, { word: 'surfing' }, { word: 'hiking' }
];


// --- Categorized Puzzles (will be generated on demand from word lists) ---
// This structure groups words that can be used to generate puzzles based on difficulty and category.
export const allCategorizedWords: {
  [key: string]: {
    [key in Difficulty]?: WordInfo[]
  }
} = {
  'Common Sight-Words': {
    [Difficulty.EASY]: sightWords.easy,
    [Difficulty.MEDIUM]: sightWords.medium,
    [Difficulty.HARD]: sightWords.hard,
  },
  'People & Family': {
    [Difficulty.EASY]: peopleFamilyWords.slice(0, 10), // A portion for easy
    [Difficulty.MEDIUM]: peopleFamilyWords,
    [Difficulty.HARD]: peopleFamilyWords,
  },
  'Animals': {
    [Difficulty.EASY]: animalWords.slice(0, 10),
    [Difficulty.MEDIUM]: animalWords,
    [Difficulty.HARD]: animalWords,
  },
  'Food & Drink': {
    [Difficulty.EASY]: foodDrinkWords.slice(0, 10),
    [Difficulty.MEDIUM]: foodDrinkWords,
    [Difficulty.HARD]: foodDrinkWords,
  },
  'Actions (Verbs)': {
    [Difficulty.EASY]: actionWords.slice(0, 10),
    [Difficulty.MEDIUM]: actionWords,
    [Difficulty.HARD]: actionWords,
  },
  'Colors': {
    [Difficulty.EASY]: colorWords.slice(0, 10),
    [Difficulty.MEDIUM]: colorWords,
    [Difficulty.HARD]: colorWords,
  },
  'Numbers': {
    [Difficulty.EASY]: numberWords.slice(0, 10),
    [Difficulty.MEDIUM]: numberWords,
    [Difficulty.HARD]: numberWords,
  },
  'Body Parts': {
    [Difficulty.EASY]: bodyPartWords.slice(0, 10),
    [Difficulty.MEDIUM]: bodyPartWords,
    [Difficulty.HARD]: bodyPartWords,
  },
  'Everyday Objects': {
    [Difficulty.EASY]: everydayObjectWords.slice(0, 10),
    [Difficulty.MEDIUM]: everydayObjectWords,
    [Difficulty.HARD]: everydayObjectWords,
  },
  'Nature & Environment': {
    [Difficulty.MEDIUM]: natureEnvironmentWords.slice(0, 10), // Medium for more complex words
    [Difficulty.HARD]: natureEnvironmentWords,
  },
  'Feelings & Emotions': {
    [Difficulty.MEDIUM]: feelingsEmotionsWords.slice(0, 10),
    [Difficulty.HARD]: feelingsEmotionsWords,
  },
  'School Items': {
    [Difficulty.MEDIUM]: schoolItemWords.slice(0, 10),
    [Difficulty.HARD]: schoolItemWords,
  },
  'Daily Routines': {
    [Difficulty.MEDIUM]: dailyRoutineWords.slice(0, 10),
    [Difficulty.HARD]: dailyRoutineWords,
  },
  'Sports & Interests': {
    [Difficulty.EASY]: sportInterestsWords.slice(0, 5), // A simpler subset for Easy
    [Difficulty.MEDIUM]: sportInterestsWords.slice(0, 15), // More for Medium
    [Difficulty.HARD]: sportInterestsWords, // All words for Hard
  },
};

// Map difficulties to categories - this now describes which categories are generally available at which difficulty.
// This is used for fallback if a specific category/difficulty combo has no words.
export const difficultyToCategories: { [key in Difficulty]: string[] } = {
  [Difficulty.EASY]: [
    'Common Sight-Words', 'People & Family', 'Animals', 'Food & Drink',
    'Actions (Verbs)', 'Colors', 'Numbers', 'Body Parts', 'Everyday Objects',
    'Sports & Interests' // Added Sports & Interests to Easy
  ],
  [Difficulty.MEDIUM]: [
    'Common Sight-Words', 'People & Family', 'Animals', 'Food & Drink',
    'Actions (Verbs)', 'Colors', 'Numbers', 'Body Parts', 'Everyday Objects',
    'Nature & Environment', 'Feelings & Emotions', 'School Items', 'Daily Routines',
    'Sports & Interests' // Added Sports & Interests to Medium
  ],
  [Difficulty.HARD]: [
    'Common Sight-Words', 'Nature & Environment', 'Feelings & Emotions', 'School Items',
    'Daily Routines', 'People & Family', 'Animals', 'Food & Drink',
    'Actions (Verbs)', 'Colors', 'Numbers', 'Body Parts', 'Everyday Objects',
    'Sports & Interests' // Added Sports & Interests to Hard
  ],
};

export const getInitialPuzzles = (selectedCategory: string, difficulty: Difficulty, count: number = 10): WordPuzzle[] => {
  let wordPool = allCategorizedWords[selectedCategory]?.[difficulty];

  if (!wordPool || wordPool.length === 0) {
    console.warn(`No words available for category "${selectedCategory}" at difficulty "${difficulty}". Attempting to find alternatives...`);
    // Find alternative categories for this difficulty that *do* have words
    const alternativeCategories = difficultyToCategories[difficulty]
        .filter(cat => allCategorizedWords[cat]?.[difficulty]?.length > 0); // Filter to ensure they have words

    if (alternativeCategories.length > 0) {
        const fallbackCategoryName = pickRandom(alternativeCategories);
        wordPool = allCategorizedWords[fallbackCategoryName]?.[difficulty];
        console.log(`Falling back to category "${fallbackCategoryName}" for difficulty "${difficulty}".`);
    } else {
        console.error(`No valid categories with words found for difficulty: ${difficulty}`);
        return []; // No words found anywhere for this difficulty
    }
  }

  // Double-check wordPool after potential fallback
  if (!wordPool || wordPool.length === 0) {
    console.error(`Still no words after fallback attempt for difficulty: ${difficulty}.`);
    return [];
  }

  const shuffledWords = shuffleArray([...wordPool]);
  const selectedWords = shuffledWords.slice(0, count);

  return selectedWords.map(wordInfo => ({
    id: generateId(),
    ...generatePuzzleDetails(wordInfo, difficulty),
  }));
};

/**
 * Flattens all categorized words into a single array, adding their category and difficulty.
 * Useful for displaying all possible stickers in a Sticker Book.
 */
export const getAllWordsWithDetails = (): FullWordDetails[] => {
  const allWords: FullWordDetails[] = [];
  for (const categoryName in allCategorizedWords) {
    for (const difficultyKey in allCategorizedWords[categoryName]) {
      const difficulty = difficultyKey as Difficulty;
      const wordsForDifficulty = allCategorizedWords[categoryName][difficulty];
      if (wordsForDifficulty) {
        for (const wordInfo of wordsForDifficulty) {
          allWords.push({
            ...wordInfo,
            category: categoryName,
            difficulty: difficulty,
          });
        }
      }
    }
  }
  // Remove duplicates based on the word itself, as a word might appear in multiple difficulty lists
  const uniqueWordsMap = new Map<string, FullWordDetails>();
  for (const wordDetail of allWords) {
    // If a word appears multiple times, keep the first one encountered (or could have logic to prefer hard difficulty etc.)
    if (!uniqueWordsMap.has(wordDetail.word.toUpperCase())) {
      uniqueWordsMap.set(wordDetail.word.toUpperCase(), wordDetail);
    }
  }
  return Array.from(uniqueWordsMap.values());
};