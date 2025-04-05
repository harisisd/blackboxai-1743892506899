// Function to extract download links from the page
function extractDownloadLinks() {
    try {
        // Array to store all download links
        const downloadLinks = [];
        
        // Determine which site we're on
        const isLulustream = window.location.hostname.includes('lulustream.com');
        const isLuluvdo = window.location.hostname.includes('luluvdo.com');
        
        // Find all download links on the page based on the site
        let linkElements;
        if (isLulustream) {
            linkElements = document.querySelectorAll('a[href*="download"], .download-link, a[href*=".mp4"], a[href*=".mkv"]');
        } else if (isLuluvdo) {
            // Adjust selectors based on luluvdo.com's structure
            linkElements = document.querySelectorAll('a[href*="download"], .download-btn, a[href*=".mp4"], a[href*=".mkv"], .vdo-download');
        } else {
            throw new Error('Unsupported website');
        }
        
        linkElements.forEach((element, index) => {
            const url = element.href;
            // Get the title from either a parent container or the link text
            const title = element.getAttribute('title') || 
                         element.textContent.trim() || 
                         `Download ${index + 1}`;
                         
            if (url && !url.includes('javascript:')) {
                downloadLinks.push({
                    url: url,
                    title: title,
                    id: `download-${index}`
                });
            }
        });

        return {
            success: true,
            links: downloadLinks,
            message: `Found ${downloadLinks.length} download links`
        };
    } catch (error) {
        console.error('Error extracting download links:', error);
        return {
            success: false,
            links: [],
            message: 'Error extracting download links: ' + error.message
        };
    }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractLinks') {
        const result = extractDownloadLinks();
        sendResponse(result);
    }
    // Required for async response
    return true;
});

// Optional: Monitor DOM changes for dynamic content
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            // You might want to re-scan for links when new content is added
            // This is especially useful for sites that load content dynamically
            console.log('Content changed, new links might be available');
        }
    });
});

// Start observing the document with the configured parameters
observer.observe(document.body, {
    childList: true,
    subtree: true
});