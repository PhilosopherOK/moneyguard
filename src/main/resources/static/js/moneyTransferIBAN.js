window.onload =function(){
    let herokuLink = ''

    let urlGetMineCurrencyRequest = herokuLink + '/moneyTransfer/getMineCurrency'
    let urlPostIBANTransferRequest = herokuLink + '/moneyTransfer/IBANTransfer'

    const csrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, '$1');

    let myCurrencyList = document.querySelector('.currencyList');
    let transferAmount = document.querySelector('#transferAmount');
    let toIBAN = document.querySelector('#toIBAN');
    
    fetch(urlGetMineCurrencyRequest, {
        method: 'GET',
        headers: {
        'X-XSRF-TOKEN': csrfToken
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json()
    })
    .then(response => {
        let currencyItems = response.data;
        if (currencyItems.length > 0) {
            currencyItems.forEach(item => {
                let option = document.createElement('option');
                option.textContent = item;
                option.value = item;
                myCurrencyList.appendChild(option);
            })
        }
    })
    .catch(error => {
        console.error('Помилка:', error);
    });
    
    document.getElementById('currencyForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        fetch(urlPostIBANTransferRequest, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({
                "currencyName": myCurrencyList.value,
                "toIBAN": toIBAN.value,
                "transferAmount": transferAmount.value
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(response => {
            console.log('Успішна відповідь:', response);
            const modalBody = document.querySelector('#staticBackdrop .modal-body p');
            modalBody.textContent = response.message;
            const myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
            myModal.show();
        })
        .catch(error => {
            console.error('Failed to load data:', error);
            const modalBody = document.querySelector('#staticBackdrop .modal-body p');
            modalBody.textContent = 'Network error. Try again.'
            const myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
            myModal.show();
        });
    });
    }
