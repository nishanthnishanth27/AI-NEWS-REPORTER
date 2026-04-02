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

// 10. DAILYMOTION SHORTS LOGIC (Replaces YouTube)
function openShorts() {
    document.getElementById('videoOverlay').classList.remove('hidden');
    document.getElementById('videoOverlay').classList.add('flex');
    if (window.innerWidth < 1024) toggleSidebar(); 
    loadDailyMotionShorts();
}

function closeShorts() {
    const overlay = document.getElementById('videoOverlay');
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
    document.getElementById('videoContainer').innerHTML = ''; 
}

async function loadDailyMotionShorts() {
    const container = document.getElementById('videoContainer');
    container.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center animate-pulse">
            <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-blue-500 font-black text-[10px] uppercase tracking-widest text-center">📡 AI Fetching Dailymotion Reels...</p>
        </div>`;
    
    const query = currentLang === 'ta' ? 'Tamil News' : 'Global News';

    try {
        // Dailymotion API - No Key Needed & No Daily Limits
        const url = `https://api.dailymotion.com/videos?fields=id,title,owner.screenname&search=${encodeURIComponent(query)}&limit=8&flags=no_live`;
        
        const response = await fetch(url);
        const data = await response.json();

        container.innerHTML = '';

        if (data.list && data.list.length > 0) {
            data.list.forEach(video => {
                const card = document.createElement('div');
                card.className = 'video-card flex flex-col justify-end relative h-screen w-full bg-black shrink-0';
                
                card.innerHTML = `
                    <iframe 
                        src="https://www.dailymotion.com/embed/video/${video.id}?autoplay=1&mute=1&controls=0&sharing-enable=false&queue-enable=false" 
                        class="absolute inset-0 w-full h-full border-none" 
                        allow="autoplay; fullscreen">
                    </iframe>
                    <div class="relative p-8 bg-gradient-to-t from-black via-black/60 to-transparent pb-32">
                        <h3 class="text-white text-sm font-bold leading-tight line-clamp-2">${video.title}</h3>
                        <p class="text-blue-400 text-[8px] mt-2 font-black uppercase tracking-widest">Source: ${video['owner.screenname']} | AI Reporter</p>
                    </div>`;
                container.appendChild(card);
            });
        } else {
            container.innerHTML = '<div class="h-full flex items-center justify-center text-red-500 font-bold uppercase text-[10px]">No Videos Found.</div>';
        }
    } catch (e) {
        container.innerHTML = '<div class="h-full flex items-center justify-center text-red-500 font-bold uppercase text-[10px]">Network Error.</div>';
    }
}

// 3. Fetch News Function (Standard RSS)
async function FetchNews(forcedQuery) {
    let query = forcedQuery || document.getElementById('searchInput').value || 'Technology';
    const grid = document.getElementById('newsGrid');

    grid.innerHTML = `<div class="col-span-full text-center py-20"><div class="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-6"></div><p class="text-blue-500 font-black animate-pulse uppercase tracking-[0.3em] text-[10px]">📡 AI Searching News: ${query}</p></div>`;

    try {
        const ts = new Date().getTime();
        const hl = currentLang === 'ta' ? 'ta-IN' : 'en-IN';
        const ceid = currentLang === 'ta' ? 'IN:ta' : 'US:en';

        let rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${hl}&gl=IN&ceid=${ceid}&v=${ts}`;
        const rssToJson = "https://api.rss2json.com/v1/api.json?rss_url=";
        
        const response = await fetch(`${rssToJson}${encodeURIComponent(rssUrl)}`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            displayNews(data.items.slice(0, 15));
        } else {
            grid.innerHTML = `<p class="col-span-full text-center py-20 text-gray-500 uppercase font-bold text-xs">No updates found.</p>`;
        }
    } catch (e) {
        grid.innerHTML = `<p class="col-span-full text-center text-red-500 py-20 font-bold uppercase text-[10px]">Connection Error.</p>`;
    }
}

// 4. Display News Cards
function displayNews(articles) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = ''; 

    articles.forEach((article) => {
        const safeTitle = article.title.replace(/'/g, "").replace(/"/g, "");
        const imageUrl = `https://loremflickr.com/400/250/technology,robot?lock=${Math.floor(Math.random() * 9999)}`;

        grid.innerHTML += `
            <div class="bg-[#0a0a0a] border border-gray-900 p-5 rounded-[32px] hover:border-blue-600/40 transition-all flex flex-col group shadow-xl">
                <div class="overflow-hidden rounded-2xl mb-4 relative">
                    <img src="${imageUrl}" class="w-full h-44 object-cover grayscale-[30%] group-hover:grayscale-0 transition-transform duration-500 group-hover:scale-110" onerror="this.src='https://raw.githubusercontent.com/NishanthKn12/AI-NEWS-REPORTER/main/logo.png'">
                    <div class="absolute top-3 left-3 bg-blue-600 text-[8px] font-black px-2 py-1 rounded-md uppercase shadow-lg">Live Feed</div>
                </div>
                <h3 class="font-bold text-sm mb-5 line-clamp-2 text-gray-100 group-hover:text-white leading-relaxed">${article.title}</h3>
                <div class="flex justify-between items-center mb-5 text-[9px] font-black uppercase tracking-widest">
                    <a href="${article.link}" target="_blank" class="text-blue-500 hover:text-blue-300">View Source <i class="fas fa-external-link-alt"></i></a>
                    <button onclick="window.open('https://wa.me/?text=${encodeURIComponent(article.link)}')" class="text-green-500">Share <i class="fab fa-whatsapp"></i></button>
                </div>
                <button onclick="getAiSummary(this, '${safeTitle}')" class="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl text-[9px] font-black tracking-[0.2em] transition-all shadow-lg shadow-blue-900/30">✨ GET AI TAMIL SUMMARY</button>
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
            body: JSON.stringify({ contents: [{ parts: [{ text: `Summarize this in 2 short lines in Tamil: "${title}"` }] }] })
        });
        const data = await response.json();
        const summary = data.candidates[0].content.parts[0].text;
        
        const speech = new SpeechSynthesisUtterance(summary);
        speech.lang = 'ta-IN';
        window.speechSynthesis.speak(speech);
        alert(`🚀 AI NEWS REPORT:\n\n${summary}`);
    } catch (e) { 
        alert("AI is busy. Try again later."); 
    } finally { 
        button.innerHTML = originalText; 
        button.disabled = false; 
    }
}

// 6. Voice Search
function startVoiceSearch() {
    const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
    recognition.lang = currentLang === 'ta' ? 'ta-IN' : 'en-IN';
    recognition.onstart = () => document.getElementById('micBtn').innerHTML = '<i class="fas fa-microphone text-red-600 animate-pulse"></i>';
    recognition.onresult = (e) => {
        const text = e.results[0][0].transcript;
        document.getElementById('searchInput').value = text;
        FetchNews(text);
    };
    recognition.onend = () => document.getElementById('micBtn').innerHTML = '<i class="fas fa-microphone"></i>';
    recognition.start();
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
    alert(`🤖 AI NEWS REPORTER v2.4\nDeveloped by: Nishanth KN\nUsing: Dailymotion & Gemini AI`);
}
