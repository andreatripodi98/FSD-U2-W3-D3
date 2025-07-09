localStorage.removeItem("cart");
// ^ REFRESH CART//
//FETCH BOOKS//

const getBooks = function () {
  fetch("https://striveschool-api.herokuapp.com/books")
    .then((res) => {
      console.log("response", res);
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Non ha trovato nessun libro");
      }
    })
    .then((library) => {
        console.log(library);
        //RANDOM CARD X 3//
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * library.length);
        const randomBook = library[randomIndex];
        const shelf = document.getElementById("book-shelf");
        const col = document.createElement("div");
        col.className = "col d-flex";
        col.innerHTML = `
    <div class="card border-0 h-100 d-flex flex-column" style="width: 18rem;">
      <img
        src="${randomBook.img}"
        class="card-img-top"
        alt="book front"
        style="height: 300px; object-fit: cover;"
      />
      <div class="card-body d-flex flex-column" style="box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3);">
        <h5 class="card-title">${randomBook.title}</h5>
        <p class="card-text">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
        <p>Price: <span>${randomBook.price}€</span></p>
        <div class="mt-auto d-flex justify-content-between">
          <a href="#" 
            class="btn btn-sm btn-primary px-4 add-to-cart"
            data-asin="${randomBook.asin}" 
            data-title="${randomBook.title}" 
            data-price="${randomBook.price}" 
            data-img="${randomBook.img}">
            <i class="bi bi-cart"></i>   
          </a>
          <button type="button" class="btn btn-sm btn-danger discard-btn">Discard</button>
        </div>
      </div>
    </div>
  `;

        shelf.appendChild(col);

        const discard = col.querySelector(".discard-btn");
        discard.addEventListener("click", () => {
          col.remove();
        });
      }
    })
    .catch((err) => {
      console.log("Errore", err);
    });
};
getBooks();
//CART//
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".add-to-cart");
  if (!btn) return;

  const book = {
    asin: btn.dataset.asin,
    title: btn.dataset.title,
    price: btn.dataset.price,
    img: btn.dataset.img,
  };

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(book);
  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartDropdown();

  function updateCartDropdown() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const dropdown = document.querySelector(".dropdown-menu");

    dropdown.innerHTML = "";

    if (cart.length === 0) {
      const emptyMsg = document.createElement("li");
      emptyMsg.textContent = "Cart is empty";
      emptyMsg.classList.add("dropdown-item", "text-muted");
      dropdown.appendChild(emptyMsg);
      return;
    }

    cart.forEach((book) => {
      const li = document.createElement("li");
      li.classList.add("dropdown-item");
      li.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <span>${book.title}</span>
        <small>${book.price}€</small>
      </div>
    `;
      dropdown.appendChild(li);
    });
  }
});
