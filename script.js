const defaultStock = [
    { name: "Bugatti Mistral", price: 3000000, img: "images/bugatti.jpg" },
    { name: "Lamborghini Revuelto", price: 500000, img: "images/lamborghini.jpg" },
    { name: "Ferrari SF90 Spider", price: 400000, img: "images/ferrari.jpg" },
    { name: "Koenigsegg Jesko", price: 3200000, img: "images/koenigsegg.jpg" },
    { name: "Pagani Utopia", price: 2500000, img: "images/pagani.jpg" },
    { name: "Maserati MC20 Cielo", price: 150000, img: "images/maserati.jpg" },
    { name: "Bentley Flying Spur", price: 250000, img: "images/bentley.jpg" },
    { name: "Tesla Model S Plaid", price: 130000, img: "images/tesla.jpg" },
    { name: "Rimac Nevera", price: 2100000, img: "images/rimac.jpg" },
    { name: "Lotus Emira V6", price: 100000, img: "images/lotus.jpg" },
    { name: "Jaguar F-Type R", price: 75000, img: "images/jaguar.jpg" },
    { name: "Mercedes-AMG ONE", price: 180000, img: "images/mercedes-AMG.jpg" },
    { name: "BMW M5 CS", price: 90000, img: "images/bmw.jpg" },
    { name: "Audi R8 Performance", price: 160000, img: "images/audi.jpg" },
    { name: "Nissan GT-R Nismo", price: 115000, img: "images/nissan.jpg" },
    { name: "Hennessey Venom F5", price: 2000000, img: "images/hennessey.jpg" },
    { name: "SSC Tuatara", price: 1900000, img: "images/ssc.jpg" },
    { name: "Devel Sixteen V16", price: 1600000, img: "images/devel.jpg" },
    { name: "Zenvo TSR-S", price: 1200000, img: "images/zenvo.jpg" },
    { name: "W Motors Fenyr", price: 3400000, img: "images/w motors.jpg" },
    { name: "Maybach S680", price: 200000, img: "images/maybach.jpg" },
    { name: "Cadillac Escalade-V", price: 65000, img: "images/cadillac.jpg" },
    { name: "V-siries", price: 95000, img: "images/v-siries.jpg" },
    
];


let inventory = JSON.parse(localStorage.getItem('loyal_motors_v2')) || defaultStock;
if (!localStorage.getItem('loyal_motors_v2')) {
    localStorage.setItem('loyal_motors_v2', JSON.stringify(defaultStock));
}


const showroom = document.getElementById('carShowroom');
if (showroom) {
    inventory.forEach((unit, idx) => {
        const card = document.createElement('div');
        card.className = 'car-card';
        card.innerHTML = `
            <img src="${unit.img}" class="car-img" alt="whip">
            <h3>${unit.name}</h3>
            <p><strong>$${unit.price.toLocaleString()}</strong></p>
            <div class="actions">
                <button onclick="orderUnit(${idx})">Buy Now</button>
                <button onclick="adminDel(${idx})" style="background:maroon; color:white; border:none; padding:5px;">Del</button>
            </div>
        `;
        showroom.appendChild(card);
    });
}


const checkoutView = document.getElementById('checkoutPreview');
if (checkoutView) {
    const active = JSON.parse(localStorage.getItem('activeOrder'));
    if (!active) {
        checkoutView.innerHTML = "<h3>Selection empty. <a href='index.html'>Go back</a></h3>";
    } else {
        const kesRate = 130.25; 
        const kesPrice = (active.price * kesRate).toLocaleString();
        checkoutView.innerHTML = `
            <div class="preview-panel" style="border: 1px solid gold; padding: 20px; border-radius: 10px; background: #000;">
                <img src="${active.img}" style="width: 100%; border-radius: 8px;">
                <h2 style="color: gold; margin-top: 15px;">${active.name}</h2>
                <p style="font-size: 1.2rem;">Price: $${active.price.toLocaleString()}</p>
                <p style="color: #888;">Approx: KES ${kesPrice}</p>
            </div>
        `;
    }
}


const pForm = document.getElementById('purchaseForm');
if (pForm) {
    pForm.onsubmit = function(e) {
        e.preventDefault();
        const activeCar = JSON.parse(localStorage.getItem('activeOrder'));
        const customer = document.getElementById('buyerName').value;

        if (!activeCar) return alert("Error: No car selected.");

        
        let myGarage = JSON.parse(localStorage.getItem('user_garage')) || [];
        myGarage.push(activeCar);
        localStorage.setItem('user_garage', JSON.stringify(myGarage));

        alert("Sweet! Order placed, " + customer + ". " + activeCar.name + " is now in your garage!");
        
        
        localStorage.removeItem('activeOrder');
        location.href = "garage.html";
    };
}


const myGarageGrid = document.getElementById('garageDisplay');
if (myGarageGrid) {
    const mine = JSON.parse(localStorage.getItem('user_garage')) || [];
    if (mine.length === 0) {
        myGarageGrid.innerHTML = "<h2>No units owned yet. Check the showroom!</h2>";
    } else {
        mine.forEach((car) => {
            const box = document.createElement('div');
            box.className = 'car-card';
            box.innerHTML = `
                <img src="${car.img}" class="car-img">
                <h3 style="color: gold;">${car.name}</h3>
                <p>Status: Registered & Owned</p>
            `;
            myGarageGrid.appendChild(box);
        });
    }
}


const adminForm = document.getElementById('vehicle-upload-form');
if (adminForm) {
    adminForm.onsubmit = function(e) {
        e.preventDefault();
        const fileInput = document.getElementById('unit-photo');
        const reader = new FileReader();

        if (fileInput.files.length === 0) return alert("Bro, where's the photo?");

        reader.onload = function(event) {
            const newItem = {
                name: document.getElementById('car-model-name').value,
                price: parseInt(document.getElementById('asking-price').value),
                img: event.target.result
            };
            inventory.push(newItem);
            localStorage.setItem('loyal_motors_v2', JSON.stringify(inventory));
            alert("Success! Check the showroom.");
            location.href = "index.html"; 
        };
        reader.readAsDataURL(fileInput.files[0]);
    };
}


const clearBtn = document.getElementById('clearGarageBtn');
if (clearBtn) {
    clearBtn.onclick = () => {
        if(confirm("Wipe your garage? No refunds!")) {
            localStorage.removeItem('user_garage');
            location.reload();
        }
    };
}


window.orderUnit = (idx) => {
    localStorage.setItem('activeOrder', JSON.stringify(inventory[idx]));
    location.href = "buy.html";
};

window.adminDel = (idx) => {
    if(confirm("Confirm: Delete this listing?")) {
        inventory.splice(idx, 1);
        localStorage.setItem('loyal_motors_v2', JSON.stringify(inventory));
        location.reload();
    }
};




