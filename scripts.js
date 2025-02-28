document.addEventListener("DOMContentLoaded", () => {
    const quoteText = document.getElementById("quote-text");
    const quoteSource = document.getElementById("quote-source");
    const newQuoteBtn = document.getElementById("new-quote");
    const settingsBtn = document.getElementById("settings");
    const settingsModal = document.getElementById("settings-modal");
    const closeSettings = document.getElementById("close-settings");
    const themeButtons = document.querySelectorAll(".theme-btn");

    async function fetchRandomQuote() {
        const sources = ["quran", "hadith"];
        const randomSource = sources[Math.floor(Math.random() * sources.length)];

        if (randomSource === "quran") {
            fetchQuran();
        } else {
            fetchHadith();
        }
    }

    async function fetchQuran() {
        try {
            const response = await fetch("https://api.quran.sutanlab.id/surah");
            const data = await response.json();
            const surahs = data.data;
            const randomSurah = surahs[Math.floor(Math.random() * surahs.length)];
            const ayahResponse = await fetch(`https://api.quran.sutanlab.id/surah/${randomSurah.number}`);
            const ayahData = await ayahResponse.json();
            const ayahs = ayahData.data.verses;
            const randomAyah = ayahs[Math.floor(Math.random() * ayahs.length)];
            quoteText.textContent = `"${randomAyah.text.id}"`;
            quoteSource.textContent = `- Al-Quran (QS ${randomSurah.name.transliteration.id} : ${randomAyah.number.inSurah})`;
        } catch (error) {
            quoteText.textContent = "Gagal memuat kutipan Al-Quran.";
            quoteSource.textContent = "";
        }
    }

    async function fetchHadith() {
        try {
            const booksResponse = await fetch('https://api.hadith.gading.dev/books');
            const booksData = await booksResponse.json();
            const books = booksData.data;
            const randomBook = books[Math.floor(Math.random() * books.length)].id;
            const bookResponse = await fetch(`https://api.hadith.gading.dev/books/${randomBook}`);
            const bookData = await bookResponse.json();
            const totalHadiths = bookData.data.total;
            const randomHadithNumber = Math.floor(Math.random() * totalHadiths) + 1;
            const hadithResponse = await fetch(`https://api.hadith.gading.dev/books/${randomBook}/${randomHadithNumber}`);
            const hadithData = await hadithResponse.json();
            const hadith = hadithData.data;
            quoteText.textContent = `"${hadith.id}"`;
            quoteSource.textContent = `- ${hadith.book.name} (${hadith.number})`;
        } catch (error) {
            quoteText.textContent = "Gagal memuat kutipan Hadis.";
            quoteSource.textContent = "";
        }
    }

    newQuoteBtn.addEventListener("click", fetchRandomQuote);
    fetchRandomQuote();

    settingsBtn.addEventListener("click", () => settingsModal.style.display = "block");
    closeSettings.addEventListener("click", () => settingsModal.style.display = "none");

    themeButtons.forEach(button => {
        button.addEventListener("click", () => {
            document.body.className = button.dataset.theme;
            settingsModal.style.display = "none";
        });
    });
});
