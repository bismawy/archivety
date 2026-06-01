/**
 * Archive.org Direct Link Extractor
 * Extracts direct download links from Archive.org
 */

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
    const history = JSON.parse(localStorage.getItem('extractHistory') || '[]');
    if (history.length === 0) {
        historyCard.classList.add('hidden');
        return;
    }

    historyCard.classList.remove('hidden');
    historyList.innerHTML = history.map(item => `
        <div class="history-item" data-id="${item.itemId}">
            <div class="history-item-info">
                <span class="history-item-title">${item.title}</span>
                <span class="history-item-id">${item.itemId}</span>
            </div>
            <button type="button" class="btn-delete-history" data-id="${item.itemId}" title="Hapus Riwayat">
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
    showToast('Riwayat dihapus');
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
        btnText.textContent = 'Mengekstrak...';
        btnLoader.classList.remove('hidden');
        extractBtn.disabled = true;
    } else {
        btnText.textContent = 'Ekstrak Link Download';
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

/**
 * Creates a hash item element
 */
function createHashItem(label, value) {
    if (!value) return '';
    return `
        <div class="hash-item">
            <span class="hash-label">${label}</span>
            <code class="hash-value">${value}</code>
            <button type="button" class="btn-copy-hash" data-value="${value}" title="Salin">
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
                Unduh
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
    detailsGrid.innerHTML = `
        ${createDetailItem('Nama File', data.filename)}
        ${createDetailItem('ID Item', data.item_id)}
        ${createDetailItem('Ukuran File', data.file_size)}
        ${createDetailItem('Tipe File', data.file_type)}
        ${createDetailItem('Tanggal Unggah', data.upload_date)}
        ${createDetailItem('Pengunggah', data.uploader)}
        ${createDetailItem('Koleksi', Array.isArray(data.collection) ? data.collection.join(', ') : data.collection)}
        ${createDetailItem('Di-cache Pada', data._cached_at)}
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
            showError('URL Archive.org tidak valid');
            setButtonLoading(false);
            return;
        }

        // Fetch directly from Archive.org API
        const response = await fetch(`https://archive.org/metadata/${itemId}`, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            showError(`Gagal mengambil data (HTTP ${response.status})`);
            setButtonLoading(false);
            return;
        }

        const archiveData = await response.json();

        if (!archiveData || !archiveData.metadata) {
            showError('Item tidak ditemukan di Archive.org');
            setButtonLoading(false);
            return;
        }

        // Process the data
        const data = processArchiveData(archiveData, itemId);

        if (!data.success) {
            showError(data.error);
            setButtonLoading(false);
            return;
        }

        populateResult(data);
        saveToHistory(itemId, data.title);
        showResult();

    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            showError('Koneksi timeout. Server Archive.org lambat merespons.');
        } else {
            console.error('Error:', error);
            showError('Terjadi kesalahan. Silakan coba lagi.');
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
        return { success: false, error: 'Tidak ada file yang dapat diunduh' };
    }

    // Get all downloadable files
    const allFiles = getAllDownloadableFiles(files, itemId);

    // Format upload date
    let uploadDate = null;
    const dateStr = metadata.addeddate || metadata.publicdate;
    if (dateStr) {
        const date = new Date(dateStr);
        uploadDate = date.toLocaleDateString('id-ID', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }

    return {
        success: true,
        item_id: itemId,
        title: metadata.title || itemId,
        filename: mainFile.name,
        file_size: formatFileSize(mainFile.size || 0),
        file_type: getFileExtension(mainFile.name),
        upload_date: uploadDate,
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
        showToast('Link download berhasil disalin!');

        setTimeout(() => {
            copyIcon.classList.remove('hidden');
            checkIcon.classList.add('hidden');
        }, 2000);
    } catch (err) {
        downloadUrl.select();
        document.execCommand('copy');
        showToast('Link download berhasil disalin!');
    }
}

/**
 * Copies JSON to clipboard
 */
async function copyJson() {
    if (!currentData) return;

    try {
        await navigator.clipboard.writeText(JSON.stringify(currentData, null, 2));
        showToast('Respons JSON berhasil disalin!');
    } catch (err) {
        jsonPre.select();
        document.execCommand('copy');
        showToast('Respons JSON berhasil disalin!');
    }
}

/**
 * Exports all downloadable links to a .txt file
 */
function exportLinksToTxt() {
    if (!currentData || !currentData.all_files || currentData.all_files.length === 0) {
        showToast('Tidak ada file untuk diekspor');
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
    
    showToast('Berhasil mengekspor daftar link ke TXT!');
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
    loadHistory();

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
