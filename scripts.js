// Variabel global
const quoteText = document.getElementById('quote-text');
const generateQuoteButton = document.getElementById('generate-quote');
const showTafsirButton = document.getElementById('show-tafsir');
const homeButton = document.getElementById('home-button');
const settingsButton = document.getElementById('settings-button');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsButton = document.getElementById('close-settings');
const modeButtons = document.querySelectorAll('.mode-button');
// Tombol share
const shareButton = document.getElementById('share-button');
const shareOptions = document.getElementById('share-options');
const copyLinkButton = document.getElementById('copy-link');
const whatsappButton = document.getElementById('whatsapp');
const facebookButton = document.getElementById('facebook');
const telegramButton = document.getElementById('telegram');
const twitterButton = document.getElementById('twitter');
// Tombol Mode
const modeContainer = document.querySelector('.mode-container'); // mendapatkan tombol mode
const showModeOptionsButton = document.getElementById('show-mode-options'); // mendapatkan tombol tampilkan mode

// Variabel global untuk menyimpan data Al-Quran dan Hadis
let hadisData = [];
// Variabel global untuk menyimpan data kutipan yang sedang ditampilkan
let currentQuote = {
    surahNumber: null,
    ayahNumber: null,
    isHadis: false
};

// Fungsi untuk mengambil kutipan acak dari Al-Quran
async function fetchRandomQuranQuote() {
    console.log("Memanggil fetchRandomQuranQuote");
    // Ambil nomor surah dan ayat secara acak
    const randomSurahNumber = Math.floor(Math.random() * 114) + 1; // 1-114
    const surahData = await loadSurahData(randomSurahNumber);

    // cek apakah surah ada
    if (surahData) {
        // perbaikan disini
        const surah = surahData[randomSurahNumber.toString()] ? surahData[randomSurahNumber.toString()] : surahData;
        const numberOfAyah = surah.number_of_ayah;
        const randomAyahNumber = Math.floor(Math.random() * numberOfAyah) + 1;

        const ayahText = surah.text[randomAyahNumber];
        const ayahTranslation = surah.translations.id.text[randomAyahNumber];
        const ayahTafsir = surah.tafsir.id.kemenag.text[randomAyahNumber];

        // Tampilkan di dalam HTML
        quoteText.innerHTML = `
            <p class="arabic">${ayahText}</p>
            <p class="translation">${ayahTranslation}</p>
            <p class="surah-info">QS. ${surah.name_latin} : ${randomAyahNumber}</p>
        `;

        // Simpan data kutipan yang ditampilkan
        currentQuote.surahNumber = randomSurahNumber;
        currentQuote.ayahNumber = randomAyahNumber;
        currentQuote.isHadis = false;

        // tampilkan tombol show tafsir
        showTafsirButton.style.display = 'inline-block';
        //tampilkan tombol share
        shareButton.style.display = 'inline-block';
        shareOptions.style.display = 'none';
    } else {
        console.error('Surah data not found or invalid.');
    }
}

// Fungsi untuk mengambil kutipan acak dari data lokal
async function fetchRandomQuote() {
    console.log("Memanggil fetchRandomQuote");
    const random = Math.random();
    console.log("Nilai random:", random);
    if (random < 0.5) {
        // Ambil kutipan dari Al-Quran
        console.log("Memilih Al-Quran");
        await fetchRandomQuranQuote();
    } else {
        // Ambil kutipan dari Hadis
        console.log("Memilih Hadis");
        await fetchRandomHadisQuote();
    }
}

// Fungsi untuk memuat kutipan hadis
async function fetchRandomHadisQuote() {
    console.log("Memanggil fetchRandomHadisQuote");
    // Pastikan data hadis sudah dimuat
    if (hadisData.length === 0) {
        await loadHadisData();
    }

    const randomIndex = Math.floor(Math.random() * hadisData.length);
    const quote = hadisData[randomIndex];

    //cek apakah quote ada
    if (quote) {
        console.log("Kutipan Hadis yang Dipilih:", quote);
        quoteText.innerHTML = `
            <p class="arabic">${quote.arab}</p>
            <p class="translation">${quote.id}</p>
            <p class="hadis-info">(${quote.kitab} No. ${quote.number})</p>
        `;

        // Simpan data kutipan yang ditampilkan
        currentQuote.isHadis = true;
        // hide tombol show tafsir
        showTafsirButton.style.display = 'none';
        //tampilkan tombol share
        shareButton.style.display = 'inline-block';
        shareOptions.style.display = 'none';
    } else {
        console.error('Hadis data not found or invalid.');
    }
}

// Fungsi untuk menampilkan tafsir dari ayat yang sedang ditampilkan
async function showTafsir() {
    console.log("Memanggil showTafsir");
    // cek apakah yang muncul adalah hadist
    if (currentQuote.isHadis) {
        return; // jika hadist, maka return
    }

    if (currentQuote.surahNumber && currentQuote.ayahNumber) {
        const surahData = await loadSurahData(currentQuote.surahNumber);
        // perbaikan disini
        const surah = surahData[currentQuote.surahNumber.toString()] ? surahData[currentQuote.surahNumber.toString()] : surahData;
        const ayahTafsir = surah.tafsir.id.kemenag.text[currentQuote.ayahNumber];

        quoteText.innerHTML = `
            <p class="tafsir">${ayahTafsir}</p>
            <p class="surah-info">QS. ${surah.name_latin} : ${currentQuote.ayahNumber}</p>
        `;
    }
}

// Fungsi untuk memuat data surah dari file JSON
async function loadSurahData(surahNumber) {
    console.log("Memanggil loadSurahData untuk surah:", surahNumber);
    try {
        const response = await fetch(`alquran/${surahNumber}.json`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading surah data:', error);
        return null;
    }
}

// Fungsi untuk memuat data Hadis dari file JSON
async function loadHadisData() {
    console.log("Memanggil loadHadisData");
    const response = await fetch('hadits/bukhari.json');

    if (!response.ok) {
        console.error("Gagal memuat data Hadis:", response.status, response.statusText);
        return; // Stop jika gagal
    }
    hadisData = await response.json();
    console.log("Data Hadis berhasil dimuat:", hadisData);
}

// Fungsi untuk mendapatkan teks kutipan yang sedang ditampilkan
function getCurrentQuoteText() {
    return quoteText.innerText;
}

// Fungsi untuk menyalin teks ke clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function () {
        console.log('Berhasil menyalin ke clipboard!');
    }, function (err) {
        console.error('Gagal menyalin ke clipboard: ', err);
    });
}

// Fungsi untuk berbagi ke WhatsApp
function shareToWhatsApp(text) {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// Fungsi untuk berbagi ke Facebook
function shareToFacebook(text) {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// Fungsi untuk berbagi ke Telegram
function shareToTelegram(text) {
    const url = `https://telegram.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// fungsi untuk berbagi ke twitter
function shareToTwitter(text) {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

//fungsi untuk menampilkan share options
function showShareOptions() {
    shareOptions.style.display = shareOptions.style.display === 'none' ? 'block' : 'none';
}

// Event listener untuk tombol "Kutipan Baru"
generateQuoteButton.addEventListener('click', fetchRandomQuote);

// Event listener untuk tombol "Penjelasan"
showTafsirButton.addEventListener('click', showTafsir);

// Event listener untuk tombol "Beranda"
homeButton.addEventListener('click', () => {
    quoteText.textContent = '"Selamat datang di Kutipan Islami!"';
});

// Event listener untuk tombol "Pengaturan"
settingsButton.addEventListener('click', () => {
    settingsModal.style.display = 'block';
});

// Event listener untuk tombol "Tutup Pengaturan"
closeSettingsButton.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

// Event listener untuk tombol mode
modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const mode = button.getAttribute('data-mode');
        document.body.className = mode;
    });
});

// Event listener untuk tombol "Bagikan"
shareButton.addEventListener('click', () => {
    //untuk user iphone
    if (navigator.share) {
        const text = getCurrentQuoteText();
        navigator.share({
            text: text
        })
            .then(() => console.log('Berhasil dibagikan.'))
            .catch((error) => console.log('Gagal membagikan', error));
    } else {
        showShareOptions();
    }
});

// Event listener untuk tombol "Salin Link"
copyLinkButton.addEventListener('click', () => {
    const text = getCurrentQuoteText();
    copyToClipboard(text);
});

// Event listener untuk tombol "WhatsApp"
whatsappButton.addEventListener('click', () => {
    const text = getCurrentQuoteText();
    shareToWhatsApp(text);
});

// Event listener untuk tombol "Facebook"
facebookButton.addEventListener('click', () => {
    const text = getCurrentQuoteText();
    shareToFacebook(text);
});

// Event listener untuk tombol "Telegram"
telegramButton.addEventListener('click', () => {
    const text = getCurrentQuoteText();
    shareToTelegram(text);
});
// event listener untuk tombol twitter
twitterButton.addEventListener('click', () => {
    const text = getCurrentQuoteText();
    shareToTwitter(text);
})
// Event listener untuk menampilkan mode
showModeOptionsButton.addEventListener('click', () => {
    modeContainer.classList.toggle('hidden'); // Toggle class 'hidden' untuk menampilkan atau menyembunyikan modeContainer
});

// Memuat data dan menjalankan fungsi pertama kali saat halaman dimuat
loadHadisData().then(() => {
    fetchRandomQuote();
});
