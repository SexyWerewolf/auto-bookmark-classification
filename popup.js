document.addEventListener("DOMContentLoaded", () => {
    loadFolders();
    const folderSelect = document.getElementById("folderSelect");
    const folderNameInput = document.getElementById("folderName");
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const url = tabs[0].url;
        const title = tabs[0].title;
        browser.runtime.sendMessage({
            action: "getFolderForDomain",
            url
        }).then((response) => {
            if (response.folderName) {
                folderNameInput.value = response.folderName;
                folderSelect.value = response.folderName;
            }
        });
        document.getElementById("saveButton").addEventListener("click", () => {
            const folderName = folderNameInput.value;
            browser.runtime.sendMessage({
                action: "saveBookmark",
                url,
                title,
                folderName
            }).then((response) => {
                if (response.success) {
                    window.close();
                }
            });
        });
    });
    folderSelect.addEventListener("change", () => {
        folderNameInput.value = folderSelect.value;
    });
});
function loadFolders() {
    browser.bookmarks.getTree().then((bookmarks) => {
        const folderSelect = document.getElementById("folderSelect");
        function addFolders(bookmarkNodes, depth = 0) {
            for (const node of bookmarkNodes) {
                if (node.type === "folder" && node.title) {
                    const option = document.createElement("option");
                    option.value = node.title;
                    option.textContent = ' '.repeat(depth * 2) + node.title;
                    folderSelect.appendChild(option);
                }
                if (node.children) {
                    addFolders(node.children, depth + 1);
                }
            }
        }
        addFolders(bookmarks);
    });
}