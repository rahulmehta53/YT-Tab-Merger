// chrome.tabs.onCreated.addListener(async (newTab) => {
//     if (!newTab.pendingUrl) return; // Ignore tabs without a URL

//     const url = new URL(newTab.pendingUrl);
//     if (url.hostname === "www.youtube.com" && url.pathname === "/watch") {
//         const videoId = url.searchParams.get("v");
//         const timestamp = url.searchParams.get("t");

//         // Find existing YouTube tabs
//         const tabs = await chrome.tabs.query({});
//         for (let tab of tabs) {
//             if (!tab.url) continue;
//             const existingUrl = new URL(tab.url);

//             if (
//                 existingUrl.hostname === "www.youtube.com" &&
//                 existingUrl.pathname === "/watch" &&
//                 existingUrl.searchParams.get("v") === videoId
//             ) {
//                 // Update timestamp in existing tab
//                 existingUrl.searchParams.set("t", timestamp || "0");
//                 chrome.tabs.update(tab.id, { active: true, url: existingUrl.toString() });

//                 // Close the newly opened tab
//                 chrome.tabs.remove(newTab.id);
//                 return;
//             }
//         }
//     }
// });


//v2
// chrome.tabs.onCreated.addListener(async (newTab) => {
//     if (!newTab.pendingUrl) return; // Ignore tabs without a URL

//     const url = new URL(newTab.pendingUrl);
//     if (url.hostname === "www.youtube.com" && url.pathname === "/watch") {
//         const videoId = url.searchParams.get("v");
//         const timestamp = url.searchParams.get("t") || "0";

//         // Find an existing tab with the same video
//         const tabs = await chrome.tabs.query({});
//         for (let tab of tabs) {
//             if (!tab.url) continue;
//             const existingUrl = new URL(tab.url);

//             if (
//                 existingUrl.hostname === "www.youtube.com" &&
//                 existingUrl.pathname === "/watch" &&
//                 existingUrl.searchParams.get("v") === videoId
//             ) {
//                 // Update timestamp in existing tab
//                 existingUrl.searchParams.set("t", timestamp);
//                 chrome.tabs.update(tab.id, { active: true, url: existingUrl.toString() });

//                 // Close the newly opened tab
//                 chrome.tabs.remove(newTab.id);
//                 return;
//             }
//         }
//     }
// });


//v3
chrome.tabs.onCreated.addListener(async (newTab) => {
    if (!newTab.pendingUrl) return;

    const url = new URL(newTab.pendingUrl);
    if (url.hostname === "www.youtube.com" && url.pathname === "/watch") {
        const videoId = url.searchParams.get("v");
        const timestamp = url.searchParams.get("t") || "0";

        // Find an existing tab with the same video
        const tabs = await chrome.tabs.query({});
        for (let tab of tabs) {
            if (!tab.url) continue;
            const existingUrl = new URL(tab.url);

            if (
                existingUrl.hostname === "www.youtube.com" &&
                existingUrl.pathname === "/watch" &&
                existingUrl.searchParams.get("v") === videoId
            ) {
                // Switch to existing tab
                chrome.tabs.update(tab.id, { active: true });

                // Inject JavaScript to update timestamp without reloading
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: updateVideoTimestamp,
                    args: [timestamp]
                });

                // Close the newly opened tab
                chrome.tabs.remove(newTab.id);
                return;
            }
        }
    }
});

// Function to update the video timestamp
function updateVideoTimestamp(timestamp) {
    const player = document.querySelector("video");
    if (player) {
        player.currentTime = parseInt(timestamp, 10); // Jump to the correct timestamp
    }

    // Update the URL in the browser without reloading
    const url = new URL(window.location.href);
    url.searchParams.set("t", timestamp);
    history.replaceState(null, "", url.toString());
}
