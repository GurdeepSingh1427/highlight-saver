// popup.js
document.addEventListener("DOMContentLoaded", loadHighlights);

function loadHighlights() {
  chrome.storage.local.get({ highlights: [] }, (result) => {
    renderList(result.highlights);
  });
}

function renderList(highlights) {
  const list = document.getElementById("highlight-list");
  const emptyState = document.getElementById("empty-state");
  const countSpan = document.getElementById("count");

  list.innerHTML = "";
  countSpan.innerText = `${highlights.length} saved`;

  if (highlights.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  } else {
    emptyState.classList.add("hidden");
  }

  highlights.forEach((item) => {
    const li = document.createElement("li");
    li.className = "highlight-card";

    // Content Container
    const contentDiv = document.createElement("div");

    // The highlighted text
    const textP = document.createElement("p");
    textP.className = "highlight-text";
    textP.textContent = `"${item.text}"`;

    // Metadata (Title + Link)
    const metaDiv = document.createElement("div");
    metaDiv.className = "highlight-meta";

    const link = document.createElement("a");
    link.href = item.url;
    link.target = "_blank";
    link.textContent =
      item.title.length > 30 ? item.title.substring(0, 30) + "..." : item.title;

    const dateSpan = document.createElement("span");
    dateSpan.textContent = ` • ${item.date}`;

    metaDiv.appendChild(link);
    metaDiv.appendChild(dateSpan);

    contentDiv.appendChild(textP);
    contentDiv.appendChild(metaDiv);

    // Delete Button
    const delBtn = document.createElement("button");
    delBtn.innerHTML = "&times;";
    delBtn.className = "delete-btn";
    delBtn.title = "Delete Highlight";
    delBtn.onclick = () => deleteHighlight(item.id);

    li.appendChild(contentDiv);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

function deleteHighlight(id) {
  chrome.storage.local.get({ highlights: [] }, (result) => {
    const updatedHighlights = result.highlights.filter((h) => h.id !== id);

    chrome.storage.local.set({ highlights: updatedHighlights }, () => {
      renderList(updatedHighlights);
    });
  });
}
