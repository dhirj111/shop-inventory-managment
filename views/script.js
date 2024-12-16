document.addEventListener("DOMContentLoaded", () => {
  fetchItems();
  window.addItem = addItem;
  window.buyItem = buyItem;
  // window.toggleCommentSection = toggleCommentSection;



function addItem() {
  const itemName = document.getElementById('itemName').value;
  const description = document.getElementById('description').value;
  const price = document.getElementById('price').value;
  const quantity = document.getElementById('quantity').value;

  axios.post('http://localhost:7000/add-item', {
    itemName: itemName,
    description: description,
    price: price,
    quantity: quantity
  })
  .then(response => {
    console.log('Item added successfully:', response.data);
    fetchItems();
    // Clear input fields
    document.getElementById('itemName').value = '';
    document.getElementById('description').value = '';
    document.getElementById('price').value = '';
    document.getElementById('quantity').value = '';
  })
  .catch(error => {
    console.error('Error adding item:', error);
    alert('Failed to add item');
  });
}

function fetchItems() {
  axios.get('http://localhost:7000/items')
    .then(response => {
      displayItems(response.data);
    })
    .catch(error => {
      console.error('Error fetching items:', error);
    });
}

function buyItem(itemId, buyQuantity) {
  axios.post('http://localhost:7000/buy-item', {
    itemId: itemId,
    quantity: buyQuantity
  })
  .then(response => {
    console.log('Purchase successful:', response.data);
    fetchItems();
  })
  .catch(error => {
    console.error('Error buying item:', error);
    alert('Failed to buy item');
  });
}

function displayItems(items) {
  const itemsContainer = document.getElementById('itemsContainer');
  itemsContainer.innerHTML = ''; // Clear existing items

  items.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('item');
    itemElement.innerHTML = `
      <h3>${item.itemName}</h3>
      <p>Description: ${item.description}</p>
      <p>Price: $${item.price}</p>
      <p>Quantity: ${item.quantity}</p>
      <div class="item-buttons">
        <button onclick="buyItem(${item.id}, 1)">Buy 1</button>
        <button onclick="buyItem(${item.id}, 2)">Buy 2</button>
        <button onclick="buyItem(${item.id}, 3)">Buy 3</button>
      </div>
    `;
    itemsContainer.appendChild(itemElement);
  });
}

// Fetch items on page load

})