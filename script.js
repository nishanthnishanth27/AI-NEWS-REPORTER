// AI NEWS REPORTER - ADVANCED SCRIPT (v3.0)
const GEMINI_API_KEY = 'AlzaSyCTheqaqkuuScbCqPpiyakl5NA1ZRuRRk';
let currentLang = 'ta'; // Default language set to Tamil as per your request

/**
 * 1. SIDEBAR NAVIGATION CONTROL
 */
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

/**
 * 2. LANGUAGE SWITCHER LOGIC
 */
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

/**
 * 3. FETCH NEWS FUNCTION (UNLIMITED & MULTI-LANGUAGE)
 */
async function FetchNews(forcedQuery) {
    let defaultTerm = currentLang === 'ta' ? 'முக்கிய செய்திகள்' : 'World News';
    let query = forcedQuery || document.getElementById('searchInput').value || defaultTerm;
    const grid = document.getElementById('newsGrid');

    // Loading State UI
    grid.innerHTML = `
        <div class="col-span-full text-center py-20">
            <div class="animate-spin inline-block w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full mb-6"></div>
            <p class="text-blue-500 font-black animate-pulse uppercase tracking-[0.2em] text-[12px]">
                ${currentLang === 'ta' ? 'செய்திகளைத் தேடுகிறது' : 'AI SEARCHING'}: ${query}
            </p>
        </div>`;

    try {
        const ts = new Date().getTime();
        
        // Accurate Google News RSS parameters for English and Tamil
        const hl = currentLang === 'ta' ? 'ta-IN' : 'en-IN';
        const gl = 'IN'; // Location fixed to India for better relevance
        const ceid = currentLang === 'ta' ? 'IN:ta' : 'IN:en';

        // RSS URL Construction
        let rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}&ceid=${ceid}`;

        // Fetching through RSS2JSON with count=50 (Unlimited feel)
        const rssToJson = "https://api.rss2json.com/v1/api.json?rss_url=";
        const response = await fetch(`${rssToJson}${encodeURIComponent(rssUrl)}&count=50&nocache=${ts}`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            // Sort by Date (Descending)
            data.items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
            displayNews(data.items);
        } else {
            grid.innerHTML = `<div class="col-span-full text-center py-20 text-gray-500 font-bold uppercase">No results found for "${query}"</div>`;
        }
    } catch (e) {
        grid.innerHTML = `<div class="col-span-full text-center py-20 text-red-500 font-bold">CONNECTION ERROR. PLEASE REFRESH.</div>`;
    }
}

/**
 * 4. DISPLAY NEWS CARDS
 */
function displayNews(articles) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = ''; 

    articles.forEach((article) => {
        // Cleaning title for Speech and Gemini
        const safeTitle = article.title.replace(/'/g, "").replace(/"/g, "").split(" - ")[0];
        const dateObj = new Date(article.pubDate);
        const dateStr = dateObj.toLocaleDateString(currentLang === 'ta' ? 'ta-IN' : 'en-US', { day: '2-digit', month: 'short' });
        const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // High-Quality Placeholder Images
        const imageUrl = `https://loremflickr.com/480/320/india,news,technology?lock=${Math.floor(Math.random() * 10000)}`;

        grid.innerHTML += `
            <div class="bg-[#0f0f0f] border border-gray-800 p-5 rounded-[32px] hover:border-blue-500/50 transition-all flex flex-col group shadow-2xl">
                <div class="overflow-hidden rounded-2xl mb-4 relative h-48">
                    <img src="${imageUrl}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                         onerror="this.src='https://raw.githubusercontent.com/NishanthKn12/AI-NEWS-REPORTER/main/logo.png'">
                    <div class="absolute top-3 left-3 bg-blue-600 text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">Live Feed</div>
                </div>
                
                <div class="text-[10px] text-gray-500 font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                    <i class="far fa-calendar-alt text-blue-500"></i> ${dateStr}  |  <i class="far fa-clock text-blue-500"></i> ${timeStr}
                </div>

                <h3 class="font-bold text-sm mb-5 line-clamp-3 text-gray-100 group-hover:text-white leading-relaxed h-[3.5rem] overflow-hidden">${article.title}</h3>
                
                <div class="flex justify-between items-center mb-6 text-[9px] font-black uppercase tracking-widest">
                    <a href="${article.link}" target="_blank" class="text-blue-500 hover:text-blue-300 flex items-center gap-1">
                        Source <i class="fas fa-external-link-alt"></i>
                    </a>
                    <button onclick="window.open('https://wa.me/?text=${encodeURIComponent(article.link)}')" class="text-green-500 flex items-center gap-1">
                        Share <i class="fab fa-whatsapp"></i>
                    </button>
                </div>

                <button onclick="getAiSummary(this, '${safeTitle}')" class="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl text-[9px] font-black tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-blue-900/40 text-white">
                    ✨ GET AI TAMIL SUMMARY
                </button>
            </div>`;
    });
}

/**
 * 5. GEMINI AI SUMMARY ENGINE
 */
async function getAiSummary(button, title) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-circle-notch animate-spin"></i> AI ANALYZING...';
    button.disabled = true;
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                contents: [{ 
                    parts: [{ text: `Provide a very short 2-line summary of this news title strictly in Tamil language: "${title}"` }] 
                }] 
            })
        });
        
        const data = await response.json();
        const summary = data.candidates[0].content.parts[0].text;
        
        // Tamil Voice Output
        const speech = new SpeechSynthesisUtterance(summary);
        speech.lang = 'ta-IN';
        speech.rate = 0.9;
        window.speechSynthesis.speak(speech);

        // UI Alert for Summary
        alert(`🚀 AI NEWS REPORT (TAMIL):\n\n${summary}`);

    } catch (e) { 
        alert("AI is temporarily unavailable or limit reached."); 
    } finally { 
        button.innerHTML = originalText; 
        button.disabled = false; 
    }
}

/**
 * 6. VOICE RECOGNITION SEARCH
 */
function startVoiceSearch() {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) return alert("Browser does not support voice search!");
    
    const rec = new SpeechRecognition();
    rec.lang = currentLang === 'ta' ? 'ta-IN' : 'en-IN';
    
    rec.onstart = () => {
        document.getElementById('micBtn').innerHTML = '<i class="fas fa-microphone text-red-600 animate-pulse"></i>';
    };
    
    rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        document.getElementById('searchInput').value = transcript;
        FetchNews(transcript);
    };
    
    rec.onend = () => {
        document.getElementById('micBtn').innerHTML = '<i class="fas fa-microphone"></i>';
    };
    
    rec.start();
}

/**
 * 7. CATEGORY FILTER
 */
function FetchByCategory(category) {
    document.getElementById('searchInput').value = category;
    FetchNews(category);
}

/**
 * 8. APP INITIALIZATION
 */
window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');
    setTimeout(() => {
        if(splash) {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
                FetchNews(); 
            }, 800);
        } else {
            FetchNews();
        }
    }, 2500);
});

/**
 * 9. ABOUT SECTION
 */
function showAbout() {
    const aboutText = `🤖 AI NEWS REPORTER v3.0\n\n` +
    `Developed by: Nishanth KN\n` +
    `AI: Gemini 1.5 Flash\n\n` +
    `Real-time unlimited Tamil & English news with AI voice summaries.`;
    alert(aboutText);
}
