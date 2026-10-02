/* =========================================================
   JB PACKAGE PAGE
   Automatically builds package cards from package-config.js
   ========================================================= */


(() => {


  /* =========================================
     FIND PACKAGE CONTAINER
  ========================================== */

  const packageList =
    document.getElementById("packageList");


  if (!packageList) {
    return;
  }



  /* =========================================
     BUILD EACH PACKAGE
  ========================================== */

  JB_PACKAGES.forEach((pkg) => {


    const card =
      document.createElement("article");


    card.className = "package-card";



    /* =========================================
       PACKAGE HTML
    ========================================== */

    card.innerHTML = `


      <!-- LOCKED PREVIEW -->

      <div class="package-preview">

        <img
          src="${pkg.preview}"
          alt="${pkg.title} preview"
          loading="lazy"
        >

        <div class="preview-darken"></div>

        <div class="lock-icon">
          🔒
        </div>

      </div>



      <!-- PACKAGE INFORMATION -->

      <div class="package-copy">

        <h2>
          ${pkg.title}
        </h2>


        <div class="package-count">

          ${pkg.photos} Photos - ${pkg.videos} Videos

        </div>


        <div class="package-tagline">

          ${pkg.tagline}

        </div>

      </div>



      <!-- PRICE / PURCHASE -->

      <div class="package-buy">


        <div class="package-price">

          ${pkg.priceLabel}

        </div>


        <a
          class="access-button"
          href="${pkg.paymentUrl}"
          target="_blank"
          rel="noopener noreferrer"
        >

          GET ACCESS

        </a>


      </div>


    `;



    /* =========================================
       ADD PACKAGE TO PAGE
    ========================================== */

    packageList.appendChild(card);


  });


})();
