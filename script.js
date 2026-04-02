const GEMINI_API_KEY = 'AlzaSyCTheqaqkuuScbCqPpiyakl5NA1ZRuRRk';
let currentLang = 'en';

// 1. Sidebar Control
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    if (sidebar.classList.contains('sidebar-closed')) {
        sidebar.classList.replace('sidebar-closed', 'sidebar-open');
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.add('opacity-100'), 10);
        document.body.style.overflow = 'hidden'; 
    } else {
        sidebar.classList.replace('sidebar-open', 'sidebar-closed');
        overlay.classList.remove('opacity-100');
        setTimeout(() => overlay.classList.add('hidden'), 300);
        document.body.style.overflow = 'auto'; 
    }
}

// 2. Language Switcher
function changeLanguage(lang) {
    currentLang = lang;
    const enBtn = document.getElementById('langEn');
    const taBtn = document.getElementById('langTa');
    
    if (lang === 'ta') {
        taBtn.className = 'flex-1 py-2 text-[9px] font-black rounded-lg transition-all bg-blue-600 text-white';
        enBtn.className = 'flex-1 py-2 text-[9px] font-black rounded-lg transition-all text-gray-500';
    } else {
        enBtn.className = 'flex-1 py-2 text-[9px] font-black rounded-lg transition-all bg-blue-600 text-white';
        taBtn.className = 'flex-1 py-2 text-[9px] font-black rounded-lg transition-all text-gray-500';
    }
    FetchNews();
}

// 3. AI Shorts Logic (New Feature)
function openShorts() {
    toggleSidebar(); // Close sidebar first
    const videoOverlay = document.getElementById('videoOverlay');
    const videoContainer = document.getElementById('videoContainer');
    videoOverlay.classList.remove('hidden');
    videoOverlay.classList.add('flex');
    document.body.style.overflow = 'hidden';
    
    loadShortsContent();
}

function closeShorts() {
    const videoOverlay = document.getElementById('videoOverlay');
    videoOverlay.classList.add('hidden');
    videoOverlay.classList.remove('flex');
    document.body.style.overflow = 'auto';
    document.getElementById('videoContainer').innerHTML = '';
}

async function loadShortsContent() {
    const container = document.getElementById('videoContainer');
    container.innerHTML = '<div class="h-full flex items-center justify-center animate-pulse uppercase font-black tracking-widest text-blue-500">📡 Streaming AI News Shorts...</div>';
    
    // Tamil News Channel Shorts Queries
    const newsQueries = ['TamilNewsShorts', 'PolimerNewsShorts', 'PuthiyathalaimuraiShorts', 'SunNewsShorts'];
    
    let html = '';
    for (let i = 0; i < 8; i++) {
        const query = newsQueries[i % newsQueries.length];
        html += `
            <div class="video-card flex flex-col justify-end">
                <iframe src="https://www.youtube.com/embed?listType=search&list=${query}&autoplay=0&mute=0&rel=0" allowfullscreen></iframe>
                <div class="absolute bottom-12 left-5 right-16 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-2xl pointer-events-none">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
                        <span class="text-[10px] font-black text-red-500 uppercase tracking-widest">Live News Reel</span>
                    </div>
                    <h3 class="text-white text-sm font-bold leading-tight">AI தொகுத்த இன்றைய முக்கிய செய்திகள் - நேரலை #0${i+1}</h3>
                    <p class="text-gray-400 text-[9px] mt-2 font-bold uppercase tracking-tighter italic">@Nishanth_AI_Reporter</p>
                </div>
            </div>`;
    }
    container.innerHTML = html;
}

// 4. Fetch News & Display (Existing functions optimized)
async function FetchNews(forcedQuery) {
    let query = forcedQuery || document.getElementById('searchInput').value || 'Technology';
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = `<div class="col-span-full text-center py-20"><div class="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-6"></div><p class="text-blue-500 font-black animate-pulse uppercase tracking-widest text-[10px]">📡 AI Searching: ${query}</p></div>`;

    try {
        const ts = new Date().getTime();
        const hl = currentLang === 'ta' ? 'ta-IN' : 'en-IN';
        const gl = currentLang === 'ta' ? 'IN' : 'US';
        const ceid = currentLang === 'ta' ? 'IN:ta' : 'US:en';
        
        let rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}&ceid=${ceid}&v=${ts}`;
        if (query === 'Local') rssUrl = `https://tamil.oneindia.com/rss/tamil-news-fb.xml`;

        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&nocache=${ts}`);
        const data = await response.json();

        grid.innerHTML = '';
        if (data.items && data.items.length > 0) {
            data.items.forEach(article => {
                const safeTitle = article.title.replace(/'/g, "").replace(/"/g, "");
                const img = `https://loremflickr.com/400/250/technology,news?lock=${Math.floor(Math.random() * 1000)}`;
                grid.innerHTML += `
                    <div class="bg-[#0a0a0a] border border-gray-900 p-5 rounded-[32px] hover:border-blue-600/40 transition-all flex flex-col group">
                        <div class="overflow-hidden rounded-2xl mb-4 relative h-44">
                            <img src="${img}" class="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-transform duration-700 group-hover:scale-110">
                            <div class="absolute top-3 left-3 bg-blue-600 text-[8px] font-black px-2 py-1 rounded shadow-lg">LIVE FEED</div>
                        </div>
                        <h3 class="font-bold text-sm mb-5 line-clamp-2 text-gray-100">${article.title}</h3>
                        <div class="flex justify-between items-center mb-5 text-[9px] font-black uppercase">
                            <a href="${article.link}" target="_blank" class="text-blue-500">View Source</a>
                            <button onclick="window.open('https://wa.me/?text=${encodeURIComponent(article.link)}')" class="text-green-500">Share <i class="fab fa-whatsapp"></i></button>
                        </div>
                        <button onclick="getAiSummary(this, '${safeTitle}')" class="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl text-[9px] font-black tracking-[0.2em] shadow-lg shadow-blue-900/30">✨ GET AI TAMIL SUMMARY</button>
                    </div>`;
            });
        }
    } catch (e) {
        grid.innerHTML = `<p class="col-span-full text-center text-red-500 py-20 font-bold uppercase text-[10px]">Connection Error.</p>`;
    }
}

async function getAiSummary(button, title) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-circle-notch animate-spin"></i> AI ANALYZING...';
    button.disabled = true;
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: `Summarize in 2 short lines in Tamil: "${title}"` }] }] })
        });
        const data = await response.json();
        const summary = data.candidates[0].content.parts[0].text;
        alert(`🚀 AI NEWS REPORT:\n\n${summary}`);
        const speech = new SpeechSynthesisUtterance(summary);
        speech.lang = 'ta-IN';
        window.speechSynthesis.speak(speech);
    } catch (e) { alert("API Error. Try later."); }
    finally { button.innerHTML = originalText; button.disabled = false; }
}

function startVoiceSearch() {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) return alert("Browser not supported!");
    const rec = new SpeechRecognition();
    rec.lang = currentLang === 'ta' ? 'ta-IN' : 'en-IN';
    rec.onstart = () => document.getElementById('micBtn').innerHTML = '<i class="fas fa-microphone text-red-600 animate-pulse"></i>';
    rec.onresult = (e) => { const t = e.results[0][0].transcript; document.getElementById('searchInput').value = t; FetchNews(t); };
    rec.onend = () => document.getElementById('micBtn').innerHTML = '<i class="fas fa-microphone"></i>';
    rec.start();
}

function FetchByCategory(category) {
    document.getElementById('searchInput').value = category;
    FetchNews(category);
}

window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('splash-screen').style.opacity = '0';
        setTimeout(() => { document.getElementById('splash-screen').style.display = 'none'; FetchNews(); }, 800);
    }, 2500);
});

function showAbout() {
    alert("🤖 AI NEWS REPORTER v2.4\nDeveloped by: Nishanth KN\nUsing: Gemini 1.5 Flash AI");
}
