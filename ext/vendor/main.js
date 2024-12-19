$(document).ready(function () {
    function updateBalance() {
      // Retrieve the balance from Chrome storage
      chrome.storage.local.get(["balance"], function (result) {
        // Set the balance value, default to 0 if not found in storage
        const balanceValue = result.balance !== undefined ? result.balance : 0;
  
        // Update the element with id="balance"
        $("#balance").text(balanceValue);
        console.log("Balance updated:", balanceValue);
      });
    }
  
    // Call updateBalance immediately when the page loads
    updateBalance();
  
    // Set an interval to update the balance every 1 minute (60000 ms)
    setInterval(updateBalance, 6000);
    $("#withdraw").on("click", function () {
        // Show the modal by removing the 'hidden' class
        $("#alertModal").removeClass("hidden");
    });

    // Event handler for the modal close button
    $("#closeModal").on("click", function () {
        // Hide the modal by adding the 'hidden' class
        $("#alertModal").addClass("hidden");
    });
  });
  