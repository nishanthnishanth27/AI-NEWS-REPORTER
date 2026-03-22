const GEMINI_API_KEY = 'AIzaSyCThwqagkuuScbCqFphUyaAI5NA12RUrRk';

// Main function to fetch news (English + Tamil Mixed)
async function FetchNews() {
    const inputField = document.getElementById('searchInput');
    // Default search for symposium: AI and Technology
    const query = (inputField && inputField.value && inputField.value.trim() !== "") ? inputField.value : 'AI Technology';
    const grid = document.getElementById('newsGrid');

    grid.innerHTML = '<p class="text-center col-span-full text-blue-400 animate-pulse font-mono">🚀 MIXING ENGLISH & TAMIL AI FEEDS...</p>';

    try {
        // 1. Fetch English News from Google RSS
        const engRss = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
        const engUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(engRss)}`;
        
        // 2. Fetch Tamil News from Google RSS
        const tamRss = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ta-IN&gl=IN&ceid=IN:ta`;
        const tamUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(tamRss)}`;

        // Run both fetches at the same time for speed
        const [engRes, tamRes] = await Promise.all([fetch(engUrl), fetch(tamUrl)]);
        const engData = await engRes.json();
        const tamData = await tamRes.json();

        // Combine and Shuffle News
        let combinedNews = [...(engData.items || []), ...(tamData.items || [])];
        combinedNews = combinedNews.sort(() => Math.random() - 0.5).slice(0, 15);

        if (combinedNews.length > 0) {
            displayNews(combinedNews);
        } else {
            grid.innerHTML = '<p class="text-yellow-500 text-center col-span-full">No results. Try searching "Artificial Intelligence".</p>';
        }
    } catch (error) {
        grid.innerHTML = '<p class="text-red-500 text-center col-span-full uppercase font-black">⚠️ CONNECTION ERROR: RETRYING...</p>';
    }
}

// Function to Render News Cards
function displayNews(articles) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';

    articles.forEach((article, index) => {
        const title = article.title;
        const link = article.link;
        // High-Quality Placeholder Image
        const imageUrl = `https://loremflickr.com/400/250/technology,robot?lock=${index + Math.random()}`;
        const safeTitle = title.replace(/[^a-zA-Z0-9 ]/g, " ");

        const card = `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-3xl hover:border-blue-500 transition-all duration-300 shadow-2xl flex flex-col h-full scale-in-center">
                <div class="relative overflow-hidden rounded-2xl mb-4 bg-gray-800 h-44">
                    <img src="${imageUrl}" class="w-full h-full object-cover" alt="News">
                </div>
                <h3 class="font-bold text-[14px] mb-4 text-white leading-tight flex-grow">${title}</h3>
                <div class="mt-auto pt-4 border-t border-gray-800 flex flex-col gap-3">
                    <div class="flex justify-between items-center px-1">
                        <a href="${link}" target="_blank" class="text-blue-400 text-[10px] font-black uppercase hover:underline">Read More</a>
                        <button onclick="shareNews('${safeTitle}', '${link}')" class="text-green-500 text-[10px] font-bold uppercase">WhatsApp</button>
                    </div>
                    <button onclick="getAISummary(this, '${safeTitle}')" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg">
                        ✨ GET TAMIL AI SUMMARY
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

// AI Summary Function (Gemini)
async function getAISummary(button, cleanTitle) {
    const originalText = button.innerText;
    button.innerText = "🤖 AI IS THINKING...";
    button.disabled = true;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Briefly explain this news in 2 short lines in Tamil: " + cleanTitle }] }]
            })
        });

        const data = await response.json();
        if (data.candidates) {
            alert("🤖 TAMIL AI SUMMARY:\n\n" + data.candidates[0].content.parts[0].text);
        } else {
            alert("AI is briefly busy. Try once more!");
        }
    } catch (e) {
        alert("AI Connection Error!");
    } finally {
        button.innerText = originalText;
        button.disabled = false;
    }
}

// WhatsApp Share
function shareNews(title, url) {
    window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent("🔥 Tech News: " + title + "\n\nFull Story: " + url), '_blank');
}

// ATTACH SEARCH BUTTON CLICK EVENT (Very Important)
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.querySelector('button'); // This finds your 'Search' button
    if (searchBtn) {
        searchBtn.onclick = FetchNews;
    }
    FetchNews(); // Initial load
});
