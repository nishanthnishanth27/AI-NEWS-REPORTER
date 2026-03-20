const GNEWS_API_KEY = '3713a2237ee5e9d2812b765100a5009f'; 
const GEMINI_API_KEY = 'AIzaSyCTNqWg9umScbCqFphUyaAI5NA12RUrKRk'; 

async function fetchNews() {
    const query = document.getElementById('searchInput').value || 'Artificial Intelligence';
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '<p class="text-center col-span-full text-blue-400 animate-pulse">🤖 AI Fetching News...</p>';

    try {
        // Corrected Fetch URL for GNews
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=in&max=10&apikey=${GNEWS_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
            displayNews(data.articles);
        } else if (data.errors) {
            grid.innerHTML = `<p class="text-red-500 text-center col-span-full italic">API Issue: ${data.errors[0]}</p>`;
        } else {
            grid.innerHTML = `<p class="text-red-500 text-center col-span-full italic">No news found for this topic.</p>`;
        }
    } catch (error) {
        grid.innerHTML = `<p class="text-red-500 text-center col-span-full italic">Check connection & Refresh.</p>`;
    }
}

function displayNews(articles) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';

    articles.forEach(article => {
        // Removing special characters to prevent JS errors in button
        const cleanTitle = article.title.replace(/['"]/g, "");
        const cleanDesc = article.description ? article.description.replace(/['"]/g, "") : "Click read more for summary.";
        
        const card = `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-2xl hover:border-blue-500 transition shadow-2xl flex flex-col h-full">
                <img src="${article.image || 'https://via.placeholder.com/400x200?text=AI+News'}" class="w-full h-40 object-cover rounded-xl mb-4">
                <h3 class="font-bold text-sm mb-2 text-blue-100">${article.title.slice(0, 70)}...</h3>
                <div class="mt-auto flex justify-between items-center pt-4">
                    <a href="${article.url}" target="_blank" class="text-blue-500 text-[10px] font-bold hover:underline">Read Full</a>
                    <button onclick="getAISummary('${cleanTitle}', '${cleanDesc}')" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold">
                        AI Summary
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

async function getAISummary(title, desc) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: `Summarize this in 2 lines of Tamil: ${title}. ${desc}` }] }] })
        });
        const data = await response.json();
        alert("🤖 AI Summary (Tamil):\n\n" + data.candidates[0].content.parts[0].text);
    } catch (e) {
        alert("AI is busy, please try again in 5 seconds!");
    }
}

// Initial fetch
fetchNews();
