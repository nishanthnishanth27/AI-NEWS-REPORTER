const GEMINI_API_KEY = 'AIzaSyCThwqagkuuScbCqFphUyaAI5NA12RUrRk';

// 1. Function to Fetch and Mix News
async function FetchNews() {
    const inputField = document.getElementById('searchInput');
    const grid = document.getElementById('newsGrid');
    
    // User search panna query edukkum, illana default-ah 'AI Technology' search pannum
    const query = (inputField && inputField.value && inputField.value.trim() !== "") ? inputField.value : 'AI Technology';

    grid.innerHTML = '<p class="text-center col-span-full text-blue-400 animate-pulse font-mono">📡 SYNCING DUAL-LANGUAGE FEEDS...</p>';

    try {
        // RSS to JSON logic - Using two different feeds for English and Tamil
        const engRss = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
        const tamRss = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ta-IN&gl=IN&ceid=IN:ta`;

        const rssToJsonBase = `https://api.rss2json.com/v1/api.json?rss_url=`;

        // Don't wait one by one, fetch both together
        const [engRes, tamRes] = await Promise.all([
            fetch(rssToJsonBase + encodeURIComponent(engRss)),
            fetch(rssToJsonBase + encodeURIComponent(tamRss))
        ]);

        const engData = await engRes.json();
        const tamData = await tamRes.json();

        // MIXING LOGIC: 5 Tamil + 5 English = 10 Mixed News
        let mixedNews = [];
        const engItems = engData.items || [];
        const tamItems = tamData.items || [];

        for(let i = 0; i < 6; i++) {
            if (tamItems[i]) mixedNews.push(tamItems[i]);
            if (engItems[i]) mixedNews.push(engItems[i]);
        }

        if (mixedNews.length > 0) {
            displayNews(mixedNews);
        } else {
            grid.innerHTML = '<p class="text-yellow-500 text-center col-span-full font-mono">No data found for this search. Try "Technology".</p>';
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        grid.innerHTML = '<p class="text-red-500 text-center col-span-full font-mono">⚠️ CONNECTION ERROR. CHECK INTERNET.</p>';
    }
}

// 2. Function to Render Cards
function displayNews(articles) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';

    articles.forEach((article, index) => {
        const title = article.title;
        const link = article.link;
        const safeTitle = title.replace(/[^a-zA-Z0-9 ]/g, " ");
        
        // Random tech image generator based on search keywords
        const imageUrl = `https://loremflickr.com/400/250/technology,robot?lock=${index + Math.random()}`;

        const card = `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-3xl hover:border-blue-500 transition-all duration-300 shadow-2xl flex flex-col h-full">
                <div class="relative overflow-hidden rounded-2xl mb-4 bg-gray-800 h-44">
                    <img src="${imageUrl}" class="w-full h-full object-cover" alt="News Image">
                </div>
                <h3 class="font-bold text-[14px] mb-4 text-white leading-tight flex-grow">${title}</h3>
                <div class="mt-auto pt-4 border-t border-gray-800 flex flex-col gap-3">
                    <div class="flex justify-between items-center px-1">
                        <a href="${link}" target="_blank" class="text-blue-400 text-[10px] font-black uppercase tracking-widest hover:underline">Read Source</a>
                        <button onclick="shareNews('${safeTitle}', '${link}')" class="text-green-500 text-[10px] font-bold">WhatsApp</button>
                    </div>
                    <button onclick="getAISummary(this, '${safeTitle}')" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                        ✨ GET TAMIL AI SUMMARY
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

// 3. Gemini AI Tamil Summary
async function getAISummary(button, cleanTitle) {
    const originalText = button.innerText;
    button.innerText = "🤖 THINKING...";
    button.disabled = true;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Explain this news in exactly 2 simple lines in Tamil language: " + cleanTitle }] }]
            })
        });

        const data = await response.json();
        if (data.candidates) {
            alert("🤖 TAMIL AI SUMMARY:\n\n" + data.candidates[0].content.parts[0].text);
        } else {
            alert("Limit reached. Please wait 10 seconds!");
        }
    } catch (e) {
        alert("Summary Error! Check connection.");
    } finally {
        button.innerText = originalText;
        button.disabled = false;
    }
}

// 4. WhatsApp Share
function shareNews(title, url) {
    window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent("🔥 " + title + "\n\n" + url), '_blank');
}

// 5. ATTACH SEARCH EVENT (Crucial Fix)
document.addEventListener('DOMContentLoaded', () => {
    // Search button and Enter key fix
    const searchInput = document.getElementById('searchInput');
    const allButtons = document.getElementsByTagName('button');
    
    // Find the search button (first button in your UI)
    if(allButtons.length > 0) {
        allButtons[0].addEventListener('click', FetchNews);
    }

    // Support for 'Enter' key
    if(searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') FetchNews();
        });
    }

    FetchNews(); // Initial load
});
