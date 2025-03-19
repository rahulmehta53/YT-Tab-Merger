chrome.tabs.onCreated.addListener((tab) => {
    if (!tab.pendingUrl) return; // Ensure URL exists

    const url = new URL(tab.pendingUrl);
    if (url.hostname === "www.youtube.com" && url.pathname === "/watch") {
        const videoId = url.searchParams.get("v");
        const timestamp = url.searchParams.get("t");

        chrome.tabs.query({}, (tabs) => {
            for (let existingTab of tabs) {
                const existingUrl = new URL(existingTab.url);
                if (existingUrl.hostname === "www.youtube.com" && existingUrl.pathname === "/watch") {
                    const existingVideoId = existingUrl.searchParams.get("v");

                    if (existingVideoId === videoId) {
                        // Update timestamp and focus the existing tab
                        chrome.tabs.update(existingTab.id, { active: true, url: tab.pendingUrl });
                        chrome.tabs.remove(tab.id); // Close new tab
                        return;
                    }
                }
            }
        });
    }
});
