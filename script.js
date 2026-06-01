/**
 * Archievty
 * Extracts direct download links from Archive.org
 */

const translations = {
    id: {
        "logo-text": "Archievty",
        "subtitle": "Dapatkan link download langsung dari Archive.org",
        "card-title": "Ekstrak Link Download",
        "card-description": "Masukkan URL Archive.org untuk mendapatkan link download langsung",
        "label-url": "URL Archive.org",
        "input-placeholder": "https://archive.org/details/contoh-item",
        "btn-extract": "Ekstrak",
        "btn-extracting": "Mengekstrak...",
        "btn-extract-idle": "Ekstrak Link Download",
        "usage-title": "Cara Penggunaan",
        "usage-step-1": "Tempel URL Archive.org",
        "usage-step-2": "Klik \"Ekstrak\"",
        "usage-step-3": "Dapatkan URL download langsung",
        "usage-example": "Contoh URL:",
        "history-title": "Riwayat Ekstraksi",
        "empty-title": "Belum ada ekstraksi",
        "empty-description": "Masukkan URL Archive.org dan klik ekstrak untuk melihat hasilnya di sini",
        "loader-text": "Mengekstrak link download...",
        "error-title": "Ekstraksi Gagal",
        "error-message": "Tidak dapat mengekstrak link download.",
        "btn-retry": "Coba Lagi",
        "dl-title": "Link Download Langsung",
        "dl-btn": "Unduh",
        "details-title": "Detail File",
        "hashes-title": "Hash Keamanan",
        "all-files-title": "Semua File",
        "json-title": "Respons API (JSON)",
        "btn-copy-json": "Salin JSON",
        "footer-text": "Dibuat dengan <span class=\"heart\">♥</span> oleh Bisma.",
        "toast-copied-link": "Link download berhasil disalin!",
        "toast-copied-json": "Respons JSON berhasil disalin!",
        "toast-deleted-history": "Riwayat dihapus",
        "toast-no-files": "Tidak ada file yang dapat diunduh",
        "toast-export-success": "Berhasil mengekspor daftar link to TXT!",
        "toast-invalid-url": "URL Archive.org tidak valid",
        "toast-not-found": "Item tidak ditemukan di Archive.org",
        "toast-failed-fetch": "Gagal mengambil data",
        "toast-timeout": "Koneksi timeout. Server Archive.org lambat merespons.",
        "toast-error-generic": "Terjadi kesalahan. Silakan coba lagi.",
        "files-actions-label": "Ekspor daftar link untuk IDM/JDownloader:",
        "export-txt-btn": "Ekspor TXT",
        "detail-filename": "Nama File",
        "detail-itemid": "ID Item",
        "detail-filesize": "Ukuran File",
        "detail-filetype": "Tipe File",
        "detail-uploaddate": "Tanggal Unggah",
        "detail-uploader": "Pengunggah",
        "detail-collection": "Koleksi",
        "detail-cachedat": "Di-cache Pada",
        "dl-btn-file": "Unduh",
        "title-theme": "Ubah Tema",
        "title-copy-link": "Salin Link",
        "title-copy-hash": "Salin Hash",
        "title-delete-history": "Hapus Riwayat",
        "title-clear": "Hapus"
    },
    en: {
        "logo-text": "Archievty",
        "subtitle": "Get direct download links from Archive.org",
        "card-title": "Extract Download Links",
        "card-description": "Enter Archive.org URL to get direct download links",
        "label-url": "Archive.org URL",
        "input-placeholder": "https://archive.org/details/example-item",
        "btn-extract": "Extract",
        "btn-extracting": "Extracting...",
        "btn-extract-idle": "Extract Download Links",
        "usage-title": "How to Use",
        "usage-step-1": "Paste Archive.org URL",
        "usage-step-2": "Click \"Extract\"",
        "usage-step-3": "Get direct download URL",
        "usage-example": "Example URL:",
        "history-title": "Extraction History",
        "empty-title": "No extraction yet",
        "empty-description": "Enter Archive.org URL and click extract to see results here",
        "loader-text": "Extracting download links...",
        "error-title": "Extraction Failed",
        "error-message": "Unable to extract download links.",
        "btn-retry": "Retry",
        "dl-title": "Direct Download Link",
        "dl-btn": "Download",
        "details-title": "File Details",
        "hashes-title": "Security Hashes",
        "all-files-title": "All Files",
        "json-title": "API Response (JSON)",
        "btn-copy-json": "Copy JSON",
        "footer-text": "Made with <span class=\"heart\">♥</span> by Bisma.",
        "toast-copied-link": "Download link successfully copied!",
        "toast-copied-json": "API response successfully copied!",
        "toast-deleted-history": "History deleted",
        "toast-no-files": "No downloadable files found",
        "toast-export-success": "Successfully exported download links to TXT!",
        "toast-invalid-url": "Invalid Archive.org URL",
        "toast-not-found": "Item not found on Archive.org",
        "toast-failed-fetch": "Failed to fetch data",
        "toast-timeout": "Connection timeout. Archive.org server is slow to respond.",
        "toast-error-generic": "An error occurred. Please try again.",
        "files-actions-label": "Export link list for IDM/JDownloader:",
        "export-txt-btn": "Export TXT",
        "detail-filename": "File Name",
        "detail-itemid": "Item ID",
        "detail-filesize": "File Size",
        "detail-filetype": "File Type",
        "detail-uploaddate": "Upload Date",
        "detail-uploader": "Uploader",
        "detail-collection": "Collection",
        "detail-cachedat": "Cached At",
        "dl-btn-file": "Download",
        "title-theme": "Change Theme",
        "title-copy-link": "Copy Link",
        "title-copy-hash": "Copy Hash",
        "title-delete-history": "Delete History",
        "title-clear": "Clear"
    }
};

let currentLang = localStorage.getItem('lang') || 'id';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('lang', lang);
    
    // Update active class on buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Translate all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            if (el.tagName === 'INPUT') {
                el.placeholder = translations[lang][key];
            } else if (key === 'footer-text') {
                el.innerHTML = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });

    // Translate elements with data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (translations[lang][key]) {
            el.title = translations[lang][key];
        }
    });

    // Refresh history card UI to reflect translations
    loadHistory();
    
    // Refresh result card if present
    if (currentData) {
        populateResult(currentData);
    }
}

// DOM Elements - Input Section
const urlInput = document.getElementById('urlInput');
const clearBtn = document.getElementById('clearBtn');
const extractBtn = document.getElementById('extractBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');

// DOM Elements - Result Section
const emptyState = document.getElementById('emptyState');
const loadingCard = document.getElementById('loadingCard');
const errorCard = document.getElementById('errorCard');
const resultCard = document.getElementById('resultCard');
const loaderUrl = document.getElementById('loaderUrl');
const errorMessage = document.getElementById('errorMessage');
const retryBtn = document.getElementById('retryBtn');

// DOM Elements - Result Content
const fileThumbnail = document.getElementById('fileThumbnail');
const fileTitle = document.getElementById('fileTitle');
const fileType = document.getElementById('fileType');
const fileSize = document.getElementById('fileSize');
const downloadUrl = document.getElementById('downloadUrl');
const downloadBtn = document.getElementById('downloadBtn');
const copyDownloadBtn = document.getElementById('copyDownloadBtn');
const copyIcon = document.getElementById('copyIcon');
const checkIcon = document.getElementById('checkIcon');
const detailsGrid = document.getElementById('detailsGrid');
const hashesGrid = document.getElementById('hashesGrid');
const filesSection = document.getElementById('filesSection');
const filesToggle = document.getElementById('filesToggle');
const filesCount = document.getElementById('filesCount');
const filesListContainer = document.getElementById('filesListContainer');
const filesList = document.getElementById('filesList');
const exportTxtBtn = document.getElementById('exportTxtBtn');
const jsonToggle = document.getElementById('jsonToggle');
const jsonContent = document.getElementById('jsonContent');
const jsonPre = document.getElementById('jsonPre');
const copyJsonBtn = document.getElementById('copyJsonBtn');
const historyCard = document.getElementById('historyCard');
const historyList = document.getElementById('historyList');

// State
let currentData = null;

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');

/**
 * Shows a toast notification at the top right of the page
 */
function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 16 12 12 8 12"></polyline>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <span class="toast-message">${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 200);
    }, 3000);
}

/**
 * Loads recent searches from localStorage
 */
function loadHistory() {
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem('extractHistory') || '[]');
    } catch (e) {
        console.error('Error parsing history:', e);
        history = [];
    }

    if (history.length === 0) {
        historyCard.classList.add('hidden');
        return;
    }

    const deleteTitle = translations[currentLang]['title-delete-history'] || 'Hapus Riwayat';

    historyCard.classList.remove('hidden');
    historyList.innerHTML = history.map(item => `
        <div class="history-item" data-id="${item.itemId}">
            <div class="history-item-info">
                <span class="history-item-title">${item.title}</span>
                <span class="history-item-id">${item.itemId}</span>
            </div>
            <button type="button" class="btn-delete-history" data-id="${item.itemId}" title="${deleteTitle}">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        </div>
    `).join('');

    // Add click handlers for items
    document.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('.btn-delete-history')) return;
            const itemId = item.dataset.id;
            urlInput.value = `https://archive.org/details/${itemId}`;
            extractLinks();
        });
    });

    // Add click handlers for delete buttons
    document.querySelectorAll('.btn-delete-history').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const itemId = btn.dataset.id;
            deleteHistoryItem(itemId);
        });
    });
}

/**
 * Saves item to history in localStorage
 */
function saveToHistory(itemId, title) {
    let history = JSON.parse(localStorage.getItem('extractHistory') || '[]');
    history = history.filter(item => item.itemId !== itemId);
    history.unshift({ itemId, title });
    if (history.length > 5) {
        history.pop();
    }
    localStorage.setItem('extractHistory', JSON.stringify(history));
    loadHistory();
}

/**
 * Deletes item from history
 */
function deleteHistoryItem(itemId) {
    let history = JSON.parse(localStorage.getItem('extractHistory') || '[]');
    history = history.filter(item => item.itemId !== itemId);
    localStorage.setItem('extractHistory', JSON.stringify(history));
    loadHistory();
    showToast(translations[currentLang]['toast-deleted-history']);
}

/**
 * Gets the current theme preference
 */
function getThemePreference() {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;

    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

/**
 * Sets the theme
 */
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

/**
 * Toggles between light and dark theme
 */
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
}

// Initialize theme on load
setTheme(getThemePreference());

// Theme toggle event listener
themeToggle.addEventListener('click', toggleTheme);

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

/**
 * Shows loading state
 */
function showLoading(url) {
    emptyState.classList.add('hidden');
    loadingCard.classList.remove('hidden');
    errorCard.classList.add('hidden');
    resultCard.classList.add('hidden');
    loaderUrl.textContent = url;
}

/**
 * Shows error state
 */
function showError(message) {
    emptyState.classList.add('hidden');
    loadingCard.classList.add('hidden');
    errorCard.classList.remove('hidden');
    resultCard.classList.add('hidden');
    errorMessage.textContent = message;
}

/**
 * Shows result card
 */
function showResult() {
    emptyState.classList.add('hidden');
    loadingCard.classList.add('hidden');
    errorCard.classList.add('hidden');
    resultCard.classList.remove('hidden');
}

/**
 * Shows empty state
 */
function showEmpty() {
    emptyState.classList.remove('hidden');
    loadingCard.classList.add('hidden');
    errorCard.classList.add('hidden');
    resultCard.classList.add('hidden');
}

/**
 * Sets button loading state
 */
function setButtonLoading(loading) {
    if (loading) {
        btnText.textContent = translations[currentLang]['btn-extracting'] || 'Mengekstrak...';
        btnLoader.classList.remove('hidden');
        extractBtn.disabled = true;
    } else {
        btnText.textContent = translations[currentLang]['btn-extract-idle'] || 'Ekstrak Link Download';
        btnLoader.classList.add('hidden');
        extractBtn.disabled = false;
    }
}

/**
 * Creates a detail item element
 */
function createDetailItem(label, value) {
    if (!value) return '';
    return `
        <div class="detail-item">
            <span class="detail-label">${label}</span>
            <span class="detail-value">${value}</span>
        </div>
    `;
}

function createHashItem(label, value) {
    if (!value) return '';
    const copyTitle = translations[currentLang]['title-copy-hash'] || 'Salin';
    return `
        <div class="hash-item">
            <span class="hash-label">${label}</span>
            <code class="hash-value">${value}</code>
            <button type="button" class="btn-copy-hash" data-value="${value}" title="${copyTitle}">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            </button>
        </div>
    `;
}

/**
 * Creates a file list item
 */
function createFileItem(file) {
    const labels = translations[currentLang];
    return `
        <div class="file-item">
            <div class="file-item-info">
                <span class="file-item-name">${file.name}</span>
                <div class="file-item-meta">
                    <span class="file-item-type">${file.type}</span>
                    <span class="file-item-size">${file.size_formatted}</span>
                </div>
            </div>
            <a href="${file.download_url}" class="btn btn-sm btn-secondary" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                ${labels['dl-btn-file']}
            </a>
        </div>
    `;
}

/**
 * Populates the result card with data
 */
function populateResult(data) {
    currentData = data;

    // File header
    fileThumbnail.src = data.thumbnail || '';
    fileThumbnail.style.display = 'block';
    fileThumbnail.onerror = () => {
        fileThumbnail.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="%2340BF95" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`;
    };
    fileTitle.textContent = data.title || data.filename;
    fileType.textContent = data.file_type;
    fileSize.textContent = data.file_size;

    // Download section
    downloadUrl.value = data.download_link;
    downloadBtn.href = data.download_link;

    // Details grid
    const labels = translations[currentLang];
    
    let uploadDateFormatted = '-';
    if (data.upload_date) {
        const date = new Date(data.upload_date);
        const locale = currentLang === 'id' ? 'id-ID' : 'en-US';
        uploadDateFormatted = date.toLocaleDateString(locale, {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }

    let cachedAtFormatted = '-';
    if (data._cached_at) {
        const date = new Date(data._cached_at);
        const locale = currentLang === 'id' ? 'id-ID' : 'en-US';
        cachedAtFormatted = date.toLocaleString(locale, {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    }

    detailsGrid.innerHTML = `
        ${createDetailItem(labels['detail-filename'], data.filename)}
        ${createDetailItem(labels['detail-itemid'], data.item_id)}
        ${createDetailItem(labels['detail-filesize'], data.file_size)}
        ${createDetailItem(labels['detail-filetype'], data.file_type)}
        ${createDetailItem(labels['detail-uploaddate'], uploadDateFormatted)}
        ${createDetailItem(labels['detail-uploader'], data.uploader)}
        ${createDetailItem(labels['detail-collection'], Array.isArray(data.collection) ? data.collection.join(', ') : data.collection)}
        ${createDetailItem(labels['detail-cachedat'], cachedAtFormatted)}
    `;

    // Hashes grid
    const hashes = data.security_hashes || {};
    hashesGrid.innerHTML = `
        ${createHashItem('MD5', hashes.md5)}
        ${createHashItem('SHA1', hashes.sha1)}
        ${createHashItem('CRC32', hashes.crc32)}
    `;

    // Add click handlers for hash copy buttons
    document.querySelectorAll('.btn-copy-hash').forEach(btn => {
        btn.addEventListener('click', () => {
            const value = btn.dataset.value;
            navigator.clipboard.writeText(value);
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
            setTimeout(() => {
                btn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                `;
            }, 2000);
        });
    });

    // Files list
    const allFiles = data.all_files || [];
    if (allFiles.length > 1) {
        filesSection.classList.remove('hidden');
        filesCount.textContent = `(${allFiles.length})`;
        filesList.innerHTML = allFiles.map(createFileItem).join('');
    } else {
        filesSection.classList.add('hidden');
    }

    // JSON content
    jsonPre.textContent = JSON.stringify(data, null, 2);

    // Update URL
    const newUrl = `${window.location.pathname}?query=${encodeURIComponent(urlInput.value)}`;
    window.history.pushState({ url: urlInput.value }, '', newUrl);
}

/**
 * Extracts download links from Archive.org
 */
async function extractLinks() {
    const inputUrl = urlInput.value.trim();
    const labels = translations[currentLang];

    if (!inputUrl) {
        urlInput.classList.add('shake');
        setTimeout(() => urlInput.classList.remove('shake'), 500);
        urlInput.focus();
        return;
    }

    setButtonLoading(true);
    showLoading(inputUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
        // Extract item ID from URL
        const itemId = extractItemId(inputUrl);

        if (!itemId) {
            clearTimeout(timeoutId);
            showError(labels['toast-invalid-url']);
            setButtonLoading(false);
            return;
        }

        // Fetch directly from Archive.org API
        const response = await fetch(`https://archive.org/metadata/${itemId}`, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            showError(`${labels['toast-failed-fetch']} (HTTP ${response.status})`);
            setButtonLoading(false);
            return;
        }

        const archiveData = await response.json();

        if (!archiveData || !archiveData.metadata) {
            showError(labels['toast-not-found']);
            setButtonLoading(false);
            return;
        }

        // Process the data
        const data = processArchiveData(archiveData, itemId);

        if (!data.success) {
            showError(labels[data.errorKey]);
            setButtonLoading(false);
            return;
        }

        populateResult(data);
        saveToHistory(itemId, data.title);
        showResult();

    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            showError(labels['toast-timeout']);
        } else {
            console.error('Error:', error);
            showError(labels['toast-error-generic']);
        }
    }

    setButtonLoading(false);
}

/**
 * Extract item ID from Archive.org URL
 */
function extractItemId(url) {
    const match = url.match(/archive\.org\/(?:details|download|embed|stream)\/([^\/\?\#]+)/i);
    if (match) return match[1];
    if (/^[a-zA-Z0-9_\-\.]+$/.test(url)) return url;
    return null;
}

/**
 * Process Archive.org metadata into our format
 */
function processArchiveData(archiveData, itemId) {
    const metadata = archiveData.metadata || {};
    const files = archiveData.files || [];

    // Find main file
    const mainFile = findMainFile(files);

    if (!mainFile) {
        return { success: false, errorKey: 'toast-no-files' };
    }

    // Get all downloadable files
    const allFiles = getAllDownloadableFiles(files, itemId);

    // Format upload date
    const dateStr = metadata.addeddate || metadata.publicdate || null;

    return {
        success: true,
        item_id: itemId,
        title: metadata.title || itemId,
        filename: mainFile.name,
        file_size: formatFileSize(mainFile.size || 0),
        file_type: getFileExtension(mainFile.name),
        upload_date: dateStr,
        uploader: metadata.uploader || metadata.creator || null,
        collection: metadata.collection || null,
        security_hashes: {
            md5: mainFile.md5 || null,
            sha1: mainFile.sha1 || null,
            crc32: mainFile.crc32 || null,
        },
        thumbnail: `https://archive.org/services/img/${itemId}`,
        download_link: `https://archive.org/download/${itemId}/${encodeURIComponent(mainFile.name)}`,
        all_files: allFiles,
        _cached_at: new Date().toISOString()
    };
}

function findMainFile(files) {
    const validExt = ['zip', 'rar', '7z', 'tar', 'gz', 'iso', 'exe', 'msi', 'dmg', 'apk', 'pdf', 'mp4', 'mkv', 'avi', 'mp3', 'flac', 'wav'];
    let mainFile = null;
    let maxSize = 0;

    for (const file of files) {
        const name = file.name || '';
        const size = parseInt(file.size || 0);
        const ext = name.split('.').pop().toLowerCase();

        if (name.includes('_meta.') || name.includes('_files.') || ext === 'xml' || ext === 'sqlite') continue;

        if (validExt.includes(ext) && size > maxSize) {
            maxSize = size;
            mainFile = file;
        }
    }

    if (!mainFile) {
        for (const file of files) {
            const name = file.name || '';
            const size = parseInt(file.size || 0);
            if (name.includes('_meta.') || name.includes('_files.')) continue;
            if (size > maxSize) {
                maxSize = size;
                mainFile = file;
            }
        }
    }

    return mainFile;
}

function getAllDownloadableFiles(files, itemId) {
    const validExt = ['zip', 'rar', '7z', 'tar', 'gz', 'iso', 'exe', 'msi', 'dmg', 'apk', 'pdf', 'mp4', 'mkv', 'avi', 'webm', 'mp3', 'flac', 'wav', 'ogg'];
    const result = [];

    for (const file of files) {
        const name = file.name || '';
        const size = parseInt(file.size || 0);
        const ext = name.split('.').pop().toLowerCase();

        if (name.includes('_meta.') || name.includes('_files.') || ext === 'xml' || ext === 'sqlite' || ext === 'torrent') continue;

        if (validExt.includes(ext) || size > 1000000) {
            result.push({
                name,
                size,
                size_formatted: formatFileSize(size),
                type: getFileExtension(name),
                download_url: `https://archive.org/download/${itemId}/${encodeURIComponent(name)}`,
            });
        }
    }

    result.sort((a, b) => b.size - a.size);
    return result;
}

function formatFileSize(bytes) {
    bytes = parseInt(bytes) || 0;
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' bytes';
}

function getFileExtension(filename) {
    return (filename.split('.').pop() || 'Unknown').toUpperCase();
}

/**
 * Copies download URL to clipboard
 */
async function copyDownloadUrl() {
    const url = downloadUrl.value;

    try {
        await navigator.clipboard.writeText(url);
        copyIcon.classList.add('hidden');
        checkIcon.classList.remove('hidden');
        showToast(translations[currentLang]['toast-copied-link']);

        setTimeout(() => {
            copyIcon.classList.remove('hidden');
            checkIcon.classList.add('hidden');
        }, 2000);
    } catch (err) {
        downloadUrl.select();
        document.execCommand('copy');
        showToast(translations[currentLang]['toast-copied-link']);
    }
}

/**
 * Copies JSON to clipboard
 */
async function copyJson() {
    if (!currentData) return;

    try {
        await navigator.clipboard.writeText(JSON.stringify(currentData, null, 2));
        showToast(translations[currentLang]['toast-copied-json']);
    } catch (err) {
        jsonPre.select();
        document.execCommand('copy');
        showToast(translations[currentLang]['toast-copied-json']);
    }
}

/**
 * Exports all downloadable links to a .txt file
 */
function exportLinksToTxt() {
    if (!currentData || !currentData.all_files || currentData.all_files.length === 0) {
        showToast(translations[currentLang]['toast-no-files']);
        return;
    }

    const links = currentData.all_files.map(file => file.download_url).join('\n');
    const blob = new Blob([links], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `archive_links_${currentData.item_id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast(translations[currentLang]['toast-export-success']);
}

/**
 * Clears input and shows empty state
 */
function clearInput() {
    urlInput.value = '';
    showEmpty();
    window.history.pushState({}, '', window.location.pathname);
    urlInput.focus();
}

/**
 * Toggles collapsible sections
 */
function toggleSection(toggle, content) {
    content.classList.toggle('hidden');
    toggle.classList.toggle('expanded');
}

// Event Listeners
extractBtn.addEventListener('click', extractLinks);
clearBtn.addEventListener('click', clearInput);
copyDownloadBtn.addEventListener('click', copyDownloadUrl);
copyJsonBtn.addEventListener('click', copyJson);
retryBtn.addEventListener('click', extractLinks);
exportTxtBtn.addEventListener('click', exportLinksToTxt);

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        setLanguage(btn.dataset.lang);
    });
});

filesToggle.addEventListener('click', () => {
    toggleSection(filesToggle, filesListContainer);
});

jsonToggle.addEventListener('click', () => {
    toggleSection(jsonToggle, jsonContent);
});

urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        extractLinks();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.activeElement === urlInput) {
        clearInput();
    }
});

// Check for query parameter on page load
window.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);

    const urlParams = new URLSearchParams(window.location.search);
    const queryUrl = urlParams.get('query');

    if (queryUrl) {
        urlInput.value = queryUrl;
        extractLinks();
    } else {
        urlInput.focus();
    }
});

// Handle browser back button
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.url) {
        urlInput.value = e.state.url;
        extractLinks();
    } else {
        showEmpty();
    }
});
