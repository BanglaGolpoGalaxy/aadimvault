const themeToggle = document.getElementById("themeToggle");

const langToggle = document.getElementById("langToggle");

let isBangla = true;



// DARK / LIGHT MODE

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("dark");

  if(document.body.classList.contains("dark")){

    themeToggle.innerText = "☀️";

  }else{

    themeToggle.innerText = "🌙";

  }

});




// LANGUAGE TOGGLE

langToggle.addEventListener("click", () => {

  const title = document.getElementById("heroTitle");

  const subtitle = document.getElementById("heroSubtitle");

  const text = document.getElementById("heroText");



  if(isBangla){

    title.innerText = "Aadim Vault";

    subtitle.innerText = "History, Heritage, Our Pride";

    text.innerText =
    "A virtual world preserving lost civilizations, ancient memories and cultural heritage.";

    langToggle.innerText = "বাংলা";

    document.documentElement.lang = "en";

    isBangla = false;

  }else{

    title.innerText = "আদিম ভল্ট";

    subtitle.innerText = "ঐতিহ্য, ইতিহাস, আমাদের গর্ব";

    text.innerText =
    "পৃথিবীর বিভিন্ন প্রান্তের হারিয়ে যাওয়া সভ্যতা, শিল্পকর্ম, স্মৃতি ও ইতিহাসকে একত্রিত করার একটি ভার্চুয়াল জগৎ।";

    langToggle.innerText = "EN";

    document.documentElement.lang = "bn";

    isBangla = true;

  }

});
