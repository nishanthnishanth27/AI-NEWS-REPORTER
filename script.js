const GEMINI_API_KEY = 'AlzaSyCTheqaqkuuScbCqPpiyakl5NA1ZRuRRk';
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

// 2. Language Switcher Logic
function changeLanguage(lang) {
    currentLang = lang;
    
    // UI Feedback for Buttons
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

    FetchNews(); // Language மாற்றியவுடன் செய்திகளை புதுப்பிக்க
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

        // Language based parameters for Google News
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
