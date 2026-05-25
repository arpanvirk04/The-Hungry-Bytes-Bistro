document.addEventListener("DOMContentLoaded", () => {
    // Validate Order Form
    const orderForm = document.getElementById("orderForm");
    if (orderForm) {
      orderForm.addEventListener("submit", (e) => {
        const customerName = document.getElementById("customerName").value.trim();
        const deliveryAddress = document.getElementById("deliveryAddress").value.trim();
        const items = document.getElementById("items").selectedOptions;
  
        if (!customerName || !deliveryAddress || items.length === 0) {
          e.preventDefault(); // Stop form submission
          alert("Please fill in your name, address, and select at least one menu item.");
        }
      });
    }
  
    // Validate Order Status Form
    const orderStatusForm = document.getElementById("orderStatusForm");
    if (orderStatusForm) {
      orderStatusForm.addEventListener("submit", (e) => {
        const orderId = document.getElementById("orderId").value.trim();
  
        if (!orderId) {
          e.preventDefault(); // Stop form submission
          alert("Please enter a valid Order ID.");
        }
      });
    }
  });

  