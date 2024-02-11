const steps = document.querySelectorAll(".step");
const circleSteps = document.querySelectorAll(".circle");
const formInputsContainer = document.querySelectorAll(".input__container")
const formInputs = document.querySelectorAll("#step1 .input");
const formInputsError = document.querySelectorAll(".input__label--error");
const plans = document.querySelectorAll("#step2 .plan__card");
const switcher = document.querySelector("#switcher");
const addons = document.querySelectorAll(".addon__container");
const total = document.querySelector(".checkout__total__amount");
const planPrice = document.querySelector(".checkout__mount");
let planSelectedName = document.querySelector(".input--selected .plan--name");
planSelectedPrice = document.querySelector(".input--selected .plan--price");
let time;
let currentStep = 1;
let currentCircle = 0;
const obj = {
  plan: null,
  kind: null,
  price: null,
};

for (let i = 0; i < 4; i++) {
  const nextBtn = steps[i].querySelector(".options .button--next");
  const prevBtn = steps[i].querySelector(".options .button--back");
  prevBtn.addEventListener("click", (e) => {
    if (currentCircle > 0) {
      e.preventDefault();
      document.querySelector(`#step${currentStep}`).style.display = "none";
      circleSteps[currentCircle].classList.remove("circle--selected");
      currentStep--;
      currentCircle--;
      document.querySelector(`#step${currentStep}`).style.display = "flex";
      circleSteps[currentCircle].classList.add("circle--selected");
    }
  });
  nextBtn.addEventListener("click", (e) => {
    if (currentStep < 5 && validateForm()) {
      e.preventDefault();
      document.querySelector(`#step${currentStep}`).style.display = "none";
      circleSteps[currentCircle].classList.toggle("circle--selected")
      currentStep++;
      currentCircle++;
      document.querySelector(`#step${currentStep}`).style.display = "flex";
      circleSteps[currentCircle].classList.toggle("circle--selected");
    } else if (currentStep == 4) {
      nextBtn.innerHTML = "Confirm";
      nextBtn.style.backgroundColor = "var(--Purplish-blue)";
    }
  });
}

function validateForm() {
  let valid = true;
  for (let i = 0; i < formInputs.length; i++) {
    if (!formInputs[i].value) {
      valid = false;
      formInputs[i].classList.add("input--error");
      formInputsError[i].style.display = "flex";
    } else if (formInputs[i].value) {
      valid = true;
      formInputs[i].classList.remove("input--error");
      formInputsError[i].style.display = "none";
    }
  }
  return valid;
}

showPlan(planSelectedName, planSelectedPrice);

plans.forEach((plan) => {
  const planName = plan.querySelector(".plan--name");
  const planPrice = plan.querySelector(".plan--price");
  plan.addEventListener("click", () => {
    document.querySelector(".plans .input--selected").classList.remove("input--selected");
    plan.classList.add("input--selected");
    showPlan(planName, planPrice);
  });
});

function showPlan(plan, price) {
  const planName = document.querySelector(".checkout__title");
  const planPrice = document.querySelector(".checkout__mount");
  planSelectedName = plan;
  planSelectedPrice = price;
  obj.plan = plan.innerHTML;
  obj.price = price.innerHTML;
  obj.kind = `${switcher.checked ? "(Yearly)" : "(Monthly)"}`;
  planName.innerHTML = `${obj.plan} ${obj.kind}`;
  planPrice.innerHTML = obj.price;
  setTotal();
}

switcher.addEventListener("click", () => {
  const val = switcher.checked;
  if (val) {
    document.querySelector("#monthly").classList.remove("plan--selected");
    document.querySelector("#yearly").classList.add("plan--selected");
  } else {
    document.querySelector("#monthly").classList.add("plan--selected");
    document.querySelector("#yearly").classList.remove("plan--selected");
  }
  switchPrice(val);
  obj.kind = `${val ? "(Yearly)" : "(Monthly)"}`;
  showPlan(planSelectedName, planSelectedPrice);
});

addons.forEach((addon) => {
  addon.addEventListener("click", (e) => {
    const addonSelect = addon.querySelector("input");
    const ID = addon.querySelector(".addon").getAttribute("data-id");
    if (addonSelect.checked) {
      addonSelect.checked = false;
      addon.classList.remove("ad--selected")
      showAddon(ID, false);

    } else {
      addonSelect.checked = true;
      addon.classList.add("ad--selected");
      showAddon(addon, true);
      e.preventDefault();
    }
  });
});

function switchPrice(checked) {
  const yearlyPrice = [90, 120, 150];
  const monthlyPrice = [9, 12, 15];
  const prices = document.querySelectorAll(".plan--price");
  if (checked) {
    prices[0].innerHTML = `$${yearlyPrice[0]} / yr`;
    prices[1].innerHTML = `$${yearlyPrice[1]} / yr`;
    prices[2].innerHTML = `$${yearlyPrice[2]} / yr`;
    setTime(true);
  } else {
    prices[0].innerHTML = `$${monthlyPrice[0]} / mo`;
    prices[1].innerHTML = `$${monthlyPrice[1]} / mo`;
    prices[2].innerHTML = `$${monthlyPrice[2]} / mo`;
    setTime(false);
  }
}

function showAddon(ad, val) {
  const temp = document.querySelector(".checkout__addon");
  const clone = temp.cloneNode(true);
  const serviceName = clone.querySelector(".checkout__addon--name");
  const servicePrice = clone.querySelector(".checkout__addon--price");
  const serviceID = clone;
  if (ad && val) {
    const addon = ad.querySelector(".addon");
    serviceName.innerHTML = ad.querySelector(".addon__title").innerText;
    servicePrice.innerHTML = ad.querySelector(".addon__price").innerText;
    serviceID.setAttribute("data-id", addon.dataset.id);
    document.querySelector(".checkout__addons").appendChild(clone).classList.remove("none");
    setTotal();
  } else {
    const addons = document.querySelectorAll(".checkout__addon");
    addons.forEach((addon) => {
      const attr = addon.getAttribute("data-id");
      if (attr == ad) {
        addon.remove();
      }
    });
  }
}

function setTotal() {
  const addonsContainer = document.querySelector(".checkout__addons");
  const addonsSpan = document.querySelector(".checkout__addons span");
  const str = planPrice.innerHTML;
  const res = str.replace(/\D/g, "");
  const addonPrices = document.querySelectorAll(".checkout__addon .checkout__addon--price");
  const totalTitle = document.querySelector(".checkout__total__span");

  if (addonsContainer.childNodes.length == 5) {
    addonsSpan.classList.remove("none");
  } else {
    addonsSpan.classList.add("none");
  }

  let val = 0;
  for (let i = 0; i < addonPrices.length; i++) {
    const str = addonPrices[i].innerHTML;
    const res = str.replace(/\D/g, "");
    val += Number(res);
  }
  total.innerHTML = `$${val + Number(res)} /${time ? "yr" : "mo"}`;
  totalTitle.innerHTML = `Total (per ${time ? "year" : "month"})`;
}

function setTime(t) {
  return time = t;
}