// content.js
// This runs on the web page itself to handle text selection.

let highlightBtn = null;
let shadowHost = null;
let shadowRoot = null;
let isSaving = false; // Flag to prevent button recreation during save

// Helper function to check if extension context is still valid
function isExtensionContextValid() {
  try {
    // Try to access chrome.runtime.id - this will throw if context is invalidated
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.id) {
      return false;
    }
    // Accessing chrome.runtime.id will throw if context is invalidated
    const id = chrome.runtime.id;
    return id !== undefined && id !== null;
  } catch (error) {
    // If accessing chrome.runtime.id throws, context is invalidated
    return false;
  }
}

// Global error handler to catch extension context errors
window.addEventListener('error', (event) => {
  if (event.error && event.error.message && event.error.message.includes('Extension context invalidated')) {
    event.preventDefault(); // Prevent the error from showing in console
    // If we have a button showing, update it with error message
    if (highlightBtn && isSaving) {
      showError("Extension reloaded. Please refresh the page.");
    }
    return true;
  }
}, true);

document.addEventListener("mouseup", (e) => {
  // If the click was inside our shadow DOM or button, ignore this event
  if (
    e.target.id === "whs-save-btn" ||
    (e.target.parentNode && e.target.parentNode.id === "whs-save-btn") ||
    e.target.closest && e.target.closest("#whs-shadow-host")
  ) {
    return;
  }

  // Don't show button if we're in the process of saving
  if (isSaving) {
    return;
  }

  // Small delay to ensure selection is fully established
  setTimeout(() => {
    // Check again if we're saving (might have started during the delay)
    if (isSaving) {
      return;
    }

    const selection = window.getSelection();

    // Remove existing button if it exists
    removeButton();

    // Check if text is selected
    const selectedText = selection.toString().trim();
    if (selectedText.length > 0 && selection.rangeCount > 0) {
      showButton(selection);
    }
  }, 10);
});

function showButton(selection) {
  // Check if selection has a range
  if (selection.rangeCount === 0) {
    return;
  }

  // Check if extension context is valid before showing button
  if (!isExtensionContextValid()) {
    // Don't show button if extension context is invalid
    return;
  }

  try {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Ensure document.body exists
    if (!document.body) {
      console.error("Website Highlight Saver: document.body not found");
      return;
    }

    // Create or reuse shadow host for isolation from React/other frameworks
    if (!shadowHost || !shadowRoot) {
      shadowHost = document.createElement("div");
      shadowHost.id = "whs-shadow-host";
      shadowHost.style.cssText = "position: fixed; top: 0; left: 0; pointer-events: none; z-index: 2147483647;";
      shadowRoot = shadowHost.attachShadow({ mode: 'closed' });
      document.body.appendChild(shadowHost);
    }

    // Create the button inside shadow DOM for complete isolation
    highlightBtn = document.createElement("button");
    highlightBtn.id = "whs-save-btn";
    highlightBtn.innerText = "Save Highlight?";
    highlightBtn.className = "whs-floating-btn";

    // Calculate position (centered above the selection)
    // Use fixed positioning relative to viewport for better reliability
    const buttonWidth = 120; // Approximate button width
    const buttonHeight = 35;
    const offset = 10; // Space above selection
    
    let top = rect.top - buttonHeight - offset;
    let left = rect.left + (rect.width / 2) - (buttonWidth / 2);

    // Ensure button stays within viewport bounds
    if (top < 5) {
      // If too close to top, show below selection instead
      top = rect.bottom + offset;
    }
    if (left < 5) {
      left = 5;
    }
    if (left + buttonWidth > window.innerWidth - 5) {
      left = window.innerWidth - buttonWidth - 5;
    }

    highlightBtn.style.position = "fixed";
    highlightBtn.style.top = `${top}px`;
    highlightBtn.style.left = `${left}px`;
    highlightBtn.style.pointerEvents = "auto";

    // Add click event to save
    const textToSave = selection.toString().trim();
    highlightBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent event bubbling
      e.preventDefault(); // Prevent default behavior
      saveHighlight(textToSave);
    });

    // Inject styles into shadow DOM
    const style = document.createElement("style");
    style.textContent = `
      .whs-floating-btn {
        position: fixed !important;
        z-index: 2147483647 !important;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        color: white !important;
        border: none !important;
        border-radius: 12px !important;
        padding: 10px 18px !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4), 0 4px 8px rgba(0, 0, 0, 0.2) !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        pointer-events: auto !important;
        margin: 0 !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        letter-spacing: 0.3px !important;
      }
      .whs-floating-btn:hover {
        background: linear-gradient(135deg, #764ba2 0%, #667eea 100%) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 12px 24px rgba(102, 126, 234, 0.5), 0 6px 12px rgba(0, 0, 0, 0.3) !important;
      }
      .whs-floating-btn:active {
        transform: translateY(0) !important;
        box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2) !important;
      }
    `;
    shadowRoot.appendChild(style);
    shadowRoot.appendChild(highlightBtn);
  } catch (error) {
    console.error("Website Highlight Saver: Error showing button", error);
  }
}

function removeButton() {
  if (highlightBtn && shadowRoot) {
    try {
      highlightBtn.remove();
    } catch (e) {
      // Fallback if remove() doesn't work
      if (highlightBtn.parentNode) {
        highlightBtn.parentNode.removeChild(highlightBtn);
      }
    }
    highlightBtn = null;
  }
  
  // Clean up shadow host if it exists and is empty
  if (shadowHost && shadowRoot && shadowRoot.children.length === 0) {
    try {
      shadowHost.remove();
      shadowHost = null;
      shadowRoot = null;
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

function saveHighlight(text) {
  // Set flag to prevent button recreation
  isSaving = true;

  // Clear the text selection to prevent it from showing the button again
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  }

  // Check if extension context is valid BEFORE any chrome API calls
  if (!isExtensionContextValid()) {
    showError("Extension reloaded. Please refresh the page.");
    return;
  }

  const data = {
    id: Date.now(),
    text: text,
    url: window.location.href,
    title: document.title,
    date: new Date().toLocaleDateString(),
  };

  // Wrap everything in try-catch to catch any synchronous errors
  try {
    // Double-check context validity
    if (!isExtensionContextValid()) {
      showError("Extension reloaded. Please refresh the page.");
      return;
    }

    // Get existing highlights, add new one, save back
    // Use try-catch around the callback to catch any errors
    try {
      chrome.storage.local.get({ highlights: [] }, (result) => {
        // Check for runtime errors (extension context invalidated)
        if (chrome.runtime.lastError) {
          showError("Extension reloaded. Please refresh the page.");
          return;
        }

        // Check context validity again inside callback
        if (!isExtensionContextValid()) {
          showError("Extension reloaded. Please refresh the page.");
          return;
        }

        try {
          const highlights = result.highlights || [];
          highlights.unshift(data); // Add to beginning of array

          chrome.storage.local.set({ highlights: highlights }, () => {
            // Check for runtime errors again
            if (chrome.runtime.lastError) {
              showError("Failed to save. Please try again.");
              return;
            }

            // Visual feedback
            if (highlightBtn) {
              highlightBtn.innerText = "✓ Saved!";
              highlightBtn.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
              highlightBtn.style.boxShadow = "0 8px 16px rgba(16, 185, 129, 0.4), 0 4px 8px rgba(0, 0, 0, 0.2)";
              
              // Remove button after showing success message
              setTimeout(() => {
                removeButton();
                // Reset flag after a short delay to allow for any pending events
                setTimeout(() => {
                  isSaving = false;
                }, 100);
              }, 1500);
            } else {
              // If button was already removed, just reset the flag
              setTimeout(() => {
                isSaving = false;
              }, 100);
            }
          });
        } catch (error) {
          // Catch any errors in the callback
          if (error.message && error.message.includes("Extension context invalidated")) {
            showError("Extension reloaded. Please refresh the page.");
          } else {
            console.error("Website Highlight Saver: Error saving highlight", error);
            showError("Failed to save. Please try again.");
          }
        }
      });
    } catch (error) {
      // Catch errors when calling chrome.storage.local.get
      if (error.message && error.message.includes("Extension context invalidated")) {
        showError("Extension reloaded. Please refresh the page.");
      } else {
        throw error; // Re-throw if it's a different error
      }
    }
  } catch (error) {
    // Catch any synchronous errors
    if (error.message && error.message.includes("Extension context invalidated")) {
      showError("Extension reloaded. Please refresh the page.");
    } else {
      console.error("Website Highlight Saver: Unexpected error", error);
      showError("Failed to save. Please try again.");
    }
  }
}

function showError(message) {
  if (highlightBtn) {
    highlightBtn.innerText = "⚠ Error";
    highlightBtn.style.background = "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
    highlightBtn.style.boxShadow = "0 8px 16px rgba(239, 68, 68, 0.4), 0 4px 8px rgba(0, 0, 0, 0.2)";
    
    // Show error message as title attribute
    highlightBtn.title = message;
    
    // Remove button after showing error
    setTimeout(() => {
      removeButton();
      setTimeout(() => {
        isSaving = false;
      }, 100);
    }, 2000);
  } else {
    // If button doesn't exist, just reset the flag
    setTimeout(() => {
      isSaving = false;
    }, 100);
  }
}
