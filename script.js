const GEMINI_API_KEY = 'AlzaSyCTheqaqkuuScbCqPpiyakl5NA1ZRuRRk';
let currentLang = 'en';

// =============================================
// TAMIL VIDEO NEWS DATA
// (YouTube Video ID மட்டும் மாற்றினால் போதும்)
// =============================================
const TAMIL_VIDEOS = [
    {
        id: 'JkaxUblCGz0',
        title: 'இன்றைய முக்கிய செய்திகள் | Today Top News Tamil',
        channel: 'Sun News',
        category: 'breaking',
        duration: '6:42'
    },
    {
        id: 'tgbNymZ7vqY',
        title: 'தமிழக அரசியல் செய்திகள் | Tamil Nadu Politics Update',
        channel: 'Thanthi TV',
        category: 'politics',
        duration: '9:15'
    },
    {
        id: 'ysz5S6PUM-M',
        title: 'விளையாட்டு செய்திகள் | Sports News Tamil Today',
        channel: 'Puthiya Thalaimurai',
        category: 'sports',
        duration: '4:30'
    },
    {
        id: 'dQw4w9WgXcQ',
        title: 'சினிமா செய்திகள் | Cinema News Tamil Latest',
        channel: 'Polimer News',
        category: 'cinema',
        duration: '7:20'
    },
    {
        id: 'oHg5SJYRHA0',
        title: 'தொழில்நுட்ப செய்திகள் | Tech News Tamil',
        channel: 'News 18 Tamil',
        category: 'tech',
        duration: '5:55'
    },
    {
        id: 'ZZ5LpwO-An4',
        title: 'சர்வதேச செய்திகள் | World News Tamil',
        channel: 'Kalaignar TV',
        category: 'breaking',
        duration: '8:10'
    }
];

// =============================================
// 1. Sidebar Control
// =============================================
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

// =============================================
// 2. Language Switcher
// =============================================
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

// =============================================
// 3. Fetch News
// =============================================
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

// =============================================
// 4. Display News Cards
// =============================================
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

// =============================================
// 5. Gemini AI Summary
// =============================================
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

// =============================================
// 6. Voice Search
// =============================================
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

// =============================================
// 7. Category Filter
// =============================================
function FetchByCategory(category) {
    document.getElementById('searchInput').value = category;
    FetchNews(category);
}

// =============================================
// 8. ✅ TAMIL VIDEO NEWS FUNCTIONS
// =============================================

// Video Section Render பண்ணு
function renderVideoSection() {
    // Check if video section already exists
    if (document.getElementById('tamilVideoSection')) return;

    const videoSection = document.createElement('div');
    videoSection.id = 'tamilVideoSection';
    videoSection.innerHTML = `
        <style>
            #tamilVideoSection {
                padding: 0 16px 24px;
                margin-top: 10px;
            }
            .video-section-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 14px;
                flex-wrap: wrap;
                gap: 8px;
            }
            .video-section-title {
                color: #fff;
                font-size: 0.75rem;
                font-weight: 900;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .live-pulse {
                width: 8px;
                height: 8px;
                background: #ef4444;
                border-radius: 50%;
                animation: livePulse 1.2s infinite;
                display: inline-block;
            }
            @keyframes livePulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.4; transform: scale(1.4); }
            }
            .video-filter-tabs {
                display: flex;
                gap: 6px;
                flex-wrap: wrap;
                margin-bottom: 14px;
            }
            .vid-tab {
                background: #111;
                color: #666;
                border: 1px solid #222;
                padding: 6px 14px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.65rem;
                font-weight: 900;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                transition: all 0.25s;
                font-family: inherit;
            }
            .vid-tab.active, .vid-tab:hover {
                background: #2563eb;
                color: #fff;
                border-color: #2563eb;
            }
            .video-scroll-wrap {
                display: flex;
                gap: 14px;
                overflow-x: auto;
                padding-bottom: 10px;
                scroll-snap-type: x mandatory;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none;
            }
            .video-scroll-wrap::-webkit-scrollbar { display: none; }
            .vid-card {
                min-width: 220px;
                max-width: 220px;
                background: #0a0a0a;
                border: 1px solid #1a1a1a;
                border-radius: 20px;
                overflow: hidden;
                flex-shrink: 0;
                scroll-snap-align: start;
                transition: border-color 0.3s, transform 0.3s;
                cursor: pointer;
            }
            .vid-card:hover {
                border-color: rgba(37,99,235,0.5);
                transform: translateY(-3px);
            }
            .vid-thumb {
                position: relative;
                overflow: hidden;
            }
            .vid-thumb img {
                width: 100%;
                height: 125px;
                object-fit: cover;
                display: block;
                transition: transform 0.4s;
            }
            .vid-card:hover .vid-thumb img {
                transform: scale(1.07);
            }
            .vid-play-btn {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 40px;
                height: 40px;
                background: rgba(37,99,235,0.85);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.9rem;
                color: #fff;
                opacity: 0;
                transition: opacity 0.3s;
                backdrop-filter: blur(4px);
            }
            .vid-card:hover .vid-play-btn { opacity: 1; }
            .vid-duration {
                position: absolute;
                bottom: 6px;
                right: 6px;
                background: rgba(0,0,0,0.85);
                color: #fff;
                font-size: 0.6rem;
                font-weight: 800;
                padding: 2px 6px;
                border-radius: 5px;
            }
            .vid-info {
                padding: 10px 12px 12px;
            }
            .vid-title {
                color: #e5e7eb;
                font-size: 0.72rem;
                font-weight: 700;
                line-height: 1.4;
                margin-bottom: 6px;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            .vid-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .vid-channel {
                color: #2563eb;
                font-size: 0.6rem;
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: 0.08em;
            }
            .vid-share-btn {
                background: none;
                border: none;
                color: #22c55e;
                font-size: 0.75rem;
                cursor: pointer;
                padding: 2px 4px;
                transition: transform 0.2s;
            }
            .vid-share-btn:hover { transform: scale(1.2); }

            /* Modal */
            #vidModal {
                display: none;
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: rgba(0,0,0,0.92);
                z-index: 99999;
                align-items: center;
                justify-content: center;
                padding: 16px;
                box-sizing: border-box;
            }
            #vidModal.open { display: flex; }
            .vid-modal-box {
                width: 100%;
                max-width: 720px;
                background: #0a0a0a;
                border-radius: 20px;
                overflow: hidden;
                border: 1px solid #1e3a8a;
                position: relative;
            }
            .vid-modal-close {
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 10;
                background: #ef4444;
                border: none;
                color: #fff;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                font-size: 0.8rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #vidFrame {
                width: 100%;
                aspect-ratio: 16/9;
                border: none;
                display: block;
            }
            .vid-modal-info {
                padding: 12px 16px;
            }
            .vid-modal-title {
                color: #fff;
                font-size: 0.8rem;
                font-weight: 700;
                margin-bottom: 4px;
            }
            .vid-modal-channel {
                color: #2563eb;
                font-size: 0.65rem;
                font-weight: 900;
                text-transform: uppercase;
            }

            /* Hidden class */
            .vid-card.vid-hidden { display: none !important; }
        </style>

        <!-- Video Section Header -->
        <div class="video-section-header">
            <div class="video-section-title">
                <span class="live-pulse"></span>
                📺 தமிழ் வீடியோ செய்திகள்
            </div>
        </div>

        <!-- Filter Tabs -->
        <div class="video-filter-tabs">
            <button class="vid-tab active" onclick="filterVidTab(this, 'all')">அனைத்தும்</button>
            <button class="vid-tab" onclick="filterVidTab(this, 'breaking')">Breaking</button>
            <button class="vid-tab" onclick="filterVidTab(this, 'politics')">அரசியல்</button>
            <button class="vid-tab" onclick="filterVidTab(this, 'sports')">விளையாட்டு</button>
            <button class="vid-tab" onclick="filterVidTab(this, 'cinema')">சினிமா</button>
            <button class="vid-tab" onclick="filterVidTab(this, 'tech')">Tech</button>
        </div>

        <!-- Video Cards Horizontal Scroll -->
        <div class="video-scroll-wrap" id="videoScrollWrap">
            ${TAMIL_VIDEOS.map(v => `
                <div class="vid-card" data-cat="${v.category}" onclick="openVidModal('${v.id}', '${v.title.replace(/'/g, '')}', '${v.channel}')">
                    <div class="vid-thumb">
                        <img src="https://img.youtube.com/vi/${v.id}/mqdefault.jpg"
                             onerror="this.src='https://raw.githubusercontent.com/NishanthKn12/AI-NEWS-REPORTER/main/logo.png'"
                             alt="${v.title}">
                        <div class="vid-play-btn">▶</div>
                        <span class="vid-duration">${v.duration}</span>
                    </div>
                    <div class="vid-info">
                        <p class="vid-title">${v.title}</p>
                        <div
