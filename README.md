# 🎈 Luxury Birthday Surprise Web Application

A premium, interactive, and beautifully designed birthday web presentation crafted with modern aesthetics. It provides a highly personalized, celebratory experience with multiple active sections: an unlocking gateway, an auto-typing emotional letter, a 3D memory lane deck, a balloon popping mini-game, and a 3D gift box container that triggers confetti explosions and reveals a gift coupon!

---

## ✨ Features

1. **Magical Lock Screen:** The entrance is code-protected (default: `1234`) with customizable hint texts or an instant "Magic Skip" option.
2. **Ambient Particle Canvas:** High-frame-rate translucent floating backing bubbles that drift across the screen.
3. **Web Audio Synthesizer (No Dependencies):** Plays the "Happy Birthday" melody in a warm music-box timbral sweep, alongside pop sound effects for balloon pops and a chord fanfare for the gift unwrap. 
4. **Heartfelt Letter:** Automatically typing letter block utilizing custom timing rules.
5. **3D Memory Carousel:** Interactive card deck stacked in a depth hierarchy (`scale`, `z-index`, `rotation`) portraying shared photos.
6. **Balloon Pop Game:** A canvas/SVG-based game screen where balloons float upward. Popping them gives points and fires a randomized text wish toast overlay.
7. **3D Gift Box & Confetti Physics:** Clicking the 3D-styled CSS gift box pops the lid off, collapses the container, fires dozens of physics-driven falling paper confetti stripes, and slides open the gift voucher.
8. **Built-in Builder Mode (Settings Drawer):** Accessible directly through the gear icon. Creator can update recipient details, passcode credentials, themes, messages, images, and coupon descriptions. Saves immediately to `localStorage` and supports exporting/importing JSON profiles.

---

## 🎨 Themes Support

The website implements four handcrafted color schemes customized for varying aesthetics:
*   🌌 **Royal Magic:** Luxury Deep Purple and Vibrant Gold accents (default).
*   🌸 **Rose Gold Romance:** Elegant Blush Pink and Champagne color details.
*   ⚡ **Neon Sunset:** Cyberpunk Neon Cyan and Magenta glows.
*   🍃 **Cozy Forest:** Cozy Warm Olive, Peach Coral, and Amber highlights.

---

## 🚀 How to Run Locally

Since this application is built with vanilla HTML, CSS, and JS:
1. Open the folder `birthday_surprise`.
2. Double-click or open **`index.html`** in any modern desktop or mobile web browser. 
3. *Alternatively*, run a local static server (e.g. `npx http-server` or `python -m http.server`) inside the folder to access it via `http://localhost`.

---

## 🛠️ How to Customize and Share

1. Open the page in your browser.
2. Tap the **Gear Icon ⚙️** at the bottom-right corner to open the **Surprise Creator Panel**.
3. Customize the fields: Recipient's Name, Age, Passcode Gate, Letter, 4 Memory Cards (use standard image URLs from Unsplash, Imgur, or direct links), Balloon pop wishes, and coupon details.
4. Click **Save Customization 💾** to apply the changes instantly.
5. Click **Export Config JSON 📤** to download your custom settings to your computer as a `.json` file.
6. To share this customized site with your friend:
    *   **Method A (Recommended):** Send them the `birthday_surprise` folder along with your exported `.json` configuration file, and ask them to import the JSON file in the creator panel.
    *   **Method B (Staged/Static):** Open `config.js` and paste your exported JSON settings directly into the `defaultBirthdayConfig` object! This commits your custom wishes permanently so they load out-of-the-box on any browser without needing to import anything.
