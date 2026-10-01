import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Shield,
  Key,
  CheckCheck
} from 'lucide-react';
import { evaluatePassword, generatePasswordSuggestions, getSecureRandomInt } from '../utils/passwordUtils';

export default function PasswordChecker() {
  // Evaluator State
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Generator Seed State
  const [seedWord, setSeedWord] = useState('pauKey');
  const [copiedId, setCopiedId] = useState(null);

  // Evaluation derived from input
  const evaluation = useMemo(() => evaluatePassword(password), [password]);

  // Generated suggestions
  const [suggestions, setSuggestions] = useState(() => generatePasswordSuggestions('pauKey'));

  const handleRegenerateSuggestions = (seed = seedWord) => {
    setSuggestions(generatePasswordSuggestions(seed));
  };

  const handleSeedChange = (e) => {
    const val = e.target.value;
    setSeedWord(val);
    setSuggestions(generatePasswordSuggestions(val));
  };

  const copyToClipboard = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleUseSuggestion = (sugPassword) => {
    setPassword(sugPassword);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generateRandomSeed = () => {
    const seeds = ['pauKey', 'Cyber', 'Seguridad', 'Escudo', 'Matrix', 'Defensa', 'Rayo', 'Futuro'];
    const newSeed = seeds[getSecureRandomInt(seeds.length)];
    setSeedWord(newSeed);
    handleRegenerateSuggestions(newSeed);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* ------------------------------------------------------------- */}
      {/* MAIN GRID: EVALUATOR + GENERATOR                             */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================= */}
        {/* EVALUADOR EN TIEMPO REAL                                  */}
        {/* ========================================================= */}
        <section className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
          
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Evaluador de Contraseñas</h2>
            </div>
            {password && (
              <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${evaluation.badgeBg}`}>
                {evaluation.score}% • {evaluation.label}
              </span>
            )}
          </div>

          {/* Campo de Entrada */}
          <div className="relative mb-4">
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña aquí..."
                className="w-full pl-10 pr-20 py-3 bg-slate-950 border border-slate-700/70 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-white font-mono text-sm placeholder:text-slate-600 outline-none transition-colors"
              />
              <div className="absolute right-2 flex items-center gap-1">
                {password && (
                  <button
                    onClick={() => copyToClipboard(password, 'eval-input')}
                    title="Copiar"
                    className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg transition-colors"
                  >
                    {copiedId === 'eval-input' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Ocultar' : 'Mostrar'}
                  className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Barra de Fortaleza */}
          <div className="mb-5 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Fortaleza</span>
              <span className="font-mono text-slate-300">{evaluation.score} / 100</span>
            </div>
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-300 ${evaluation.barColor}`}
                style={{ width: `${password ? Math.max(evaluation.score, 5) : 0}%` }}
              />
            </div>
          </div>

          {/* Métricas clave: Tiempo de Fuerza Bruta y Entropía */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Tiempo fuerza bruta
              </div>
              <div className="text-xs sm:text-sm font-bold text-white font-mono truncate">
                {evaluation.timeToCrack}
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mb-1">
                <Shield className="w-3.5 h-3.5 text-indigo-400" /> Entropía estimada
              </div>
              <div className="text-xs sm:text-sm font-bold text-white font-mono">
                {evaluation.entropyBits} bits
              </div>
            </div>
          </div>

          {/* Advertencias (Solo si existen) */}
          {evaluation.warnings.length > 0 && (
            <div className="mb-5 p-3 bg-rose-950/30 border border-rose-800/40 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-rose-300 font-semibold text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Alertas
              </div>
              <ul className="space-y-0.5">
                {evaluation.warnings.map((warn, idx) => (
                  <li key={idx} className="text-xs text-rose-200/90 flex items-start gap-1.5">
                    <span className="text-rose-400">•</span>
                    <span>{warn}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Checklist de Requisitos */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
              <span>Criterios de Seguridad pauKey</span>
              <span className="font-mono text-slate-500">
                {Object.values(evaluation.checklist).filter(Boolean).length} / 7
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <ChecklistItem fulfilled={evaluation.checklist.length} label="Mínimo 12 caracteres" badge={`${password.length} car.`} />
              <ChecklistItem fulfilled={evaluation.checklist.uppercase} label="Mayúsculas (A-Z)" />
              <ChecklistItem fulfilled={evaluation.checklist.lowercase} label="Minúsculas (a-z)" />
              <ChecklistItem fulfilled={evaluation.checklist.number} label="Números (0-9)" />
              <ChecklistItem fulfilled={evaluation.checklist.symbol} label="Símbolos (!@#$...)" />
              <ChecklistItem fulfilled={evaluation.checklist.noCommonWords} label="Sin palabras comunes" />
              <ChecklistItem fulfilled={evaluation.checklist.noSequencesOrDates} label="Sin secuencias o años" />
            </div>
          </div>

        </section>


        {/* ========================================================= */}
        {/* GENERADOR DE SUGERENCIAS                                  */}
        {/* ========================================================= */}
        <section className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Sugerencias pauKey</h2>
              </div>
            </div>

            {/* Input palabra clave */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 mb-4">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Palabra clave base
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={seedWord}
                  onChange={handleSeedChange}
                  placeholder="Ej: pauKey, Perro..."
                  className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-lg text-white font-mono text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={generateRandomSeed}
                  title="Cambiar semilla"
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-xs flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Aleatorio</span>
                </button>
              </div>
            </div>

            {/* 3 Sugerencias directas */}
            <div className="space-y-3">
              {suggestions.map((sug) => (
                <div 
                  key={sug.id}
                  className="bg-slate-950 border border-slate-800/90 rounded-xl p-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>{sug.title}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 mb-2 font-mono text-xs sm:text-sm font-semibold text-emerald-400 break-all select-all">
                    <span>{sug.password}</span>
                    <button
                      onClick={() => copyToClipboard(sug.password, sug.id)}
                      className="p-1 text-slate-400 hover:text-emerald-400 rounded transition-colors shrink-0"
                      title="Copiar"
                    >
                      {copiedId === sug.id ? (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-sans font-bold">
                          <CheckCheck className="w-3.5 h-3.5" /> ¡Copiado!
                        </span>
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleUseSuggestion(sug.password)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors"
                    >
                      Probar <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleRegenerateSuggestions()}
            className="w-full mt-4 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-700/60"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Regenerar Alternativas</span>
          </button>
        </section>

      </div>


      {/* ------------------------------------------------------------- */}
      {/* CONSEJOS RÁPIDOS (MINIMALISTA)                                 */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Key className="w-4 h-4 text-cyan-400" /> Buenas Prácticas pauKey
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
            <span className="font-bold text-white block mb-0.5">1. Contraseñas Únicas</span>
            <span className="text-slate-400 leading-snug">No reutilices claves para evitar robo masivo.</span>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
            <span className="font-bold text-white block mb-0.5">2. Rotación Regular</span>
            <span className="text-slate-400 leading-snug">Renueva tus claves críticas cada 3-6 meses.</span>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
            <span className="font-bold text-white block mb-0.5">3. Gestor de Contraseñas</span>
            <span className="text-slate-400 leading-snug">Usa Bitwarden, 1Password, LastPass o KeePass.</span>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
            <span className="font-bold text-white block mb-0.5">4. Activa 2FA</span>
            <span className="text-slate-400 leading-snug">Añade segundo factor con Authenticator o YubiKey.</span>
          </div>
        </div>
      </section>


      {/* ------------------------------------------------------------- */}
      {/* FOOTER DE PRIVACIDAD                                          */}
      {/* ------------------------------------------------------------- */}
      <footer className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>🔒 <strong>Privacidad pauKey:</strong> Análisis y generación 100% en tu navegador. Tus datos nunca salen del cliente.</span>
      </footer>

    </div>
  );
}

function ChecklistItem({ fulfilled, label, badge }) {
  return (
    <div className={`p-2 rounded-lg border flex items-center justify-between ${
      fulfilled 
        ? 'bg-slate-950 border-emerald-900/50 text-emerald-300' 
        : 'bg-slate-950/50 border-slate-800/60 text-slate-500'
    }`}>
      <div className="flex items-center gap-2 min-w-0">
        {fulfilled ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        ) : (
          <XCircle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        )}
        <span className={`truncate ${fulfilled ? 'text-slate-200' : 'text-slate-400'}`}>
          {label}
        </span>
      </div>
      {badge && (
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
          fulfilled ? 'bg-emerald-950 border-emerald-800 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'
        }`}>
          {badge}
        </span>
      )}
    </div>
  );
}
