document.addEventListener('DOMContentLoaded', () => {
    fetchQuote();
    document.getElementById('new-quote-btn').addEventListener('click', fetchQuote);
});

function fetchQuote() {
    // URL API untuk mendapatkan quotes dari Al-Quran dan Hadits
    const apiUrls = [
        'https://api.alquran.cloud/v1/ayah/random?translations=id.indonesian', // Menambahkan terjemahan Bahasa Indonesia
        'https://api.hadith.sutanlab.id/books/muslim?range=1-300'
    ];

    // Pilih API secara acak
    const apiUrl = apiUrls[Math.floor(Math.random() * apiUrls.length)];

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            let quote, source, translation = "";

            if (apiUrl.includes('alquran')) {
                quote = data.data.text; // Teks Arab
                translation = data.data.translations[0].text; // Terjemahan Bahasa Indonesia
                source = `Al-Quran Surah ${data.data.surah.englishName} Ayah ${data.data.numberInSurah}`;
            } else if (apiUrl.includes('hadith')) {
                const hadith = data.data.hadiths[Math.floor(Math.random() * data.data.hadiths.length)];
                quote = hadith.arab; // Teks Arab
                translation = hadith.id; // Terjemahan Bahasa Indonesia
                source = `Hadith Muslim Book ${hadith.bookNumber} Hadith ${hadith.hadithNumber}`;
            }
            //gabungkan arab dan terjemahan
            const combine = `<div style="text-align: right; font-size:1.2em; margin-bottom:10px">${quote}</div>
            <div>${translation}</div>`;

            document.getElementById('quote').innerHTML = combine;
            document.getElementById('source').innerText = source;
        })
        .catch(error => console.error('Error fetching quote:', error));
}
