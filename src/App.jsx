import React, { useEffect, useState, useRef } from "react";

// HigherLowerGame - Single-file React component (final clean version)
// Features:
// - Configurable API template and JSON dot-paths for value/name/image
// - Default imagePath = "avatar"
// - Click-to-guess (clickMode: "higher" or "lower")
// - No-repeat of strings (tracks remainingKeys)
// - Auto-advance on correct guess, game-over on wrong guess
// - Win when all strings are exhausted
// - Optional start-in-fullscreen checkbox (uses Fullscreen API)

// -----------------------------
// Helpers
// -----------------------------
// hi. Canyou ee the canvas1
function safeGet(obj, path) {
  if (!path) return null;
  if (obj === undefined || obj === null) return null;
  const parts = path.split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur === undefined || cur === null) return null;
    if (/^\d+$/.test(p)) {
      const idx = parseInt(p, 10);
      if (!Array.isArray(cur) || idx < 0 || idx >= cur.length) return null;
      cur = cur[idx];
    } else {
      cur = cur[p];
    }
  }
  return cur === undefined ? null : cur;
}



function pickRandom(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// -----------------------------
// Default config
// -----------------------------
const DEFAULT_CONFIG = {
  name: "My Higher-Lower Game",
  apiBase: "https://codeforces.com/api/user.info?handles={string}&checkHistoricHandles=true",
  valuePath: "friendOfCount",
  namePath: "handle",
  imagePath: "avatar",
  strings: [
    "MikeMirzayanov",
    "300iq",
    "rainboy",
    "bhatnagar.mradul",
    "ansh",
    "Timer_011",
    "white_walker",
    "tan_delhi",
    "Larryop",
    "aryan.gupta",
    "Shreyas_01",
    "amitj365",
    "PSYC0DE",
    "aryaaa14",
    "aryan01shrivastava",
    "naresh12",
    "Rajat_2203",
    "SJ26",
    "BBharambe",
    "C0ldSmi1e",
    "Robin_Raj6939",
    "Bro_Hit",
    "deVICe7772",
    "mhgishere",
    "ankushgarg_04",
    "swayampal82",
    "devansh070202",
    "iN_siDious",
    "tushar.bajaj",
    "puneet_tyagi",
    "yavtomar",
    "dharmik_dhamo",
    "kushalgupta87",
    "sahiljaveri",
    "rohannn",
    "cuzimcreep",
    "ayush_paine",
    "hrushi1093",
    "Shubham_sharma",
    "Rittin_Sehgal",
    "harsh09_11",
    "Pranav16",
    "Naman_Agarwal_03",
    "nakul_bhachawat",
    "siddhantkulkarni",
    "codingnoobie",
    "INFORTER",
    "rskbansal",
    "naman_mark",
    "riftk",
    "IshaanKapoor",
    "nirmalg",
    "srujal194",
    "vishesh011",
    "EmeraldBeast",
    "arnav_gupta",
    "Shanzz",
    "Radon23",
    "hridya_arora",
    "devarsh.dk",
    "Dominater069",
    "onkar_somani",
    "arin_nigam",
    "prakharg11",
    "mathmath33",
    "niranjanrajeev25",
    "Who",
    "w3bml",
    "shlokkzz",
    "martialgod",
    "ADITYA0603",
    "Shogo",
    "Ferrriccc",
    "weirdflexbutok",
    "vedantshete",
    "4jmodi",
    "coder_swapnil17",
    "SamarthNagpal",
    "velvet...thunder",
    "bagla",
    "adi0104",
    "priyansh.1",
    "GarvG2k4",
    "frost_14",
    "Who",
    "springg",
    "lithiumpilled",
    "desaitanish37",
    "niralii24",
    "alien_huntrr",
    "Pili_02",
    "Mitra100",
    "Aarc",
    "Aiyra_84",
    "AnirudhSharma007",
    "bushoukek",
    "ketav",
    "Who",
    "SunMoon97",
    "tarun_c007",
    "Mrcool7",
    "chromesabre",
    "ASH9374",
    "ItzManan",
    "mangla",
    "ParamPratap",
    "shiv.magic",
    "percyyyJ",
    "TudiWatts",
    "arjo2004",
    "vanshhero5",
    "Who",
    "Exyon75",
    "unbased",
    "ashh1215",
    "tamtu_comder",
    "pragati_iitk",
    "Eshan_Karia",
    "entropy_6174",
    "Chaotic_carni",
    "PRANIT_4166",
    "vidhi1610",
    "arjit_12",
    "shreyg",
    "Jinom",
    "jainam7",
    "Who",
    "locked_in_hell",
    "f20221122",
    "muskan05gupta",
    "DeepJ",
    "Raghav_Sakhuja",
    "bomgcoder",
    "Aashman",
    "reD_bUG",
    "Who",
    "Arul60",
    "sashakt1290",
    "chinmayrrr",
    "veiled_Sage",
    "VarshitG",
    "Amoghshyper",
    "Ineesh_reddy",
    "Riser5",
    "LASTCRY",
    "satvik04",
    "shreyas_11_05",
    "woyeta",
    "Ishan-Mehta",
    "Who",
    "div1345gupta",
    "Darelife",
    "tailor_dxb",
    "harshb",
    "Ununbased",
    "madhul27",
    "-pt",
    "Yashagarwal3004",
    "ThandaPrani",
    "LightHouse1",
    "barnav",
    "garam_icecream",
    "navneet2311",
    "MrBottleTree",
    "not_somosa",
    "riaaax",
    "Kriith",
    "abhik13",
    "aman1706",
    "bomgalt",
    "khushi_mishra",
    "Viyom10",
    "masteroojway",
    "Sankabapur",
    "kshav",
    "smits24",
    "mezzala",
    "basedunbased",
    "shreyg-upta",
    "Supersidd",
    "AdityABIRLA2005",
    "ajjagtap",
    "saltvik",
    "Rishitata",
    "EronAt",
    "TiwoeeM",
    "Yashas333",
    "shrey71"
],
  clickMode: "higher", // 'higher' or 'lower'
};

// -----------------------------
// Main component
// -----------------------------
export default function HigherLowerGame() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [A, setA] = useState(null);
  const [B, setB] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [history, setHistory] = useState([]);

  const [remainingKeys, setRemainingKeys] = useState([]);
  const [startFullscreen, setStartFullscreen] = useState(false);

  const configJsonRef = useRef(null);

  // fetch raw object for key using apiBase (replace {string})
  async function fetchRawObjectForKey(key) {
    const url = config.apiBase.replace("{string}", encodeURIComponent(key));
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const json = await res.json();
    if (Array.isArray(json.result)) return json.result[0];
    if (json && typeof json.result === "object" && json.result !== null) return json.result;
    return json;
  }

  async function fetchDataForString(key) {
    try {
      const obj = await fetchRawObjectForKey(key);
      const valueRaw = safeGet(obj, config.valuePath);
      const nameRaw = config.namePath ? safeGet(obj, config.namePath) : null;
      const imageRaw = config.imagePath ? safeGet(obj, config.imagePath) : null;
      const value = typeof valueRaw === "number" ? valueRaw : (valueRaw ? Number(valueRaw) : null);
      return {
        key,
        name: nameRaw || key,
        image: imageRaw || null,
        raw: obj,
        value: Number.isFinite(value) ? value : null,
      };
    } catch (e) {
      console.error("fetchDataForString error", e);
      return { key, name: key, image: null, raw: null, value: null, error: e?.message || String(e) };
    }
  }

  // initialize game
  async function startGame() {
    setMessage("");
    setHistory([]);
    setScore(0);
    setGameOver(false);
    setA(null);
    setB(null);

    const strings = (config.strings || []).map(s => String(s).trim()).filter(Boolean);
    if (strings.length < 2) {
      setMessage("Please provide at least two strings in the configuration.");
      return;
    }

    // fullscreen if requested (must be user gesture)
    if (startFullscreen) {
      try {
        const el = document.documentElement;
        if (el.requestFullscreen) await el.requestFullscreen();
      } catch (e) {
        console.warn("Fullscreen request failed:", e);
      }
    }

    setLoading(true);
    try {
      // Strict: find two distinct users with value > 75.
      // We'll iterate the shuffled list and fetch values until we find two that satisfy the condition.
      const s = shuffle(strings);
      const found = [];
      const usedKeys = new Set();

      for (let i = 0; i < s.length && found.length < 2; i++) {
        const key = s[i];
        if (usedKeys.has(key)) continue;
        usedKeys.add(key);
        const d = await fetchDataForString(key);
        if (d && d.value != null && typeof d.value === 'number' && d.value > 75) {
          found.push(d);
        }
      }

      if (found.length < 2) {
        // Not enough users >75 — fail and show error
        setMessage("Not enough users with value >75 to start the game. Please provide a list with at least two entries >75.");
        setLoading(false);
        setGameOver(true);
        return;
      }

      // Use first introduced = found[0], second = found[1]
      const d1 = found[0];
      const d2 = found[1];
      setA(d1);
      setB(d2);

      // remaining keys = all strings minus the ones we used/fetched so far
      const remaining = s.filter(k => !usedKeys.has(k));
      setRemainingKeys(remaining);
      setMessage("");
    } catch (e) {
      setMessage("Failed to start game: " + (e?.message || String(e)));
    } finally {
      setLoading(false);
    }
  }

  // handle clicking a competitor card
  async function handleCardClick(clicked) {
    if (!A || !B || gameOver) return;
    const aVal = A.value;
    const bVal = B.value;
    if (aVal == null || bVal == null) {
      setMessage("Can't determine winner — missing numeric values.");
      return;
    }

    const actualWinner = bVal >= aVal ? B : A; // higher is winner
    const actualLoser = actualWinner.key === A.key ? B : A;

    let clickedCountsAsCorrect = false;
    if (config.clickMode === "higher") clickedCountsAsCorrect = clicked.key === actualWinner.key;
    else if (config.clickMode === "lower") clickedCountsAsCorrect = clicked.key === actualLoser.key;
    else clickedCountsAsCorrect = clicked.key === actualWinner.key;

    // record history
    setHistory(h => [{ A, B, clicked, actualWinner, correct: clickedCountsAsCorrect }, ...h]);

    if (clickedCountsAsCorrect) {
      setScore(s => s + 1);
      setMessage("Correct! Advancing...");

      // remove clicked and also remove any duplicates from remainingKeys
      setRemainingKeys(prev => prev.filter(k => k !== clicked.key));

      // auto-advance after short delay
      setTimeout(() => nextRound(B), 550);
    } else {
      setGameOver(true);
      setMessage("Wrong — Game Over. Final Score: " + score);
    }
  }

  // choose next challenger from remainingKeys
  async function nextRound(prevIntroduced) {
    const prev = prevIntroduced || A || B;

    // if no remaining keys -> user won
    if (!remainingKeys || remainingKeys.length === 0) {
      setGameOver(true);
      setMessage("You won! Final Score: " + score);
      return;
    }

    setLoading(true);
    try {
      // Sample up to 10 random candidates from remainingKeys
      const sampleSize = Math.min(10, remainingKeys.length);
      const sampleKeys = shuffle(remainingKeys).slice(0, sampleSize);

      const datas = await Promise.all(sampleKeys.map(k => fetchDataForString(k)));
      const candidatesAll = datas.filter(d => d && !d.error);

      if (candidatesAll.length === 0) {
        // nothing usable — remove sampled keys and consider win
        setRemainingKeys(prev => prev.filter(k => !sampleKeys.includes(k)));
        setGameOver(true);
        setMessage("You won! Final Score: " + score);
        return;
      }

      // Keep only those with numeric values for ranking; allow others to be considered last
      const withValues = candidatesAll.filter(d => d.value != null);
      const withoutValues = candidatesAll.filter(d => d.value == null);

      // sort by closeness to prev.value (if prev.value available)
      const prevVal = typeof prev?.value === 'number' ? prev.value : 0;
      withValues.sort((a, b) => Math.abs(a.value - prevVal) - Math.abs(b.value - prevVal));

      const candidates = [...withValues, ...withoutValues];

      // build weights according to rank (up to 10)
      const weights = candidates.map((_, i) => {
        if (i === 0) return 70;
        if (i === 1) return 35;
        if (i === 2) return 15;
        if (i === 3) return 10;
        if (i === 4) return 10;
        // 6th-10th (i=5..9) -> 2% each
        return 2;
      }).slice(0, candidates.length);

      const total = weights.reduce((a, b) => a + b, 0);
      let chosen = null;
      if (total === 0) {
        chosen = pickRandom(candidates);
      } else {
        let r = Math.random() * 10000;
        console.log("total weight", total, "random r", r);
        for (let i = 0; i < candidates.length; i++) {
          
          // if(candidates[i].value > prev.value){
            r-=(candidates[i].value*2)+10;
          // }
          r -= weights[i];
          console.log("candidate is", candidates[i].value, "prev is", prev.value, "r is", r);
          if (r <= 0) { chosen = candidates[i]; break; }
          if(i==candidates.length-1){
          i=-1; r/=2;
        }
        }
        if (!chosen) chosen = candidates[candidates.length - 1];
        
      }

      // remove chosen from remainingKeys
      setRemainingKeys(prev => prev.filter(k => k !== chosen.key));

      // set next match: prev (last introduced) vs chosen (new challenger)
      setA(prev);
      setB(chosen);
      console.log(remainingKeys.length, "remaining keys after choosing", chosen.key);
      setMessage("");
    } catch (e) {
      setMessage("Failed to fetch next round: " + (e?.message || String(e)));
    } finally {
      setLoading(false);
    }
  }

  // UI helpers
  function updateConfigField(field, value) {
    setConfig(c => ({ ...c, [field]: value }));
  }

  function updateStringsFromTextarea(text) {
    const arr = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    updateConfigField("strings", arr);
  }

  function exportConfig() {
    return JSON.stringify(config, null, 2);
  }

  function copyConfigToClipboard() {
    try {
      navigator.clipboard.writeText(exportConfig());
      setMessage("Config copied to clipboard — share it with friends.");
    } catch (e) {
      setMessage("Failed to copy: " + (e?.message || String(e)));
    }
  }

  function loadConfigFromTextarea() {
    try {
      const parsed = JSON.parse(configJsonRef.current.value);
      setConfig(parsed);
      setMessage("Loaded config from JSON.");
    } catch (e) {
      setMessage("Invalid JSON: " + (e?.message || String(e)));
    }
  }

  useEffect(() => {
    if (configJsonRef.current) configJsonRef.current.value = exportConfig();
  }, [config]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Higher — Lower (Configurable API)</h1>
        <p className="text-sm text-gray-600 mt-1">Provide an API pattern and a list of strings. Share config with friends so they can play the same game.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <label className="block text-xs text-gray-600">Game name</label>
            <input value={config.name} onChange={e => updateConfigField("name", e.target.value)} className="w-full mt-1 p-2 border rounded" />

            <label className="block text-xs text-gray-600 mt-3">API base (use {`{string}`} where the string should be inserted)</label>
            <input value={config.apiBase} onChange={e => updateConfigField("apiBase", e.target.value)} className="w-full mt-1 p-2 border rounded" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
              <div>
                <label className="block text-xs text-gray-600">valuePath</label>
                <input value={config.valuePath || ""} onChange={e => updateConfigField("valuePath", e.target.value)} className="w-full mt-1 p-2 border rounded" />
                <p className="text-xs text-gray-500">Dot path to numeric value in API object for each string (required)</p>
              </div>
              <div>
                <label className="block text-xs text-gray-600">namePath</label>
                <input value={config.namePath || ""} onChange={e => updateConfigField("namePath", e.target.value)} className="w-full mt-1 p-2 border rounded" />
                <p className="text-xs text-gray-500">Optional: dot path for a display name</p>
              </div>
              <div>
                <label className="block text-xs text-gray-600">imagePath</label>
                <input value={config.imagePath || ""} onChange={e => updateConfigField("imagePath", e.target.value)} className="w-full mt-1 p-2 border rounded" />
                <p className="text-xs text-gray-500">Optional: dot path for an image URL</p>
              </div>
            </div>

          </div>

          <div className="p-4 border rounded-lg">
            <label className="block text-xs text-gray-600">Strings (one per line)</label>
            <textarea defaultValue={config.strings.join("\n")} onBlur={e => updateStringsFromTextarea(e.target.value)} className="w-full mt-1 p-2 border rounded h-40" />
            <p className="text-xs text-gray-500 mt-2">These strings will be substituted into the API endpoint — e.g. handles, usernames, product IDs.</p>
          </div>

          <div className="p-4 border rounded-lg">
            <label className="flex items-center gap-2 mb-2">
              <input type="checkbox" checked={startFullscreen} onChange={e => setStartFullscreen(e.target.checked)} />
              <span className="text-xs">Start game in fullscreen</span>
            </label>

            <div className="flex gap-2">
              <button className="px-4 py-2 bg-black text-white rounded" onClick={() => { try { document.documentElement.requestFullscreen(); } catch {} }}>Fullscreen</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={startGame} disabled={loading}>Start Game</button>
              <button className="px-4 py-2 border rounded" onClick={copyConfigToClipboard}>Copy Config JSON</button>
              <button className="px-4 py-2 border rounded" onClick={() => { setConfig(DEFAULT_CONFIG); setMessage("Reset to default config."); }}>Reset Default</button>
            </div>

            <div className="mt-3">
              <label className="text-xs block">Click mode</label>
              <select value={config.clickMode} onChange={e => updateConfigField("clickMode", e.target.value)} className="mt-1 p-2 border rounded w-full">
                <option value="higher">Click the higher</option>
                <option value="lower">Click the lower</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Change whether clicking selects the higher or the lower value as the correct answer.</p>
            </div>
          </div>

          <div className="p-4 border rounded">
            <label className="block text-xs text-gray-600">Share / Load Config JSON</label>
            <textarea ref={configJsonRef} defaultValue={exportConfig()} className="w-full mt-1 p-2 border rounded h-32" />
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1 border rounded" onClick={loadConfigFromTextarea}>Load from JSON</button>
              <button className="px-3 py-1 border rounded" onClick={() => { if (configJsonRef.current) configJsonRef.current.value = exportConfig(); setMessage("Updated JSON textarea from current config."); }}>Refresh JSON Textarea</button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Share the JSON with friends — they can paste it into this textarea and click "Load from JSON" to play the same game.</p>
          </div>

        </div>

        <div>
          <div className="p-4 border rounded-lg mb-4">
            <h2 className="font-medium">Choose the Higher Value</h2>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CompetitorCard label="A" competitor={A} onClick={handleCardClick} gameOver={gameOver} />
              <CompetitorCard label="B" competitor={B} onClick={handleCardClick} gameOver={gameOver} />
            </div>

           

            {loading && <p className="text-sm text-gray-600 mt-2">Loading...</p>}
            {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-medium">History</h3>
            <div className="mt-2 space-y-2 max-h-64 overflow-auto">
              {history.length === 0 && <p className="text-xs text-gray-500">No rounds yet.</p>}
              {history.map((h, idx) => (
                <div key={idx} className="p-2 border rounded">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-sm"><strong>{h.A.name}</strong> ({h.A.value ?? "—"}) vs <strong>{h.B.name}</strong> ({h.B.value ?? "—"})</div>
                      <div className="text-xs text-gray-600">You clicked: {h.clicked?.name} • Actual winner: {h.actualWinner.name} • {h.correct ? '✅' : '❌'}</div>
                    </div>
                    <div className="text-xs text-gray-400">{new Date().toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-6 text-xs text-gray-500">
        Tip: If you face CORS errors with an API, either enable CORS on the API server, or use a small proxy that adds CORS headers.
      </footer>
    </div>
  );
}

// Small presentational card for competitor
function CompetitorCard({ label, competitor, onClick, gameOver }) {
  if (!competitor) {
    return (
      <div className="p-3 border rounded h-36 flex items-center justify-center">
        <div className="text-center text-sm text-gray-500">{label}: No competitor</div>
      </div>
    );
  }

  return (
    <div onClick={() => onClick && onClick(competitor)} className="p-3 border rounded h-36 flex gap-3 items-center cursor-pointer hover:bg-gray-50">
      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
        {competitor.image ? (
          <img src={competitor.image} alt={competitor.name} className="object-cover w-full h-full" />
        ) : (
          <div className="text-xs text-gray-400">No image</div>
        )}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{competitor.name}</div>
        <div className="text-xs text-gray-500">key: {competitor.key}</div>
       
        {/* Value display rules */}
        {label === "A" && competitor.value != null && (
          <div className="text-xs text-gray-700">Value: {competitor.value}</div>
        )}
        {label === "B" && gameOver && competitor.value != null && (
          <div className="text-xs text-gray-700">Value: {competitor.value}</div>
        )}

        {competitor.error && <div className="text-xs text-red-500">Error: {competitor.error}</div>}
      </div>
    </div>
  );
}