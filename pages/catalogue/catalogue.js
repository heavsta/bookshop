let cart = [];
let total = 0;

document.addEventListener('DOMContentLoaded', () => {
    const fragment = document.createDocumentFragment();

    const main = document.createElement('main');
    const body = document.querySelector('body');
    body.classList.add('container');
    
    const header = document.createElement('header');
    const heading = document.createElement('h1');
    heading.innerText = 'Our Catalogue';
    header.appendChild(heading);
    main.appendChild(header);

    const catalogue = document.createElement('div');
    catalogue.setAttribute('id', 'catalogue');
    main.appendChild(catalogue);

    const aside = document.createElement('aside');
    aside.setAttribute('id', 'cart');
    const asideHeading = document.createElement('h2');
    asideHeading.innerText = `Cart (${total}€)`;
    aside.appendChild(asideHeading);
    const cartItems = document.createElement('div');
    cartItems.setAttribute('id', 'cart-items');
    aside.appendChild(cartItems);

    fetch('../../books.json') //path to the file with json data
        .then(response => {
            return response.json();
        })
        .then(books => {
            for (let i = 0; i < books.length; i++) {
                createBookItem(books[i], i, catalogue);
            }
        });

    fragment.appendChild(main);
    fragment.appendChild(aside);
    body.appendChild(fragment);
});

function createBookItem(book, id, catalogue) {
    // Create each element of bookItem
    const title = document.createElement('h2');
    title.innerText = book.title;
    const author = document.createElement('h3');
    author.innerText = book.author;
    const price = document.createElement('p');
    price.innerText = `Price: ${book.price}€`;
    const showMoreBtn = document.createElement('button');
    showMoreBtn.innerText = 'Show more';
    showMoreBtn.classList.add('btn');
    showMoreBtn.addEventListener('click', toggleModal);

    // Book Modal
    const modal =  document.createElement('div');
    modal.classList.add('modal');
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modal.appendChild(modalContent);
    modal.addEventListener('click', hideOnClick);
    const closeBtn = document.createElement('span');
    closeBtn.classList.add('close-btn');
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', e => e.target.parentElement.parentElement.classList.remove('active'));
    modalContent.appendChild(closeBtn);
    const description = document.createElement('p');
    description.innerText = book.description;
    description.classList.add('description');
    modalContent.appendChild(description);
    const addBtn = document.createElement('button');
    addBtn.innerText = 'Add';
    addBtn.classList.add('btn');
    addBtn.addEventListener('click', modifyCart);
    const img = document.createElement('img');
    img.src = book.imageLink;
    img.alt = book.title;

    // Create BookItem and append elements
    let bookItem = document.createElement('div');
    bookItem.classList.add('book-item');
    bookItem.setAttribute('id', id);
    bookItem.appendChild(img);
    bookItem.appendChild(title);
    bookItem.appendChild(author);
    bookItem.appendChild(price);
    bookItem.appendChild(showMoreBtn);
    bookItem.appendChild(modal);
    bookItem.appendChild(addBtn);

    // Append BookItem
    catalogue.appendChild(bookItem);
}

function createCartItem(id) {
    fetch('../../books.json')
        .then(response => {
            return response.json();
        })
        .then(books => {
            let index = cart.findIndex(book => book.title === books[id].title);
            index === -1 ? cart.push(books[id]) : cart.splice(index, 1);
            updateCartUI();
            updateTotal();
        });
}

function hideOnClick(e) {
    if (e.target.contains(e.target.firstElementChild)) {
        e.target.classList.remove('active');
    }
}

function modifyCart(e) {
    // Toggle visual btn
    e.target.innerText === 'Add' ? e.target.innerText = 'Remove' : e.target.innerText = 'Add';
    // Add/Remove to cart
    const id = e.target.parentElement.id;
    createCartItem(id);
}

function toggleModal(e) {
    e.target.nextElementSibling.classList.toggle('active');
}

function updateCartUI() {
    document.getElementById('cart-items').innerHTML = '';
    for (let book of cart) {
        // Create each element of cartItem
        const closeBtn = document.createElement('span');
        closeBtn.classList.add('close-btn');
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', removeFromCart);
        const itemTitle = document.createElement('span');
        itemTitle.classList.add('item-title');
        itemTitle.innerText = book.title;
        const itemAuthor = document.createElement('span');
        itemAuthor.classList.add('item-author');
        itemAuthor.innerText = book.author;
        const itemPrice = document.createElement('span');
        itemPrice.classList.add('item-price');
        itemPrice.innerText = `${book.price} €`;
        
        // Create cartItem and append children
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.appendChild(closeBtn);
        cartItem.appendChild(itemTitle);
        cartItem.appendChild(itemAuthor);
        cartItem.appendChild(itemPrice);

        // Append cartItem to #cart-items
        document.getElementById('cart-items').appendChild(cartItem);
    }

    // Confirm order Btn
    const confirmOrderBtn = document.createElement('button');
    confirmOrderBtn.classList.add('btn');
    confirmOrderBtn.innerText = 'Confirm Order';
    confirmOrderBtn.addEventListener('click', confirmOrder);
    if (cart.length > 0) { 
        document.getElementById('cart-items').appendChild(confirmOrderBtn);
    }
}

function removeFromCart(e) {
    const bookTitle = e.target.nextElementSibling.innerText;
    const index = cart.findIndex(book => book.title === bookTitle);
    cart.splice(index, 1);
    updateCartUI();
    updateTotal();

    // Update Add/Remove btn from catalogue
    let catalogue = document.getElementById('catalogue');
    let divs = catalogue.childNodes;
    for (let div of divs) {
        let h2 = div.firstElementChild.nextElementSibling;
        if (h2.innerText === bookTitle) {
            div.lastElementChild.innerText = 'Add';
            break;
        }
    }
}

function updateTotal() {
    total = 0;
    for (let book of cart) {
        total += book.price;
    }
    // Update UI
    const aside = document.getElementById('cart');
    aside.firstElementChild.innerText = `Cart (${total}€)`;
}

function confirmOrder() {
    // Save in local Storage
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('total', total);
    console.log(JSON.parse(localStorage.getItem('cart')));
    console.log(localStorage.getItem('total'));

    // Move to order form
    location.href = '../order/index.html';
}