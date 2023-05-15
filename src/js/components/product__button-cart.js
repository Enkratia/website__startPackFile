import * as v from "../vars.js";

const cartArray = JSON.parse(localStorage.getItem("cartArray")) ?? [];
let dataObj;

// F(s)
// ** 
function addDeletingProduct() {
  const deleteProductBtns = v.$cartChoiceList.querySelectorAll(".choice-product__delete");

  function deleteProduct() {
    const cartProduct = this.closest(".cart-choice__item");
    const vendorCode = cartProduct.getAttribute("data-vendor");

    cartArray.forEach((el, idx) => {
      if (el.vendor === vendorCode) {
        cartArray.splice(idx, 1);
        writeTheCount();
        cartProduct.remove();
        localStorage.setItem("cartArray", JSON.stringify(cartArray));
        return;
      }
    });
  }

  deleteProductBtns.forEach(el => {
    el.addEventListener("click", deleteProduct);
  }); 
}

// ** 
function insertSizeHTML(size = undefined) {
  let priceHTML;

  if (size) {
    size = size.replace("Size ", "");

    priceHTML = `
    <div class="choice-product__size">
      <span class="choice-product__size-title">
       Size:
      </span>

      <span class="choice-product__size-data">
        ${size}
      </span>
    </div>
      `;

  } else {
    priceHTML = "";
  }

  return priceHTML;
}

// ** 
function insertColorHTML(color = undefined) {
  let priceHTML;

  if (color) {
    priceHTML = `
     <div class="choice-product__color">
      <span class="choice-product__color-title">
         Color:
       </span>

      <span class="choice-product__color-data">
         ${color}
       </span>
     </div>
      `;

  } else {
    priceHTML = "";
  }

  return priceHTML;
}

// ** 
function insertPriceHTML(price, oldPrice = undefined) {
  let priceHTML;

  if (oldPrice) {
    priceHTML = `
        <!-- Price -->
        <div class="product__prices">
          <span class="product__price product__price--red choice-product__price">
            ${price}
          </span>
  
          <span class="product__old-price choice-product__old-price">
            ${oldPrice}
          </span> 
        </div>
      `;

  } else {
    priceHTML = `
        <!-- Price -->
        <div class="product__prices">
          <span class="product__price choice-product__price">
            ${price}
          </span>
        </div>
      `;
  }

  return priceHTML;
}

// **
function insertCartProducts() {
  if (cartArray.length === 0) return;

  let liTags = "";
  cartArray.forEach(el => {

    liTags += `
    <li class="cart-choice__item" data-vendor="${el.vendor}">
    <article class="cart-choice__product choice-product">
  
      <!-- Image -->
      <img src="${editImageSrc(el.imageSrc)}" alt="Product-image." class="choice-product__image">
  
      <!-- Content -->
      <div class="choice-product__content">
  
        <!-- Title -->
        <h6 class="choice-product__title">
          ${el.title}
        </h6>
  
        <!-- Color -->
        ${insertColorHTML(el.color)}
  
        <!-- Size -->
        ${insertSizeHTML(el.size)}
  
        <!-- Info -->
        <div class="choice-product__info">
  
          <!-- Input-number -->
          <div class="input-number choice-product__input-number">
            <input type="text" class="input-number__input input choice-product__input-number-input" value="${el.count}"
              aria-label="To write the number of products on page." maxlength="3">
  
            <div class="input-number__btns choice-product__btns">
              <button class="input-number__btn input-number__btn--small input-number__btn--upper"
                aria-label="To rise the number of products on page."></button>
  
              <button class="input-number__btn input-number__btn--small input-number__btn--lower"
                aria-label="To reduce the number of products on page."></button>
            </div>
          </div>

        ${insertPriceHTML(el.price, el.oldPrice)}
        </div>

        <!-- Favorite -->
        <button class="product__favorite product__favorite--cart" aria-label="Add to favorite.">
          <svg xmlns='http://www.w3.org/2000/svg' aria-hidden="true">
            <use href='./img/sprite.svg#heart-full'></use>
          </svg>
        </button>
      </div>
  
      <!-- Button delete -->
      <button class="choice-product__delete" aria-label="Delete this product from the cart.">
        <svg xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
          <use href='./img/sprite.svg#bin' aria-hidden='true'></use>
        </svg>
      </button>
    </article>
    </li>`;
  });

  v.$cartChoiceList.innerHTML = "";
  v.$cartChoiceList.insertAdjacentHTML("afterbegin", liTags);
  addDeletingProduct();
}
insertCartProducts();

// ** 
function editImageSrc(imageSrc) {
  let resolution;
  const regExp1 = /_[0-9]+w\.(jpg|jpeg|png|svg)$/i;
  const regExp2 = /_((.+)\.(jpg|jpeg|png|svg))$/i;
  const regExp3 = /(.+)(\.(jpg|jpeg|png|svg))$/i;

  if (imageSrc.match(regExp1)) {
    resolution = imageSrc.match(regExp2);
    imageSrc = imageSrc.replace(resolution[2], "80w");

  } else {
    resolution = imageSrc.match(regExp3);
    imageSrc = resolution[1] + "_80w" + resolution[2];
  }

  return imageSrc;
}

// **
function setActiveClass(elem, elemVendorCode) {
  const swiperWrapper = elem.closest(".swiper-wrapper");

  if (swiperWrapper) { // Check for swiper parent
    const products = swiperWrapper.querySelectorAll("[data-vendor]");

    products.forEach(el => {
      const productsVendorCode = el.getAttribute("data-vendor");

      if (elemVendorCode === productsVendorCode) {
        const productFavoriteBtn = el.querySelector(".product__button-cart");
        productFavoriteBtn.classList.add("product__button-cart--active");
      }
    });

    return;
  }

  if (elem.classList.contains("product-card__btn-cart")) {
    elem.classList.add("product-card__btn-cart--active");
  } else {
    elem.classList.add("product__button-cart--active");
  }
}

// **
function writeTheCount() {
  v.$headerCartCount.innerText = cartArray.length;
  v.$headerCartCount.classList.toggle("cart__count--show", cartArray.length);
  v.$cartChoiceTitleCount.innerText = `(${cartArray.length})`;
  v.$cartChoiceTitleCount.classList.toggle("cart-choice__title-count--show", cartArray.length);
}
writeTheCount();

// ***
function addToCart() {
  const vendorElement = this.closest("[data-vendor]");
  const vendorCode = vendorElement.getAttribute("data-vendor");

  if (this.closest(".product-card")) {
    dataObj = {
      vendor: vendorCode,
      imageSrc: vendorElement.querySelector(".product__image--main").getAttribute("src"),
      title: vendorElement.querySelector(".product-card__title").innerText,
      color: vendorElement.querySelector(".product-card__colors-item--name")?.innerText,
      size: vendorElement.querySelector(".product-card__sort-selected")?.innerText,
      count: vendorElement.querySelector(".input-number__input").value,
      price: vendorElement.querySelector(".product__price").innerText,
      oldPrice: vendorElement.querySelector(".product__old-price")?.innerText,
    }

  } else {
    dataObj = {
      vendor: vendorCode,
      imageSrc: vendorElement.querySelector(".product__image--main").getAttribute("src"),
      title: vendorElement.querySelector(".product__name").innerText,
      color: vendorElement.querySelector(".colors__button--active")?.getAttribute("data-color"),
      size: vendorElement.querySelector(".sizes__button--active")?.innerText,
      count: 1,
      price: vendorElement.querySelector(".product__price").innerText,
      oldPrice: vendorElement.querySelector(".product__old-price")?.innerText,
    }
  }

  for (let elem in dataObj) {
    dataObj[elem] = dataObj[elem];
  }

  if (dataObj.size === "Please select") {
    const sizeSelectWrapper = vendorElement.querySelector(".custom-select__outer-wrapper");
    sizeSelectWrapper.classList.add("custom-select__outer-wrapper--warning");

    sizeSelectWrapper.addEventListener("click", () => {
      sizeSelectWrapper.classList.remove("custom-select__outer-wrapper--warning"), { once: true };
    });

    return;
  }

  setActiveClass(this, vendorCode);

  const isObjectExist = cartArray.find(el => {
    return (JSON.stringify(el) === JSON.stringify(dataObj));
  });

  if (isObjectExist) return;
  cartArray.push(dataObj);


  insertCartProducts();

  localStorage.setItem("cartArray", JSON.stringify(cartArray));
  writeTheCount();
}

// L(s)
// **
const productCartBtns = document.querySelectorAll(".product__button-cart"); // не убирать в vars
productCartBtns.forEach(el => {
  el.addEventListener("click", addToCart);
});