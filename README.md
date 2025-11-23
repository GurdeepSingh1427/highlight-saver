# Website Highlight Saver

A beautiful Chrome/Edge browser extension that lets you save text highlights from any webpage and access them later. Perfect for researchers, students, and anyone who wants to keep track of important quotes and passages.

![Version](https://img.shields.io/badge/version-1.0.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🎯 **Easy Text Selection**: Simply select any text on any webpage
- 💾 **Local Storage**: All highlights are saved locally in your browser
- 🎨 **Beautiful UI**: Modern gradient design with smooth animations
- 🔗 **Source Tracking**: Automatically saves the URL and page title with each highlight
- 📅 **Date Stamping**: Each highlight is tagged with the date it was saved
- 🗑️ **Easy Management**: Delete highlights with a single click
- 🚀 **Non-Intrusive**: Uses Shadow DOM to avoid interfering with website functionality
- ⚡ **Fast & Lightweight**: Minimal performance impact

## 📦 Installation

### Method 1: Load Unpacked Extension (For Development/Personal Use)

1. **Download or Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/highlight-saver.git
   cd highlight-saver
   ```

2. **Open Chrome/Edge Extensions Page**
   - **Chrome**: Navigate to `chrome://extensions/`
   - **Edge**: Navigate to `edge://extensions/`

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner of the extensions page

4. **Load the Extension**
   - Click the "Load unpacked" button
   - Select the `highlight-saver` folder (the folder containing `manifest.json`)
   - The extension should now appear in your extensions list

5. **Pin the Extension (Optional)**
   - Click the puzzle piece icon (Chrome) or extensions icon (Edge) in your toolbar
   - Find "Website Highlight Saver" and click the pin icon to keep it visible

### Method 2: Install from Chrome Web Store (If Published)

*Coming soon - Extension will be available on Chrome Web Store*

## 🚀 How to Use

### Saving Highlights

1. **Navigate to any webpage** where you want to save text
2. **Select the text** you want to highlight by clicking and dragging your mouse
3. **Click the "Save Highlight?" button** that appears above (or below) your selection
4. The button will turn green and show "✓ Saved!" confirmation
5. The button will automatically disappear after 1.5 seconds

### Viewing Saved Highlights

1. **Click the extension icon** in your browser toolbar
2. A popup will open showing all your saved highlights
3. Each highlight displays:
   - The saved text (with a purple gradient accent)
   - The source page title (clickable link)
   - The date it was saved
   - A delete button (×)

### Managing Highlights

- **View Source**: Click on the page title link to open the original webpage
- **Delete Highlight**: Click the × button on any highlight card to remove it
- **View Count**: See the total number of saved highlights in the header

## 🎨 Screenshots

### Floating Save Button
When you select text, a beautiful purple gradient button appears with the text "Save Highlight?"

### Popup Interface
The popup shows all your saved highlights in a clean, organized list with:
- Purple gradient header
- Highlight cards with gradient accents
- Easy-to-use delete buttons

## 🛠️ Technical Details

### Architecture

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Content Script**: Injected into all web pages to handle text selection
- **Shadow DOM**: Used for complete isolation from page content (prevents React/framework conflicts)
- **Storage**: Uses Chrome's `chrome.storage.local` API for persistent storage

### File Structure

```
highlight-saver/
├── manifest.json       # Extension configuration
├── content.js          # Content script (runs on web pages)
├── content.css         # Styles for floating button
├── popup.html          # Popup UI structure
├── popup.js            # Popup functionality
└── popup.css           # Popup styles
```

### Permissions

- `storage`: Required to save highlights locally
- `activeTab`: Required to access the current webpage
- `scripting`: Required to inject content scripts
- `<all_urls>`: Required to work on all websites

## 🔧 Troubleshooting

### Button Not Appearing After Text Selection

1. **Reload the Extension**
   - Go to `chrome://extensions/` or `edge://extensions/`
   - Find "Website Highlight Saver"
   - Click the reload icon (circular arrow)

2. **Refresh the Webpage**
   - Press `F5` or `Ctrl+R` to refresh the page
   - Try selecting text again

3. **Check Console for Errors**
   - Press `F12` to open Developer Tools
   - Check the Console tab for any error messages

### "Extension Context Invalidated" Error

This error occurs when the extension is reloaded while you have web pages open.

**Solution**: Simply refresh the webpage (`F5` or `Ctrl+R`) to re-establish the extension context.

### Highlights Not Saving

1. **Check Extension Permissions**
   - Go to `chrome://extensions/` or `edge://extensions/`
   - Find "Website Highlight Saver"
   - Ensure it's enabled

2. **Check Browser Storage**
   - Open Developer Tools (`F12`)
   - Go to Application tab → Storage → Local Storage
   - Check if data is being saved

3. **Try on a Different Website**
   - Some websites may have restrictions
   - Try on a simple website like Wikipedia

### Button Disappears Immediately

- This is normal behavior after saving
- The button shows "✓ Saved!" for 1.5 seconds, then disappears
- If it disappears before you click it, try selecting the text again

## 🐛 Known Issues

- **Extension Reload**: If you reload the extension, you may need to refresh open web pages
- **Very Long Text**: Extremely long text selections may cause slight delays

## 🔮 Future Enhancements

- [ ] Export highlights to JSON/CSV
- [ ] Search functionality within saved highlights
- [ ] Categories/Tags for highlights
- [ ] Sync across devices (optional)
- [ ] Dark mode support
- [ ] Keyboard shortcuts
- [ ] Highlight editing

## 📝 Development

### Prerequisites

- Chrome or Edge browser
- Basic knowledge of JavaScript, HTML, and CSS

### Making Changes

1. Edit the files in the repository
2. Go to `chrome://extensions/` or `edge://extensions/`
3. Click the reload icon on the extension card
4. Test your changes

### Testing

1. Test on various websites (React apps, static sites, etc.)
2. Test with different text selection scenarios
3. Verify storage persistence after browser restart

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Built with vanilla JavaScript (no frameworks required)
- Uses Chrome Extension Manifest V3
- Inspired by the need for a simple, local highlight saving solution

## 📧 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the Troubleshooting section above

---

**Made with ❤️ for researchers, students, and knowledge seekers**

