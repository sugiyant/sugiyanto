// Variabel global
const quoteText = document.getElementById('quote-text');
const generateQuoteButton = document.getElementById('generate-quote');
const homeButton = document.getElementById('home-button');
const settingsButton = document.getElementById('settings-button');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsButton = document.getElementById('close-settings');
const modeButtons = document.querySelectorAll('.mode-button');

// API URLs (Anda bisa mencari API gratis untuk Al-Quran dan Hadis)
const quranApiUrl = 'https://api.quran.com/api/v4/verses/random?language=id';
const hadithApiUrl = 'https://api.hadith.gading.dev/random';

// Fungsi untuk mengambil kutipan acak
async function fetchRandomQuote() {
  const random = Math.random();
  if (random < 0.5) {
    // Ambil kutipan dari Al-Quran
    const response = await fetch(quranApiUrl);
    const data = await response.json();
    quoteText.textContent = `"${data.verse.text}"`;
  } else {
    // Ambil kutipan dari Hadis
    const response = await fetch(hadithApiUrl);
    const data = await response.json();
    quoteText.textContent = `"${data.contents.arab} - ${data.contents.id}"`;
  }
}

// Event listener untuk tombol "Kutipan Baru"
generateQuoteButton.addEventListener('click', fetchRandomQuote);

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

// Panggil fungsi pertama kali saat halaman dimuat
fetchRandomQuote();