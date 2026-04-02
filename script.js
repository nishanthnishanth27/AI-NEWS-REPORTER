// API KEYS
const GEMINI_API_KEY = 'AlzaSyCTheqaqkuuScbCqPpiyakl5NA1ZRuRRk';
const YOUTUBE_API_KEY = 'AlzaSyC9QEMnfzaFxEpZHUerKqwXHT'; 

let currentLang = 'en'; // Default language set to English

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

// --- NEW: AI SHORTS LOGIC START ---
function openShorts() {
    toggleSidebar(); // Sidebar-ஐ மூட
    const videoOverlay = document.getElementById('videoOverlay');
    videoOverlay.classList.remove('hidden');
    videoOverlay.classList.add('flex');
    document.body.style.overflow = 'hidden'; // Scroll-ஐ முடக்க
    loadYouTubeShorts();
}

function closeShorts() {
    document.getElementById('videoOverlay').classList.add('hidden');
    document.body.style.overflow = 'auto';
    document.getElementById('videoContainer').innerHTML = ''; // Memory மிச்சப்படுத்த
}

async function loadYouTubeShorts() {
    const container = document.getElementById('videoContainer');
    container.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center animate-pulse">
            <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-blue-500 font-black text-[10px] uppercase tracking-widest">📡 Syncing AI Reels...</p>
        </div>`;
    
    try {
        // YouTube API மூலம் தமிழ் செய்திகளைத் தேடுதல்
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=Tamil+News+Shorts+Today&type=video&videoDuration=short&relevanceLanguage=ta&key=${YOUTUBE_API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();

        container.innerHTML = '';

        if (data.items && data.items.length > 0) {
            data.items.forEach(item => {
                const videoId = item.id.videoId;
                const title = item.snippet.title;
                const card = document.createElement('div');
                card.className = 'video-card flex flex-col justify-end';
                
                card.innerHTML = `
                    <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0" 
                            class="absolute inset-0 w-full h-full border-none pointer-events-none" 
                            allow="autoplay; encrypted-media" allowfullscreen></iframe>
                    
                    <div class="relative p-8 bg-gradient-to-t from-black via-black/40 to-transparent pb-28">
                        <div class="flex items-center gap-2 mb-3">
                            <span class="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
                            <span class="text-[9px] font-black text-white uppercase tracking-widest">AI News Reel</span>
                        </div>
                        <h3 class="text-white text-sm font-bold mt-2 leading-tight drop-shadow-lg">${title}</h3>
                        <div class="flex items-center gap-2 mt-4">
                            <div class="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black">NK</div>
                            <p class="text-gray-400 text-[9px] font-black italic tracking-tighter">@NISHANTH_AI_REPORTER</p>
                        </div>
                    </div>`;
                container.appendChild(card);
            });
        } else {
            container.innerHTML = '<div class="h-full flex items-center justify-center text-red-500 font-bold uppercase text-xs">No Reels Found. Check API Quota.</div>';
        }
    } catch (e) {
        container.innerHTML = '<div class="h-full flex items-center justify-center text-red-500 font-bold uppercase text-xs">Connection Error.</div>';
    }
}
// --- NEW: AI SHORTS LOGIC END ---

// 2. Language Switcher Logic
function changeLanguage(lang) {
    currentLang = lang;
    const enBtn = document.getElementById('langEn');
    const taBtn = document.getElementById('langTa');
    
    if (lang === 'ta') {
        taBtn.classList.add('bg-blue-600', 'text-white');
        taBtn.classList.remove('text-gray-500');
        enBtn.classList.remove('bg-blue-600', 'text-white');
        enBtn.classList.add('text-gray-500');
    } else {
        enBtn.classList.add('bg-blue-600', 'text-white');
        enBtn.classList.remove('text-gray-500');
        taBtn.classList.remove('bg-blue-600', 'text-white');
        taBtn.classList.add('text-gray-500');
    }
    FetchNews(); 
}

// 3. Fetch News Function
async function FetchNews(forcedQuery) {
    let query = forcedQuery || document.getElementById('searchInput').value || 'Technology';
    const grid = document.getElementById('newsGrid');

    grid.innerHTML = `
        <div class="col-span-full text-center py-20">
            <div class="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-6"></div>
            <p class="text-blue-500 font-black animate-pulse uppercase tracking-[0.3em] text-[10px]">📡 AI Searching (${currentLang.toUpperCase()}): ${query}</p>
        </div>`;

    try {
        const ts = new Date().getTime();
        let rssUrl;
        const hl = currentLang === 'ta' ? 'ta-IN' : 'en-IN';
        const gl = currentLang === 'ta' ? 'IN' : 'US';
        const ceid = currentLang === 'ta' ? 'IN:ta' : 'US:en';

        if (query === 'Tamil Nadu' || query === 'Local') {
            rssUrl = `https://tamil.oneindia.com/rss/tamil-news-fb.xml`;
        } else {
            rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}&ceid=${ceid}&v=${ts}`;
        }

        const rssToJson = "https://api.rss2json.com/v1/api.json?rss_url=";
        const response = await fetch(`${rssToJson}${encodeURIComponent(rssUrl)}&nocache=${ts}`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            data.items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
            displayNews(data.items.slice(0, 15));
        } else {
            grid.innerHTML = `<p class="col-span-full text-center py-20 text-gray-500 uppercase font-bold text-xs">No updates found.</p>`;
        }
    } catch (e) {
        grid.innerHTML = `<p class="col-span-full text-center text-red-500 py-20 font-bold uppercase text-[10px]">Connection Error.</p>`;
    }
}

// 4. Display News in Cards
function displayNews(articles) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = ''; 

    articles.forEach((article) => {
        const safeTitle = article.title.replace(/'/g, "").replace(/"/g, "");
        const dateObj = new Date(article.pubDate);
        const dateStr = dateObj.toLocaleDateString([], { day: '2-digit', month: 'short' });
        const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const imageUrl = `https://loremflickr.com/400/250/technology,robot?lock=${Math.floor(Math.random() * 9999)}`;

        grid.innerHTML += `
            <div class="bg-[#0a0a0a] border border-gray-900 p-5 rounded-[32px] hover:border-blue-600/40 transition-all flex flex-col group shadow-xl">
                <div class="overflow-hidden rounded-2xl mb-4 relative">
                    <img src="${imageUrl}" class="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110 grayscale-[30%]" 
                         onerror="this.src='https://raw.githubusercontent.com/NishanthKn12/AI-NEWS-REPORTER/main/logo.png'">
                    <div class="absolute top-3 left-3 bg-blue-600 text-[8px] font-black px-2 py-1 rounded-md shadow-lg uppercase">Live Feed</div>
                </div>
                
                <div class="text-[9px] text-gray-500 font-bold mb-3 uppercase tracking-wider flex items-center gap-2">
                    <i class="far fa-calendar-alt text-blue-500"></i> ${dateStr} | <i class="far fa-clock text-blue-500"></i> ${timeStr}
                </div>

                <h3 class="font-bold text-sm mb-5 line-clamp-2 text-gray-100 leading-relaxed">${article.title}</h3>
                
                <div class="flex justify-between items-center mb-5 text-[9px] font-black uppercase tracking-widest">
                    <a href="${article.link}" target="_blank" class="text-blue-500 hover:text-blue-300 flex items-center gap-1">
                        View Source <i class="fas fa-external-link-alt text-[7px]"></i>
                    </a>
                    <button onclick="window.open('https://wa.me/?text=${encodeURIComponent(article.link)}')" class="text-green-500 flex items-center gap-1">
                        Share <i class="fab fa-whatsapp"></i>
                    </button>
                </div>

                <button onclick="getAiSummary(this, '${safeTitle}')" class="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl text-[9px] font-black tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-blue-900/30">
                    ✨ GET AI TAMIL SUMMARY
                </button>
            </div>`;
    });
}

// 5. Gemini AI Summary
async function getAiSummary(button, title) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-circle-notch animate-spin"></i> AI ANALYZING...';
    button.disabled = true;
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: `Summarize this news title in 2 short, simple lines in Tamil: "${title}"` }] }] })
        });
        const data = await response.json();
        const summary = data.candidates[0].content.parts[0].text;
        
        const speech = new SpeechSynthesisUtterance(summary);
        speech.lang = 'ta-IN';
        window.speechSynthesis.speak(speech);

        alert(`🚀 AI NEWS REPORT:\n\n${summary}`);

    } catch (e) { 
        alert("AI is busy or API limit reached."); 
    } finally { 
        button.innerHTML = originalText; 
        button.disabled = false; 
    }
}

// 6. Voice Search
function startVoiceSearch() {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) return alert("Browser not supported!");
    
    const rec = new SpeechRecognition();
    rec.lang = currentLang === 'ta' ? 'ta-IN' : 'en-IN';
    rec.onstart = () => document.getElementById('micBtn').innerHTML = '<i class="fas fa-microphone text-red-600 animate-pulse"></i>';
    rec.onresult = (e) => {
        const t = e.results[0][0].transcript;
        document.getElementById('searchInput').value = t;
        FetchNews(t);
    };
    rec.onend = () => document.getElementById('micBtn').innerHTML = '<i class="fas fa-microphone"></i>';
    rec.start();
}

// 7. Category Filter
function FetchByCategory(category) {
    document.getElementById('searchInput').value = category;
    FetchNews(category);
}

// 8. Initialization
window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');
    setTimeout(() => {
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            FetchNews(); 
        }, 800);
    }, 2500);
});

// 9. About App
function showAbout() {
    alert("🤖 AI NEWS REPORTER v2.4\nDeveloped by: Nishanth KN");
}
