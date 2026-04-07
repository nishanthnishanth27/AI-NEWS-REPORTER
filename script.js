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
            grid.innerHTML = `<p class="col-span-full text-center py-20 text-gray-500 uppercase font-bold text-xs">No updates found for "${query}" in ${currentLang === 'ta' ? 'Tamil' : 'English'}</p>`;
        }
    } catch (e) {
        grid.innerHTML = `<p class="col-span-full text-center text-red-500 py-20 font-bold uppercase text-[10px]">Connection Error. Please check your network.</p>`;
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
                    <img src="${imageUrl}" class="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0" 
                         onerror="this.src='https://raw.githubusercontent.com/NishanthKn12/AI-NEWS-REPORTER/main/logo.png'">
                    <div class="absolute top-3 left-3 bg-blue-600 text-[8px] font-black px-2 py-1 rounded-md shadow-lg uppercase">Live Feed</div>
                </div>
                
                <div class="text-[9px] text-gray-500 font-bold mb-3 uppercase tracking-wider flex items-center gap-2">
                    <i class="far fa-calendar-alt text-blue-500"></i> ${dateStr}  |  <i class="far fa-clock text-blue-500"></i> ${timeStr}
                </div>

                <h3 class="font-bold text-sm mb-5 line-clamp-2 text-gray-100 group-hover:text-white leading-relaxed">${article.title}</h3>
                
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
        alert("AI is busy or API limit reached. Try again later."); 
    } finally { 
        button.innerHTML = originalText; 
        button.disabled = false; 
    }
}

// 6. Voice Search
function startVoiceSearch() {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) return alert("Your browser doesn't support Voice Search!");
    
    const rec = new SpeechRecognition();
    rec.lang = currentLang === 'ta' ? 'ta-IN' : 'en-IN';
    rec.onstart = () => {
        document.getElementById('micBtn').innerHTML = '<i class="fas fa-microphone text-red-600 animate-pulse"></i>';
    };
    rec.onresult = (e) => {
        const t = e.results[0][0].transcript;
        document.getElementById('searchInput').value = t;
        FetchNews(t);
    };
    rec.onend = () => {
        document.getElementById('micBtn').innerHTML = '<i class="fas fa-microphone"></i>';
    };
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
    const aboutText = `🤖 AI NEWS REPORTER v2.4\n\n` +
    `Developed by: Nishanth KN\n` +
    `Technology: Google Gemini 1.5 Flash AI\n\n` +
    `This app provides real-time news updates with AI-powered Tamil summaries. It uses advanced RSS syncing to fetch news from global and local sources instantly.`;
    
    alert(aboutText);
}

// ============================================================
// 10. TODAY'S NEWS VIDEOS — Daily Updated Tamil & English News
// ============================================================

// News video channels: Tamil & English with their YouTube channel IDs / live stream IDs
const NEWS_VIDEO_CHANNELS = [
    // TAMIL CHANNELS
    {
        lang: 'ta',
        label: 'Thanthi TV',
        flag: '🔴',
        type: 'live',
        // Thanthi TV Live
        embedUrl: 'https://www.youtube.com/embed/coYw-eVU0Ks?autoplay=1&mute=1',
    },
    {
        lang: 'ta',
        label: 'Puthiya Thalaimurai',
        flag: '🔴',
        type: 'live',
        embedUrl: 'https://www.youtube.com/embed/C3pCk6VHuRk?autoplay=1&mute=1',
    },
    {
        lang: 'ta',
        label: 'Sun News Live',
        flag: '🔴',
        type: 'live',
        embedUrl: 'https://www.youtube.com/embed/bPIHRiEBHuI?autoplay=1&mute=1',
    },
    {
        lang: 'ta',
        label: 'Raj News Tamil',
        flag: '🔴',
        type: 'live',
        embedUrl: 'https://www.youtube.com/embed/IXTiH6jY9N8?autoplay=1&mute=1',
    },
    {
        lang: 'ta',
        label: 'Kalaignar TV',
        flag: '🔴',
        type: 'live',
        embedUrl: 'https://www.youtube.com/embed/xWxkWRZnwKw?autoplay=1&mute=1',
    },
    // ENGLISH CHANNELS
    {
        lang: 'en',
        label: 'NDTV 24x7 Live',
        flag: '🔵',
        type: 'live',
        embedUrl: 'https://www.youtube.com/embed/Xord_OWZpi8?autoplay=1&mute=1',
    },
    {
        lang: 'en',
        label: 'Times Now Live',
        flag: '🔵',
        type: 'live',
        embedUrl: 'https://www.youtube.com/embed/bP5tSbVHwSQ?autoplay=1&mute=1',
    },
    {
        lang: 'en',
        label: 'Republic TV Live',
        flag: '🔵',
        type: 'live',
        embedUrl: 'https://www.youtube.com/embed/GbEMp5BRBHE?autoplay=1&mute=1',
    },
    {
        lang: 'en',
        label: 'India Today Live',
        flag: '🔵',
        type: 'live',
        embedUrl: 'https://www.youtube.com/embed/IGfp5rr64GE?autoplay=1&mute=1',
    },
    {
        lang: 'en',
        label: 'CNN-News18 Live',
        flag: '🔵',
        type: 'live',
        embedUrl: 'https://www.youtube.com/embed/MN8p-Vrn6G0?autoplay=1&mute=1',
    },
];

let videoLangFilter = 'ta'; // default to Tamil in video panel
let activeVideoIndex = 0;

function showVideoPanel() {
    // Close sidebar first
    toggleSidebar();

    // Remove existing modal if any
    const existing = document.getElementById('videoPanelModal');
    if (existing) existing.remove();

    // Build modal
    const modal = document.createElement('div');
    modal.id = 'videoPanelModal';
    modal.style.cssText = `
        position: fixed; inset: 0; z-index: 2000;
        background: #050505;
        display: flex; flex-direction: column;
        font-family: sans-serif;
        animation: fadeInModal 0.3s ease;
    `;

    modal.innerHTML = `
        <style>
            @keyframes fadeInModal { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
            .vchannel-btn { 
                background: #0a0a0a; border: 1px solid #1f1f1f; 
                color: #9ca3af; border-radius: 16px; padding: 10px 14px;
                font-size: 9px; font-weight: 900; letter-spacing: 0.15em;
                text-transform: uppercase; cursor: pointer; 
                display: flex; align-items: center; gap: 8px;
                transition: all 0.2s; white-space: nowrap;
                min-width: 130px;
            }
            .vchannel-btn:hover { border-color: #2563eb; color: #fff; }
            .vchannel-btn.active { background: #1d4ed8; border-color: #2563eb; color: #fff; }
            .lang-tab { 
                padding: 8px 20px; border-radius: 999px; font-size: 9px; 
                font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase;
                cursor: pointer; transition: all 0.2s; border: none;
            }
            .lang-tab.active { background: #2563eb; color: white; }
            .lang-tab.inactive { background: transparent; color: #6b7280; }
            #videoIframe { border: none; width: 100%; height: 100%; border-radius: 0; }
            .live-badge { 
                background: #dc2626; color: white; font-size: 8px; font-weight: 900;
                padding: 2px 7px; border-radius: 4px; letter-spacing: 0.1em;
                animation: pulse 1.5s infinite;
            }
            @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
            .channel-list { 
                display: flex; gap: 8px; padding: 12px 16px; 
                overflow-x: auto; flex-shrink: 0;
                scrollbar-width: none;
            }
            .channel-list::-webkit-scrollbar { display: none; }
        </style>

        <!-- Header -->
        <div style="background:#000; border-bottom:1px solid #111; padding:14px 16px; display:flex; align-items:center; justify-content:space-between; flex-shrink:0;">
            <div style="display:flex; align-items:center; gap:12px;">
                <span style="font-size:18px;">📺</span>
                <div>
                    <p style="font-size:11px; font-weight:900; color:#3b82f6; text-transform:uppercase; letter-spacing:0.15em; font-style:italic;">TODAY'S NEWS VIDEOS</p>
                    <p style="font-size:8px; color:#4b5563; font-weight:700; text-transform:uppercase; letter-spacing:0.2em; margin-top:2px;">LIVE 24/7 BROADCAST</p>
                </div>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
                <span class="live-badge">● LIVE</span>
                <button onclick="closeVideoPanel()" style="background:#111; border:none; color:#9ca3af; width:36px; height:36px; border-radius:10px; cursor:pointer; font-size:16px;">✕</button>
            </div>
        </div>

        <!-- Lang Tabs -->
        <div style="background:#000; padding:10px 16px; display:flex; gap:8px; flex-shrink:0; border-bottom:1px solid #0f0f0f;">
            <button class="lang-tab ${videoLangFilter === 'ta' ? 'active' : 'inactive'}" id="vLangTa" onclick="switchVideoLang('ta')">🇮🇳 Tamil</button>
            <button class="lang-tab ${videoLangFilter === 'en' ? 'active' : 'inactive'}" id="vLangEn" onclick="switchVideoLang('en')">🌐 English</button>
        </div>

        <!-- Channel Selector -->
        <div class="channel-list" id="channelList">
            ${renderChannelButtons()}
        </div>

        <!-- Video Player -->
        <div style="flex:1; background:#000; position:relative; min-height:0;">
            <iframe id="videoIframe"
                src="${getFilteredChannels()[0]?.embedUrl || ''}"
                allow="autoplay; encrypted-media; fullscreen"
                allowfullscreen>
            </iframe>
            <div style="position:absolute; bottom:12px; left:12px; background:rgba(0,0,0,0.7); backdrop-filter:blur(8px); border:1px solid #1f2937; border-radius:12px; padding:8px 14px;">
                <p style="font-size:9px; color:#6b7280; font-weight:700; text-transform:uppercase; letter-spacing:0.15em;">Now Playing</p>
                <p id="nowPlayingLabel" style="font-size:11px; font-weight:900; color:white; margin-top:2px;">${getFilteredChannels()[0]?.label || ''}</p>
            </div>
        </div>

        <!-- Bottom Info -->
        <div style="background:#000; border-top:1px solid #0f0f0f; padding:10px 16px; display:flex; align-items:center; justify-content:space-between; flex-shrink:0;">
            <p style="font-size:8px; color:#374151; font-weight:700; letter-spacing:0.2em; text-transform:uppercase;">Daily Updated • Tamil & English Channels</p>
            <p style="font-size:8px; color:#1d4ed8; font-weight:900; text-transform:uppercase; letter-spacing:0.15em;">AI NEWS REPORTER v2.4</p>
        </div>
    `;

    document.body.appendChild(modal);
    activeVideoIndex = 0;
}

function renderChannelButtons() {
    const channels = getFilteredChannels();
    return channels.map((ch, i) => `
        <button class="vchannel-btn ${i === activeVideoIndex ? 'active' : ''}" 
                id="vch_${i}" onclick="switchVideoChannel(${i})">
            <span>${ch.flag}</span>
            <span>${ch.label}</span>
        </button>
    `).join('');
}

function getFilteredChannels() {
    return NEWS_VIDEO_CHANNELS.filter(ch => ch.lang === videoLangFilter);
}

function switchVideoLang(lang) {
    videoLangFilter = lang;
    activeVideoIndex = 0;

    // Update tab styles
    document.getElementById('vLangTa').className = `lang-tab ${lang === 'ta' ? 'active' : 'inactive'}`;
    document.getElementById('vLangEn').className = `lang-tab ${lang === 'en' ? 'active' : 'inactive'}`;

    // Re-render channel buttons
    document.getElementById('channelList').innerHTML = renderChannelButtons();

    // Load first channel of new lang
    const channels = getFilteredChannels();
    if (channels.length > 0) {
        document.getElementById('videoIframe').src = channels[0].embedUrl;
        document.getElementById('nowPlayingLabel').textContent = channels[0].label;
    }
}

function switchVideoChannel(index) {
    activeVideoIndex = index;
    const channels = getFilteredChannels();
    const ch = channels[index];

    // Update iframe
    document.getElementById('videoIframe').src = ch.embedUrl;
    document.getElementById('nowPlayingLabel').textContent = ch.label;

    // Update button styles
    document.querySelectorAll('.vchannel-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
}

function closeVideoPanel() {
    // Stop video before closing to avoid audio continuation
    const iframe = document.getElementById('videoIframe');
    if (iframe) iframe.src = '';

    const modal = document.getElementById('videoPanelModal');
    if (modal) {
        modal.style.opacity = '0';
        modal.style.transform = 'translateY(20px)';
        modal.style.transition = 'all 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}
