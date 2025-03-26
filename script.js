// Data structure to hold items
let items = [];
let subtotal = 0;
const taxRate = 0.1; // 10% tax

// DOM Elements
const itemNameInput = document.getElementById('itemName');
const itemPriceInput = document.getElementById('itemPrice');
const itemQtyInput = document.getElementById('itemQty');
const itemsBody = document.getElementById('itemsBody');
const subtotalElement = document.getElementById('subtotal');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');

// Add item to the list
function addItem() {
    const name = itemNameInput.value.trim();
    const price = parseFloat(itemPriceInput.value);
    const qty = parseInt(itemQtyInput.value) || 1;

    if (!name || isNaN(price) || price <= 0) {
        alert('Mohon isi nama barang dan harga dengan benar!');
        return;
    }

    const item = {
        id: Date.now(),
        name,
        price,
        qty
    };

    items.push(item);
    renderItems();
    calculateTotal();
    
    // Clear inputs
    itemNameInput.value = '';
    itemPriceInput.value = '';
    itemQtyInput.value = '1';
    itemNameInput.focus();
}

// Render items in the table
function renderItems() {
    itemsBody.innerHTML = '';
    
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>Rp ${item.price.toLocaleString()}</td>
            <td>
                <button onclick="updateQty(${item.id}, -1)">-</button>
                ${item.qty}
                <button onclick="updateQty(${item.id}, 1)">+</button>
            </td>
            <td>Rp ${(item.price * item.qty).toLocaleString()}</td>
            <td><button class="delete-btn" onclick="removeItem(${item.id})"><i class="fas fa-trash"></i></button></td>
        `;
        itemsBody.appendChild(row);
    });
}

// Update item quantity
function updateQty(id, change) {
    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        items[itemIndex].qty += change;
        
        // Remove if quantity is 0 or less
        if (items[itemIndex].qty <= 0) {
            items.splice(itemIndex, 1);
        }
        
        renderItems();
        calculateTotal();
    }
}

// Remove item from list
function removeItem(id) {
    items = items.filter(item => item.id !== id);
    renderItems();
    calculateTotal();
}

// Calculate totals
function calculateTotal() {
    subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    subtotalElement.textContent = `Rp ${subtotal.toLocaleString()}`;
    taxElement.textContent = `Rp ${tax.toLocaleString()}`;
    totalElement.textContent = `Rp ${total.toLocaleString()}`;
}

// Checkout function
function checkout() {
    if (items.length === 0) {
        alert('Tidak ada item untuk dicetak!');
        return;
    }

    const receipt = generateReceipt();
    printReceipt(receipt);
}

// Generate receipt content
function generateReceipt() {
    let receipt = `
        <div style="font-family: monospace; max-width: 300px; margin: 0 auto;">
            <h2 style="text-align: center;">TOKO KITA</h2>
            <p style="text-align: center;">Jl. Contoh No. 123</p>
            <p style="text-align: center;">Telp: 08123456789</p>
            <hr>
            <p>${new Date().toLocaleString()}</p>
            <hr>
            <table style="width: 100%;">
    `;

    items.forEach(item => {
        receipt += `
            <tr>
                <td>${item.name}</td>
                <td style="text-align: right;">${item.qty} x</td>
                <td style="text-align: right;">Rp ${item.price.toLocaleString()}</td>
                <td style="text-align: right;">Rp ${(item.price * item.qty).toLocaleString()}</td>
            </tr>
        `;
    });

    receipt += `
            </table>
            <hr>
            <p style="text-align: right;">Subtotal: Rp ${subtotal.toLocaleString()}</p>
            <p style="text-align: right;">Pajak (10%): Rp ${(subtotal * taxRate).toLocaleString()}</p>
            <p style="text-align: right; font-weight: bold;">Total: Rp ${(subtotal * (1 + taxRate)).toLocaleString()}</p>
            <hr>
            <p style="text-align: center;">Terima kasih telah berbelanja!</p>
        </div>
    `;

    return receipt;
}

// Print receipt
function printReceipt(content) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Struk Pembelian</title>
                <style>
                    @media print {
                        body { margin: 0; padding: 0; }
                        button { display: none; }
                    }
                </style>
            </head>
            <body>
                ${content}
                <div style="text-align: center; margin-top: 20px;">
                    <button onclick="window.print()">Cetak Struk</button>
                    <button onclick="window.close()">Tutup</button>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    itemNameInput.focus();
});
