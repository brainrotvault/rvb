# Testing Instructions

## Testing the Buy Button Popup

### Step 1: Open index.html
1. Open `index.html` in your browser
2. Look for the **pink "🧪 TEST POPUP" button** in the top-right corner
3. Click it - the popup should appear immediately

### Step 2: Test catalog buttons
1. Scroll down to the catalog section
2. Click any "Buy it now!" button
3. The popup should appear with the item name and price

### Step 3: Check browser console
1. Press F12 to open developer tools
2. Go to the Console tab
3. You should see messages like:
   - "handleBuyClick function registered: function"
   - "Payment popup ready!"
   - When you click a button: "=== handleBuyClick called ==="

### If it doesn't work:
1. Check the console for error messages (red text)
2. Try the test files:
   - Open `debug-buttons.html` - all 3 buttons should work
   - Open `test-popup.html` - the test button should work
3. Hard refresh the page (Ctrl + Shift + R)

---

## Testing the Admin Panel Image Preview

### Step 1: Open admin.html
1. Open `admin.html` in your browser
2. Click on "Add Brainrot" in the left sidebar

### Step 2: Test image preview
1. In the "PNG path" field, type: `./assets/mieteteira.png`
2. As you type, a preview box should appear below
3. If the image exists, you'll see it
4. If it doesn't exist, you'll see "Image not found: [path]"

### Step 3: Add a new brainrot
1. Fill in all the fields:
   - Name: Test Brainrot
   - Rarity: Secret
   - Description: Test item
   - PNG path: `./assets/mieteteira.png`
   - Price: 1000
   - Amount: 1
2. Click "Add Brainrot"
3. Go to "Inventory" tab - your new item should appear
4. Refresh `index.html` - the new item should appear in the catalog

---

## Common Issues

### Popup doesn't appear
- Make sure you hard refreshed (Ctrl + Shift + R)
- Check console for errors
- Try the pink TEST POPUP button first

### Image doesn't show in admin
- Make sure the path starts with `./assets/`
- Make sure the file exists in the assets folder
- Check the file name (no `.png.png`)

### Button clicks don't work
- Open `debug-buttons.html` to test if buttons work at all
- Check if JavaScript is enabled in your browser
- Try a different browser (Chrome recommended)

