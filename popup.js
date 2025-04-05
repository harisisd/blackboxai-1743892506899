// DOM Elements
const refreshBtn = document.getElementById('refreshBtn');
const selectAllCheckbox = document.getElementById('selectAll');
const downloadBtn = document.getElementById('downloadBtn');
const downloadList = document.getElementById('downloadList');
const selectedCount = document.getElementById('selectedCount');
const statusMessage = document.getElementById('statusMessage');

// State
let downloadItems = [];

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
    refreshDownloadList();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    refreshBtn.addEventListener('click', refreshDownloadList);
    selectAllCheckbox.addEventListener('change', handleSelectAll);
    downloadBtn.addEventListener('click', handleDownload);
}

// Refresh download list
async function refreshDownloadList() {
    showLoading();
    
    try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tabs[0]?.url?.includes('lulustream.com')) {
            throw new Error('Please navigate to lulustream.com to use this extension');
        }

        const response = await chrome.tabs.sendMessage(tabs[0].id, { action: 'extractLinks' });
        
        if (!response.success) {
            throw new Error(response.message || 'Failed to extract download links');
        }

        downloadItems = response.links;
        renderDownloadList();
        updateUI();
    } catch (error) {
        showError(error.message);
    }
}

// Render download list
function renderDownloadList() {
    if (downloadItems.length === 0) {
        downloadList.innerHTML = '<div class="loading-message">No download links found</div>';
        return;
    }

    downloadList.innerHTML = downloadItems.map((item, index) => `
        <div class="download-item">
            <label>
                <input type="checkbox" 
                       data-id="${item.id}" 
                       ${item.selected ? 'checked' : ''}>
                <span>${item.title}</span>
            </label>
        </div>
    `).join('');

    // Add change listeners to checkboxes
    downloadList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const id = checkbox.dataset.id;
            const item = downloadItems.find(item => item.id === id);
            if (item) {
                item.selected = checkbox.checked;
                updateUI();
            }
        });
    });
}

// Handle select all
function handleSelectAll() {
    const checked = selectAllCheckbox.checked;
    downloadItems.forEach(item => item.selected = checked);
    renderDownloadList();
    updateUI();
}

// Handle download
async function handleDownload() {
    const selectedItems = downloadItems.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
        showError('Please select at least one item to download');
        return;
    }

    downloadBtn.disabled = true;
    showStatus('Starting downloads...', 'info');

    try {
        const result = await chrome.runtime.sendMessage({
            action: 'download',
            urls: selectedItems
        });

        if (result.success) {
            showStatus(`Successfully started ${result.completed} downloads`, 'success');
        } else {
            throw new Error(`Failed to download ${result.failed} items`);
        }
    } catch (error) {
        showError(error.message);
    } finally {
        downloadBtn.disabled = false;
    }
}

// Update UI state
function updateUI() {
    const selectedItems = downloadItems.filter(item => item.selected);
    const totalItems = downloadItems.length;
    
    selectedCount.textContent = `(${selectedItems.length} of ${totalItems} selected)`;
    downloadBtn.disabled = selectedItems.length === 0;
    
    // Update select all checkbox state
    if (totalItems > 0) {
        selectAllCheckbox.checked = selectedItems.length === totalItems;
        selectAllCheckbox.indeterminate = selectedItems.length > 0 && selectedItems.length < totalItems;
    }
}

// UI Helper functions
function showLoading() {
    downloadList.innerHTML = '<div class="loading-message">Scanning for downloadable content...</div>';
    clearStatus();
}

function showError(message) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message error';
}

function showStatus(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
}

function clearStatus() {
    statusMessage.textContent = '';
    statusMessage.className = 'status-message';
}