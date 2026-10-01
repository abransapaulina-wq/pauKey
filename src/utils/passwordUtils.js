/**
 * Password Security Utility Functions
 * Based on "Manual de Contraseñas Seguras - Hacker Mentor"
 */

// Common weak password patterns and words
const COMMON_WEAK_WORDS = [
  'password', 'contraseña', 'contrasena', '123456', '12345678', 'admin', 'administrator',
  'qwerty', 'asdfgh', 'zxcvbn', 'welcome', 'login', 'hacker', 'mentor', 'secret',
  'master', 'access', 'monkey', 'dragon', 'football', 'baseball', 'superman', 'iloveyou',
  'hola123', 'cambiar', 'usuario', 'cuenta', 'letras', 'clave'
];

/**
 * Uses window.crypto.getRandomValues for cryptographically safe random integers
 */
export function getSecureRandomInt(max) {
  if (max <= 0) return 0;
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % max;
}

/**
 * Gets a random item from an array securely
 */
export function getSecureRandomItem(arr) {
  return arr[getSecureRandomInt(arr.length)];
}

/**
 * Evaluates password criteria and strength score based on Hacker Mentor manual rules
 */
export function evaluatePassword(password) {
  if (!password) {
    return {
      score: 0,
      label: 'Sin contraseña',
      color: 'slate',
      badgeBg: 'bg-slate-800 text-slate-400 border-slate-700',
      barColor: 'bg-slate-700',
      timeToCrack: 'Ingresa una contraseña',
      entropyBits: 0,
      checklist: {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        symbol: false,
        noCommonWords: true,
        noSequencesOrDates: true,
      },
      warnings: [],
      suggestions: []
    };
  }

  const length = password.length;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  // Check common pattern matches
  const lowerPwd = password.toLowerCase();
  const foundCommonWords = COMMON_WEAK_WORDS.filter(w => lowerPwd.includes(w));
  const hasCommonWords = foundCommonWords.length > 0;

  // Check repeating characters (e.g. "aaa", "111")
  const hasRepeats = /(.)\1{2,}/.test(password);

  // Check obvious sequences
  const sequences = ['123', '234', '345', '456', '567', '678', '789', '890', 
                     'abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi',
                     'qwer', 'asdf', 'zxcv', '321', '654', '987', 'cba'];
  const foundSequences = sequences.filter(seq => lowerPwd.includes(seq));
  const hasSequences = foundSequences.length > 0;

  // Check recent years / dates (1950-2030 or 6-8 digits)
  const yearMatch = /(19[5-9]\d|20[0-3]\d)/.test(password);
  const dateMatch = /\b\d{6,8}\b/.test(password);
  const hasDatesOrYears = yearMatch || dateMatch;

  const noCommonWords = !hasCommonWords && !hasRepeats;
  const noSequencesOrDates = !hasSequences && !hasDatesOrYears;

  const checklist = {
    length: length >= 12,
    uppercase: hasUppercase,
    lowercase: hasLowercase,
    number: hasNumber,
    symbol: hasSymbol,
    noCommonWords,
    noSequencesOrDates
  };

  // Calculate Character Pool Size (Alphabet size)
  let poolSize = 0;
  if (hasLowercase) poolSize += 26;
  if (hasUppercase) poolSize += 26;
  if (hasNumber) poolSize += 10;
  if (hasSymbol) poolSize += 33; // standard ASCII symbols count

  // Calculate raw entropy bits
  let entropyBits = poolSize > 0 ? length * Math.log2(poolSize) : 0;

  // Apply penalties for predictable patterns
  let warnings = [];
  if (hasCommonWords) {
    entropyBits = Math.max(5, entropyBits - 20);
    warnings.push(`Contiene palabras o patrones muy comunes: "${foundCommonWords.join(', ')}"`);
  }
  if (hasRepeats) {
    entropyBits = Math.max(5, entropyBits - 10);
    warnings.push('Contiene repeticiones continuas del mismo carácter (ej. "aaa" o "111").');
  }
  if (hasSequences) {
    entropyBits = Math.max(5, entropyBits - 15);
    warnings.push(`Contiene secuencias obvias o del teclado: "${foundSequences.join(', ')}"`);
  }
  if (hasDatesOrYears) {
    entropyBits = Math.max(5, entropyBits - 15);
    warnings.push('Contiene años recientes o formato de fecha fácilmente adivinable por diccionarios.');
  }
  if (length < 12) {
    warnings.push('La longitud es menor a 12 caracteres. El "Manual Hacker Mentor" exige mínimo 12 para resistir fuerza bruta moderna.');
  }

  // Determine strength level (0 to 100 score)
  let score = 0;
  
  // Base score from checklist items (up to 70 points)
  if (checklist.length) score += 20;
  else if (length >= 8) score += 10;

  if (checklist.uppercase) score += 10;
  if (checklist.lowercase) score += 10;
  if (checklist.number) score += 10;
  if (checklist.symbol) score += 15;
  if (checklist.noCommonWords) score += 12;
  if (checklist.noSequencesOrDates) score += 13;

  // Extra boost for 16+ length
  if (length >= 16) score += 10;

  score = Math.min(100, Math.max(0, score));

  // Determine visual styling based on score & checklist
  let label = 'Débil';
  let color = 'red';
  let badgeBg = 'bg-rose-950/80 text-rose-300 border-rose-800/60';
  let barColor = 'bg-gradient-to-r from-rose-600 to-red-500';

  if (score >= 85 && checklist.length && checklist.noCommonWords) {
    label = 'Excelente / Inviolable';
    color = 'emerald';
    badgeBg = 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 shadow-lg shadow-emerald-950/50';
    barColor = 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400';
  } else if (score >= 65) {
    label = 'Fuerte / Segura';
    color = 'green';
    badgeBg = 'bg-teal-950/80 text-teal-300 border-teal-700/60';
    barColor = 'bg-gradient-to-r from-teal-500 to-emerald-400';
  } else if (score >= 45) {
    label = 'Media / Aceptable';
    color = 'amber';
    badgeBg = 'bg-amber-950/80 text-amber-300 border-amber-700/60';
    barColor = 'bg-gradient-to-r from-amber-500 to-yellow-400';
  } else if (score >= 25) {
    label = 'Débil / Vulnerable';
    color = 'orange';
    badgeBg = 'bg-orange-950/80 text-orange-300 border-orange-700/60';
    barColor = 'bg-gradient-to-r from-orange-600 to-amber-500';
  }

  // Calculate Time to Crack based on 10^11 attempts/sec (high-end GPU cracker cluster)
  const timeToCrack = estimateTimeToCrack(poolSize, length, entropyBits);

  return {
    score,
    label,
    color,
    badgeBg,
    barColor,
    timeToCrack,
    entropyBits: Math.round(entropyBits),
    poolSize,
    checklist,
    warnings
  };
}

/**
 * Calculates human-readable time to crack via brute force
 */
function estimateTimeToCrack(poolSize, length, entropyBits) {
  if (length === 0 || poolSize === 0) return '0 segundos';
  
  // Calculate average combinations (2^entropyBits / 2)
  const totalCombinations = Math.pow(2, entropyBits);
  const guessesPerSecond = 1e11; // 100 billion guesses per sec
  const seconds = totalCombinations / guessesPerSecond;

  if (seconds < 0.0001) return 'Instantáneo (< 1 milisegundo)';
  if (seconds < 1) return 'Instantáneo (< 1 segundo)';
  if (seconds < 60) return `${Math.round(seconds)} segundos`;
  
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes)} minutos`;

  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)} horas`;

  const days = hours / 24;
  if (days < 365) return `${Math.round(days)} días`;

  const years = days / 365;
  if (years < 100) return `${Math.round(years)} años`;
  if (years < 1000) return `${Math.round(years)} siglos`;
  if (years < 1e6) return `${Math.round(years / 1000).toLocaleString('es-ES')} milenios`;
  if (years < 1e9) return `${(years / 1e6).toFixed(1)} millones de milenios`;
  if (years < 1e12) return `${(years / 1e9).toFixed(1)} billones de milenios`;
  
  return 'Trillones de milenios (Virtualmente indestructible)';
}

/**
 * Leet speak character map
 */
const LEET_MAP = {
  'a': '@', 'A': '@',
  'e': '3', 'E': '3',
  'i': '!', 'I': '1',
  'o': '0', 'O': '0',
  's': '$', 'S': '$',
  't': '7', 'T': '7',
  'b': '8', 'B': '8',
  'g': '9', 'G': '9'
};

const SYMBOLS = ['!', '@', '#', '$', '%', '&', '*', '?', '+', '='];
const WORDS_POOL = [
  'Perros', 'Comen', 'Galletas', 'Viento', 'Trueno', 'Galaxia', 'Horizonte', 
  'Camino', 'Fuego', 'Planeta', 'Cielo', 'Océano', 'Codigo', 'Matriz', 
  'Nube', 'Sombra', 'Rayo', 'Estrella', 'Futuro', 'Escudo'
];

/**
 * Generates 3 security suggestions based on user seed using window.crypto.getRandomValues()
 */
export function generatePasswordSuggestions(seedWord = 'Hacker') {
  const cleanSeed = (seedWord || 'Hacker').trim().replace(/\s+/g, '');

  // -------------------------------------------------------------
  // Option 1: Sustitución + Símbolos/Números (Leet Speak + Prefix/Suffix)
  // -------------------------------------------------------------
  let leetSeed = '';
  for (let char of cleanSeed) {
    leetSeed += LEET_MAP[char] || char;
  }
  // Ensure some capitalization
  if (leetSeed.length > 0) {
    leetSeed = leetSeed.charAt(0).toUpperCase() + leetSeed.slice(1);
  }
  const sym1 = getSecureRandomItem(SYMBOLS);
  const sym2 = getSecureRandomItem(SYMBOLS);
  const num1 = getSecureRandomInt(89) + 10; // 2 digit num (10-98)
  const year = 2024 + getSecureRandomInt(3); // 2024, 2025, 2026
  
  // E.g.: @ssword2024! or H@ck3rM3nt0r#2026!
  const option1 = `${sym1}${leetSeed}${year}${sym2}`;


  // -------------------------------------------------------------
  // Option 2: Frase Secreta (Passphrase Memorizable)
  // -------------------------------------------------------------
  // Combines seed with 2 additional memorable words separated by numbers/symbols
  const word1 = getSecureRandomItem(WORDS_POOL);
  let word2 = getSecureRandomItem(WORDS_POOL);
  while (word2 === word1) {
    word2 = getSecureRandomItem(WORDS_POOL);
  }
  const formattedSeed = cleanSeed.charAt(0).toUpperCase() + cleanSeed.slice(1).toLowerCase();
  const passNum = getSecureRandomInt(9) + 1; // 1-9
  const passSym = getSecureRandomItem(['!', '?', '$', '#', '*']);
  
  // E.g.: MisPerros3ComenGalletas!
  const option2 = `Mis${formattedSeed}${passNum}${word1}${word2}${passSym}`;


  // -------------------------------------------------------------
  // Option 3: Alta Entropía Robusta (16+ Caracteres)
  // -------------------------------------------------------------
  // Complex 16+ char structure: seed base + alternating leet + random symbols + 4 random safe chars
  const safeChars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
  let randTail = '';
  for (let i = 0; i < 4; i++) {
    randTail += safeChars[getSecureRandomInt(safeChars.length)];
  }
  
  const robustSym1 = getSecureRandomItem(['!', '#', '$', '%', '&']);
  const robustSym2 = getSecureRandomItem(['!', '?', '*', '=']);
  const robustNum = (getSecureRandomInt(89) + 10).toString();
  
  let robustSeed = '';
  for (let i = 0; i < cleanSeed.length; i++) {
    const ch = cleanSeed[i];
    if (i % 2 === 0) {
      robustSeed += (LEET_MAP[ch] || ch.toUpperCase());
    } else {
      robustSeed += (ch === 'i' ? '!' : ch.toLowerCase());
    }
  }
  
  // E.g.: T!g3rL!ly#2024!RunS (from manual example format)
  const option3 = `${robustSeed}${robustSym1}${year}${robustSym2}${randTail}`;

  return [
    {
      id: 'opt1',
      title: 'Opción 1: Sustitución + Símbolos/Números',
      tag: 'Leet Speak & Afijos',
      password: option1,
      description: 'Aplica leet speak a tu palabra base y agrega prefijos/sufijos con números y símbolos (ej: @ssword2024!).',
      badgeColor: 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300'
    },
    {
      id: 'opt2',
      title: 'Opción 2: Frase Secreta (Passphrase)',
      tag: 'Memorizable & Segura',
      password: option2,
      description: 'Combina tu palabra semilla con 2 o 3 palabras adicionales memorables separadas por números/símbolos (ej: MisPerros3ComenGalletas!).',
      badgeColor: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
    },
    {
      id: 'opt3',
      title: 'Opción 3: Alta Entropía Robusta',
      tag: 'Máxima Seguridad (16+ Car.)',
      password: option3,
      description: 'Estructura compleja de 16+ caracteres combinando la raíz con caracteres aleatorios seguros (ej: T!g3rL!ly#2024!RunS).',
      badgeColor: 'border-indigo-500/40 bg-indigo-950/40 text-indigo-300'
    }
  ];
}
