let cart = JSON.parse(localStorage.getItem('cart'));
let total = localStorage.getItem('total');

document.addEventListener('DOMContentLoaded', () => {
    const orderList = document.getElementById('order-list');
    for (let book of cart) {
        const orderImg = document.createElement('img');
        orderImg.setAttribute('src', book.imageLink);
        orderImg.setAttribute('alt', book.title);
        const orderTitle = document.createElement('h3');
        orderTitle.innerText = book.title;
        const orderAuthor = document.createElement('p');
        orderAuthor.innerText = book.author;
        const orderPrice = document.createElement('p');
        orderPrice.innerText = `${book.price}€`;

        const orderItem = document.createElement('div');
        orderItem.classList.add('order-item');
        orderItem.appendChild(orderImg);
        orderItem.appendChild(orderTitle);
        orderItem.appendChild(orderAuthor);
        orderItem.appendChild(orderPrice);

        orderList.appendChild(orderItem);
    }
    
    document.getElementById('total').firstElementChild.innerText = `Total: ${total}€`;

    // Form
    const form = document.querySelector('form');
    const submitBtn = document.querySelector('input[type="submit"]');
    form.addEventListener('change', () => {
        submitBtn.disabled = !checkFormValidity();
    });

    // Form regex-s
    const name = document.getElementById('name');
    name.addEventListener(
        'focusout',
        e => checkInputValidity(e.target, /^[A-Za-z]{4,}$/, '4 chars minimum - only letters allowed')
    );  

    const surname = document.getElementById('surname');
    surname.addEventListener(
        'focusout',
        e => checkInputValidity(e.target, /^[A-Za-z]{5,}$/, '5 chars minimum - only letters allowed')
    );

    const street = document.getElementById('street');
    street.addEventListener(
        'focusout',
        e => checkInputValidity(e.target, /^[a-zA-Z0-9.-\s]{5,}$/, '5 chars minimum (including spaces)')
    );

    const house = document.getElementById('house');
    house.addEventListener(
        'focusout',
        e => checkInputValidity(e.target, /^[1-9]+[0-9]*$/, 'Positive numbers only')
    );

    // Preventing choosing past date
    const delivery = document.getElementById('delivery');
    let today = new Date().toISOString().split('T')[0];
    delivery.setAttribute('min', today);
    // In case min attr not working
    delivery.addEventListener('change', e => {
        e.target.value < today
            ? delivery.classList.add('invalid')
            : delivery.classList.remove('invalid');   
    });
});

function checkInputValidity(el, regex, errMsg) {
    if (!el.value.match(regex)) {
        el.classList.add('invalid');
        el.nextElementSibling.innerText = errMsg;
    } else {
        el.classList.remove('invalid');
        el.nextElementSibling.innerText = '';
    }
}

function checkFormValidity() {
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const street = document.getElementById('street').value;
    const house = document.getElementById('house').value;
    const delivery = document.getElementById('delivery').value;
    let today = new Date().toISOString().split('T')[0];
    const paymentMethod = document.querySelector('input[name="payment"]:checked');

    if (
        name.match(/^[A-Za-z]{4,}$/) &&
        surname.match(/^[A-Za-z]{5,}$/) &&
        street.match(/^[a-zA-Z0-9.-\s]{5,}$/) &&
        house.match(/^[1-9]+[0-9]*$/) &&
        delivery >= today &&
        paymentMethod !== null
    ) {
        return true;
    }

    return false;
}