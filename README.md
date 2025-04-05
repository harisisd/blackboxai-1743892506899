
Built by https://www.blackbox.ai

---

```markdown
# Lulustream Mass Downloader

## Project Overview
Lulustream Mass Downloader is a browser extension designed to facilitate easy mass downloads of content from [lulustream.com](https://lulustream.com). The extension allows users to extract and download multiple files simultaneously, enhancing the usability and efficiency of downloading from the site.

## Installation
To install the Lulustream Mass Downloader extension, follow these steps:

1. Download or clone the repository to your local machine.
2. Open your browser and navigate to the extensions page (For Chrome, visit `chrome://extensions/`).
3. Enable "Developer mode" using the toggle switch in the upper right corner.
4. Click on "Load unpacked" and select the directory where the project files are located.
5. The extension will be loaded and is now ready for use.

## Usage
1. Navigate to [lulustream.com](https://lulustream.com) in your browser.
2. Click on the extension icon in the toolbar to open the popup interface.
3. Click the **Refresh** button to scan for downloadable content.
4. Select the items you wish to download using the checkboxes.
5. Click the **Download Selected** button to initiate downloads.

## Features
- **Mass Downloading**: Select and download multiple media files at once.
- **User-friendly Interface**: Simple popup interface with clear functionality.
- **Dynamic Scanning**: Automatically detects downloadable content upon refreshing the list.
- **Select All Option**: Quickly select or deselect all items in the list.
- **Error Handling**: Displays error messages for better user experience in case of issues.

## Dependencies
The project uses the following dependencies:
- `chrome` APIs for browser extension functionalities (included in the Chrome browser, no separate installation required).

## Project Structure
The project has the following directory structure:

```
.
├── manifest.json         # Metadata about the extension
├── popup.html            # HTML for popup interface
├── style.css             # Styles for popup interface
├── background.js         # Background script handling downloads
├── contentScript.js      # Script for extracting download links from the page
└── popup.js              # Logic for the popup interface functionality
```

### File Descriptions
- **manifest.json**: Contains the configuration for the extension, including permissions, version, and scripts.
- **popup.html**: The HTML structure of the popup that users interact with to manage downloads.
- **style.css**: Stylesheet that defines the appearance of the popup.
- **background.js**: Handles download requests and manages download operations in the background.
- **contentScript.js**: Extracts download links from the webpage to be presented in the popup.
- **popup.js**: Manages the interaction of elements within the popup, including events and UI updates.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing
Contributions are welcome! Please fork this repository and submit a pull request for any improvements or fixes.

---

Feel free to contact the project maintainers for any queries or suggestions. Enjoy downloading your content from lulustream!
```