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

    const flat = document.getElementById('flat');
    flat.addEventListener(
        'focusout',
        e => checkInputValidity(e.target, /^[1-9]+[0-9-]*$/, 'Positive numbers only - dash not allowed as 1st char')
    );

    // Preventing choosing past date
    const delivery = document.getElementById('delivery');
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate()+1);
    tomorrow = tomorrow.toISOString().split('T')[0];
    console.log(tomorrow);
    delivery.setAttribute('min', tomorrow);
    // In case min attr not working
    delivery.addEventListener('change', e => {
        e.target.value < tomorrow
            ? delivery.classList.add('invalid')
            : delivery.classList.remove('invalid');   
    });

    // Form checkboxes
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    for (let checkbox of checkboxes) {
        checkbox.addEventListener('click', checkGiftLimit);
    }

    // Submit button
    const submit = document.querySelector('input[type="submit"]');
    submit.addEventListener('click', submitForm);
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
    const flat = document.getElementById('flat').value;
    const delivery = document.getElementById('delivery').value;
    let today = new Date().toISOString().split('T')[0];
    const paymentMethod = document.querySelector('input[name="payment"]:checked');

    if (
        name.match(/^[A-Za-z]{4,}$/) &&
        surname.match(/^[A-Za-z]{5,}$/) &&
        street.match(/^[a-zA-Z0-9.-\s]{5,}$/) &&
        house.match(/^[1-9]+[0-9]*$/) &&
        flat.match(/^[1-9]+[0-9-]*$/) &&
        delivery > today &&
        paymentMethod !== null
    ) {
        return true;
    }

    return false;
}

function checkGiftLimit() {
    const nonChecked = document.querySelectorAll('input[type="checkbox"]:not(:checked)');
    if (nonChecked.length <= 2) {
        for (let checkbox of nonChecked) {
            checkbox.disabled = true;
        }
    } else {
        for (let checkbox of nonChecked) {
            checkbox.disabled = false;
        }
    }
}

function submitForm(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const street = document.getElementById('street').value;
    const house = document.getElementById('house').value;
    const flat = document.getElementById('flat').value;
    const payment = document.querySelector('input[name="payment"]:checked').value;
    const gifts = document.querySelectorAll('input[type="checkbox"]:checked');

    let output = `
    <h2>Order Confirmed!</h2>
    <p>Delivery address: ${street}, house n°${house}, flat n°${flat}</p>
    <p>Recipient: ${name} ${surname}<p>
    <p>Payment method: ${payment}<p>
    `;

    if (gifts[0] && gifts[1]) {
        output += `<p>Gifts: ${gifts[0].name} and ${gifts[1].name}!</p>
        <p>Thank you for your Order!</p>
        `;
    } else if (gifts[0]) {
        output += `<p>Gifts: ${gifts[0].name}!</p>
        <p>Thank you for your Order!</p>
        `;
    } else {
        output += `<p>Thank you for your Order!</p>`;
    }

    document.querySelector('form').style.display = 'none';
    document.getElementById('summary').innerHTML = output;
}