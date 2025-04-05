// Handle download requests from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'download') {
        handleDownloads(request.urls)
            .then(result => sendResponse(result))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Required for async response
    }
});

// Function to handle multiple downloads
async function handleDownloads(urls) {
    const results = {
        success: true,
        completed: 0,
        failed: 0,
        errors: []
    };

    for (const urlInfo of urls) {
        try {
            // Configure download options
            const downloadOptions = {
                url: urlInfo.url,
                filename: sanitizeFilename(urlInfo.title), // Clean filename
                conflictAction: 'uniquify'
            };

            // Start download
            await new Promise((resolve, reject) => {
                chrome.downloads.download(downloadOptions, (downloadId) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else if (downloadId === undefined) {
                        reject(new Error('Download failed'));
                    } else {
                        resolve(downloadId);
                    }
                });
            });

            results.completed++;
        } catch (error) {
            results.failed++;
            results.errors.push({
                url: urlInfo.url,
                error: error.message
            });
        }
    }

    // Update success status based on results
    results.success = results.failed === 0;
    
    return results;
}

// Helper function to sanitize filenames
function sanitizeFilename(filename) {
    // Remove invalid characters and trim
    return filename
        .replace(/[<>:"/\\|?*]+/g, '-') // Replace invalid chars with dash
        .replace(/\s+/g, '_')           // Replace spaces with underscore
        .replace(/-+/g, '-')            // Remove multiple dashes
        .replace(/^-+|-+$/g, '')        // Remove leading/trailing dashes
        .trim()
        .substring(0, 240);             // Limit filename length
}

// Optional: Track download progress
chrome.downloads.onChanged.addListener((delta) => {
    if (delta.state) {
        console.log(`Download ${delta.id} ${delta.state.current}`);
    }
});