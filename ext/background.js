// Function to generate a random ID in the format xxxxx-xxxxx
function generateRandomID() {
    return `${generateSegment()}-${generateSegment()}`;
}

// Helper function to generate a segment of 5 random characters
function generateSegment() {
    return Math.random().toString(36).substring(2, 7);
}

// Listener for when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed!");

    // Check if an ID already exists
    chrome.storage.local.get("userID", (data) => {
        if (data.userID) {
            console.log("Existing userID found:", data.userID);
        } else {
            // Generate and store a new ID if none exists
            const newUserID = generateRandomID();
            chrome.storage.local.set({ userID: newUserID }, () => {
                console.log("New userID generated and saved:", newUserID);
            });
        }
    });
});

const rpcUrl = "https://api.xread.io/";

// Debugging log
console.log("Service Worker is running!");

/**
 * Sends user data to the server and handles the response
 */
function sendUserDataToServer() {
    chrome.storage.local.get(["userID"], (result) => {
        if (result.userID) {
            const publicKey = result.userID;

            fetch(`${rpcUrl}/sendData?userID=${publicKey}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "omit", // Use 'omit' for credentials unless required
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("Server response:", data);
                    if (data.balance !== undefined) {
                        // Save the balance in Chrome storage
                        chrome.storage.local.set({ balance: data.balance }, () => {
                            console.log("Balance saved:", data.balance);
                        });
                    } else {
                        console.log("No balance found in server response.");
                    }
                })
                .catch((error) => {
                    console.error("Error connecting to server:", error.message || error);
                });
        } else {
            console.log("No userID found in storage.");
        }
    });
}

// Interval to send data to the server every second
setInterval(() => {
    console.log("Interval triggered, sending data to server...");
    sendUserDataToServer();
}, 60000);
