const tbody = document.querySelector('tbody');
const totalQuantity = document.querySelector('#total-quantity');
const totalPrice = document.querySelector('#total-price');

let quantity = 0;
let price = 0;

function updateTotals() {
  totalQuantity.textContent = quantity;

  totalPrice.textContent = convertToComma(price);
}

let URL = 'https://rms-project-yt.github.io/';

async function sendRequest(value, response) {
  try {
    const data = await fetch(`${URL}${value}`);

    if (!data.ok) {
      throw new Error('Erro na solicitação da API.');
    }

    const values = await data.json();

    response(values);
  } catch {
    console.error(error);
    alert(`${error}\nNão foi possível obter os dados.`);
  }
}

function addProduct() {
  sendRequest('products/data.json', (data) => {
    data.products.forEach((product) => {
      const tr = document.createElement('tr');
      tr.id = product.id;
      tr.classList.add('products-table__row');

      tr.innerHTML = `
			<td class="products-table__cell">
				<figure class="products-table__figure center">
					<img class="figure__image" src=${product.image} alt="Product">
				</figure>
			</td>

			<td class="products-table__cell">${product.name}</td>

			<td class="products-table__cell unit_price">${convertToComma(
        product.unitPrice,
      )}</td>

			<td class="products-table__cell total_price">${convertToComma(
        product.unitPrice * product.quantity,
      )}</td>

			<td class="products-table__cell quantity">
				<button class="products-table__button button--decrement">-</button>
				<span class="products-table__quantity">${product.quantity}</span>
				<button class="products-table__button button--increment">+</button>
			</td>

			<td class="products-table__cell">
			  <button class="products-table__button button--delete material-symbols-outlined">delete</button>
			</td>
			`;

      tbody.appendChild(tr);

      quantity++;

      price += product.unitPrice * product.quantity;
      updateTotals();

      const increaseButton = tr.querySelector('.button--increment');
      increaseButton.addEventListener('click', increaseQuantity);

      const reduceButton = tr.querySelector('.button--decrement');
      reduceButton.addEventListener('click', reduceQuantity);

      const deleteButton = tr.querySelector('.button--delete');
      deleteButton.addEventListener('click', removeProduct);
    });

    let total = roundToNearest(price, 2);
    price = total;
  });
}

function roundToNearest(value, precision) {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

function convertToComma(value) {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

function convertToPoint(value) {
  let string = value.replace('R$ ', '');
  return parseFloat(string.replace(',', '.'));
}

function increaseQuantity(event) {
  const tr = event.target.closest('tr');

  const quantitySpan = tr.querySelector('.products-table__quantity');

  const unitPrice = convertToPoint(tr.querySelector('.unit_price').textContent);

  let total = price + unitPrice;
  price = roundToNearest(total, 2);

  let totalPrice = tr.querySelector('.total_price');

  totalPrice.textContent = convertToComma(
    convertToPoint(totalPrice.textContent) + unitPrice,
  );

  let newQuantity = parseInt(quantitySpan.textContent) + 1;

  quantitySpan.textContent = newQuantity;

  ++quantity;

  updateTotals();
}

function reduceQuantity(event) {
  const tr = event.target.closest('tr');

  const quantitySpan = tr.querySelector('.products-table__quantity');

  if (quantitySpan.textContent != '1') {
    const unitPrice = convertToPoint(
      tr.querySelector('.unit_price').textContent,
    );

    let total = price - unitPrice;
    price = roundToNearest(total, 2);

    let totalPrice = tr.querySelector('.total_price');

    totalPrice.textContent = convertToComma(
      convertToPoint(totalPrice.textContent) - unitPrice,
    );

    let newQuantity = parseInt(quantitySpan.textContent) - 1;

    quantitySpan.textContent = newQuantity;

    --quantity;

    updateTotals();
  }
}

function removeProduct(event) {
  const tr = event.target.closest('tr');

  quantity -= parseInt(
    tr.querySelector('.products-table__quantity').textContent,
  );

  const totalProduct = convertToPoint(
    tr.querySelector('.total_price').textContent,
  );

  let total = price - totalProduct;
  price = roundToNearest(total, 2);

  updateTotals();

  tbody.removeChild(tr);
}

const sendButton = document.querySelector('.send__button');
sendButton.addEventListener('click', sendProducts);

function sendProducts() {
  const tableRows = document.querySelectorAll('.products-table tr');
  const tableHeaders = document.querySelectorAll('.products-table th');
  const data = [];

  for (let i = 1; i < tableRows.length; i++) {
    const tableCells = tableRows[i].querySelectorAll('td');
    const obj = {};
    for (let j = 1; j < tableCells.length - 1; j++) {
      obj[tableHeaders[j].textContent] = tableCells[j].textContent;
    }
    data.push(obj);
  }

  console.log(data);
}

addProduct();
