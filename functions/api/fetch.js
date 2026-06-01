/**
 * Archive.org Direct Link Extractor - Cloudflare Pages Function
 */

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);

    // Handle CORS
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }

    const query = url.searchParams.get('query') || '';

    if (!query) {
        return jsonResponse({
            success: false,
            error: 'URL tidak diberikan. Gunakan ?query=ARCHIVE_ORG_URL'
        }, 400);
    }

    // Extract item ID
    const itemId = extractItemId(query);

    if (!itemId) {
        return jsonResponse({
            success: false,
            error: 'URL Archive.org tidak valid'
        }, 400);
    }

    try {
        // Fetch metadata from Archive.org
        const metadataUrl = `https://archive.org/metadata/${itemId}`;
        const response = await fetch(metadataUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            return jsonResponse({
                success: false,
                error: `Gagal mengambil metadata (HTTP ${response.status})`,
                item_id: itemId
            }, response.status);
        }

        const data = await response.json();

        if (!data || !data.metadata) {
            return jsonResponse({
                success: false,
                error: 'Item tidak ditemukan',
                item_id: itemId
            }, 404);
        }

        const metadata = data.metadata || {};
        const files = data.files || [];

        // Find main file
        const mainFile = findMainFile(files);

        if (!mainFile) {
            return jsonResponse({
                success: false,
                error: 'Tidak ada file yang dapat diunduh',
                item_id: itemId
            }, 404);
        }

        // Get all downloadable files
        const allFiles = getAllFiles(files, itemId);

        // Format upload date
        let uploadDate = null;
        const dateStr = metadata.addeddate || metadata.publicdate;
        if (dateStr) {
            const date = new Date(dateStr);
            uploadDate = date.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Build response
        const result = {
            success: true,
            mode: 'direct_archive_extraction',
            item_id: itemId,
            title: metadata.title || itemId,
            description: metadata.description || null,
            filename: mainFile.name,
            file_size: formatFileSize(mainFile.size || 0),
            file_size_bytes: parseInt(mainFile.size || 0),
            file_type: getFileType(mainFile.name),
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
            archive_page: `https://archive.org/details/${itemId}`,
            _cached_at: new Date().toISOString()
        };

        return jsonResponse(result);

    } catch (error) {
        return jsonResponse({
            success: false,
            error: 'Terjadi kesalahan: ' + error.message,
            item_id: itemId
        }, 500);
    }
}

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data, null, 2), {
        status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
        }
    });
}

function extractItemId(url) {
    const match = url.match(/archive\.org\/(?:details|download)\/([^\/\?\#]+)/i);
    if (match) return match[1];
    if (/^[a-zA-Z0-9_\-\.]+$/.test(url)) return url;
    return null;
}

function formatFileSize(bytes) {
    bytes = parseInt(bytes) || 0;
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' bytes';
}

function getFileType(filename) {
    return (filename.split('.').pop() || 'Unknown').toUpperCase();
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

function getAllFiles(files, itemId) {
    const validExt = ['zip', 'rar', '7z', 'tar', 'gz', 'iso', 'exe', 'msi', 'dmg', 'apk', 'pdf', 'mp4', 'mkv', 'avi', 'webm', 'mp3', 'flac', 'wav', 'ogg', 'jpg', 'jpeg', 'png', 'gif'];
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
                type: getFileType(name),
                download_url: `https://archive.org/download/${itemId}/${encodeURIComponent(name)}`,
                md5: file.md5 || null,
                sha1: file.sha1 || null,
                crc32: file.crc32 || null,
            });
        }
    }

    result.sort((a, b) => b.size - a.size);
    return result;
}
