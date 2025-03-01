// Variabel global
const quoteText = document.getElementById('quote-text');
const generateQuoteButton = document.getElementById('generate-quote');
const showTafsirButton = document.getElementById('show-tafsir');
const homeButton = document.getElementById('home-button');
const settingsButton = document.getElementById('settings-button');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsButton = document.getElementById('close-settings');
const modeButtons = document.querySelectorAll('.mode-button');

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
    // Ambil nomor surah dan ayat secara acak
    const randomSurahNumber = Math.floor(Math.random() * 114) + 1; // 1-114
    const surahData = await loadSurahData(randomSurahNumber);

    // cek apakah surah ada
    if (surahData) {
        const numberOfAyah = surahData.number_of_ayah;
        const randomAyahNumber = Math.floor(Math.random() * numberOfAyah) + 1;

        const ayahText = surahData.text[randomAyahNumber];
        const ayahTranslation = surahData.translations.id.text[randomAyahNumber];
        const ayahTafsir = surahData.tafsir.id.kemenag.text[randomAyahNumber];
        
        // Tampilkan di dalam HTML
        quoteText.innerHTML = `
            <p class="arabic">${ayahText}</p>
            <p class="translation">${ayahTranslation}</p>
            <p class="surah-info">QS. ${surahData.name_latin} : ${randomAyahNumber}</p>
        `;

        // Simpan data kutipan yang ditampilkan
        currentQuote.surahNumber = randomSurahNumber;
        currentQuote.ayahNumber = randomAyahNumber;
        currentQuote.isHadis = false;

        // tampilkan tombol show tafsir
        showTafsirButton.style.display = 'inline-block';
    } else {
        console.error('Surah data not found or invalid.');
    }
}

// Fungsi untuk mengambil kutipan acak dari data lokal
async function fetchRandomQuote() {
  const random = Math.random();
  if (random < 0.5) {
      // Ambil kutipan dari Al-Quran
      fetchRandomQuranQuote();
  } else {
      // Ambil kutipan dari Hadis
      const randomIndex = Math.floor(Math.random() * hadisData.length);
      const quote = hadisData[randomIndex];
      quoteText.innerHTML = `
          <p class="arabic">${quote.teks}</p>
          <p class="translation">${quote.terjemahan}</p>
          <p class="hadis-info">(${quote.kitab} No. ${quote.nomor})</p>
      `;

      // Simpan data kutipan yang ditampilkan
      currentQuote.isHadis = true;
      // hide tombol show tafsir
      showTafsirButton.style.display = 'none';
  }
}

// Fungsi untuk menampilkan tafsir dari ayat yang sedang ditampilkan
async function showTafsir() {
    // cek apakah yang muncul adalah hadist
    if (currentQuote.isHadis) {
        return; // jika hadist, maka return
    }

    if (currentQuote.surahNumber && currentQuote.ayahNumber) {
        const surahData = await loadSurahData(currentQuote.surahNumber);
        const ayahTafsir = surahData.tafsir.id.kemenag.text[currentQuote.ayahNumber];

        quoteText.innerHTML = `
            <p class="tafsir">${ayahTafsir}</p>
            <p class="surah-info">QS. ${surahData.name_latin} : ${currentQuote.ayahNumber}</p>
        `;
    }
}

// Fungsi untuk memuat data surah dari file JSON
async function loadSurahData(surahNumber) {
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
  const response = await fetch('hadis.json');
  hadisData = await response.json();
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

// Memuat data dan menjalankan fungsi pertama kali saat halaman dimuat
Promise.all([loadHadisData()]).then(() => {
  fetchRandomQuote();
});
