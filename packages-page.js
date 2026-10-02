/* JB PACKAGE PAGE */
(() => {
  const packageList = document.getElementById("packageList");
  if (!packageList || typeof JB_PACKAGES === "undefined") return;

  JB_PACKAGES.forEach((pkg, index) => {
    const card = document.createElement("article");
    card.className = "package-card" + (pkg.id === "100" ? " package-card-full" : "");

    const progression = index === 0
      ? "STARTER COLLECTION"
      : pkg.id === "100"
        ? "FULL COLLECTION • ALL CURRENT CONTENT"
        : "INCLUDES PREVIOUS PACKAGE + MORE";

    card.innerHTML = `
      <div class="package-preview">
        <img src="${pkg.preview}" alt="${pkg.title} preview" loading="lazy">
        <div class="preview-darken"></div>
        <div class="lock-icon"><span>🔒</span></div>
      </div>

      <div class="package-copy">
        ${pkg.id === "100" ? '<div class="full-label">FULL COLLECTION</div>' : ""}
        <h2>${pkg.title}</h2>
        <div class="package-count">${pkg.photos} Photos - ${pkg.videos} Videos</div>
        <div class="package-tagline">${pkg.tagline}</div>
        <div class="package-progression">${progression}</div>
      </div>

      <div class="package-buy">
        <div class="package-price ${pkg.id === "100" ? "full-price" : ""}">${pkg.priceLabel}</div>
        <a class="access-button" href="${pkg.paymentUrl}" target="_blank" rel="noopener noreferrer">GET ACCESS</a>
        <div class="button-note">SECURE CHECKOUT</div>
      </div>
    `;

    packageList.appendChild(card);
  });
})();