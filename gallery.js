/* =========================================================
   JB PRIVATE COLLECTIONS
   DYNAMIC GALLERY
   ========================================================= */


(() => {


  /* =====================================================
     READ PACKAGE FROM URL

     Example:

     gallery.html?package=20
  ====================================================== */


  const parameters =
    new URLSearchParams(
      window.location.search
    );


  const packageID =
    parameters.get("package");



  const packageData =
    JB_GALLERIES[packageID];



  /* =====================================================
     ELEMENTS
  ====================================================== */


  const title =
    document.getElementById(
      "packageTitle"
    );


  const details =
    document.getElementById(
      "packageDetails"
    );


  const badge =
    document.getElementById(
      "packageBadge"
    );


  const recentGrid =
    document.getElementById(
      "recentGrid"
    );


  const photoGallery =
    document.getElementById(
      "photoGallery"
    );


  const videoGallery =
    document.getElementById(
      "videoGallery"
    );


  const invalidPackage =
    document.getElementById(
      "invalidPackage"
    );



  /* =====================================================
     INVALID PACKAGE
  ====================================================== */


  if (!packageData) {


    invalidPackage.hidden = false;


    document.body.classList.add(
      "gallery-invalid"
    );


    return;


  }



  /* =====================================================
     DETERMINE MEDIA FOR THIS PACKAGE
  ====================================================== */


  const packagePhotos =
    ALL_PHOTOS.slice(
      0,
      packageData.photoCount
    );


  const packageVideos =
    ALL_VIDEOS.slice(
      0,
      packageData.videoCount
    );



  /* =====================================================
     PAGE INFORMATION
  ====================================================== */


  document.title =
    `JB | ${packageData.title}`;


  title.textContent =
    packageData.title;


  details.textContent =
    packageData.tagline;


  badge.textContent =
    `${packagePhotos.length} PHOTOS • ${packageVideos.length} VIDEOS`;



  /* =====================================================
     CREATE PHOTO
  ====================================================== */


  function createPhoto(
    filename,
    index
  ) {


    const button =
      document.createElement(
        "button"
      );


    button.className =
      "photo-card";


    button.type =
      "button";


    button.dataset.index =
      index;


    const image =
      document.createElement(
        "img"
      );


    image.src =
      `photos/${filename}`;


    image.alt =
      `JB gallery photo ${index + 1}`;


    image.loading =
      "lazy";


    button.appendChild(
      image
    );


    return button;


  }



  /* =====================================================
     CREATE VIDEO
  ====================================================== */


  function createVideo(
    filename,
    index
  ) {


    const card =
      document.createElement(
        "article"
      );


    card.className =
      "video-card";


    const video =
      document.createElement(
        "video"
      );


    video.src =
      `videos/${filename}`;


    video.controls =
      true;


    video.playsInline =
      true;


    video.preload =
      "metadata";


    video.setAttribute(
      "controlsList",
      "nodownload"
    );


    video.dataset.index =
      index;


    card.appendChild(
      video
    );


    return card;


  }



  /* =====================================================
     BUILD PHOTO GALLERY
  ====================================================== */


  packagePhotos.forEach(
    (filename, index) => {


      photoGallery.appendChild(

        createPhoto(
          filename,
          index
        )

      );


    }
  );



  /* =====================================================
     BUILD VIDEO GALLERY
  ====================================================== */


  packageVideos.forEach(
    (filename, index) => {


      videoGallery.appendChild(

        createVideo(
          filename,
          index
        )

      );


    }
  );



  /* =====================================================
     RECENTLY ADDED

     Shows the last three items available
     in the customer's package.
  ====================================================== */


  const recentPhotos =
    packagePhotos.slice(-3);


  recentPhotos.forEach(
    (filename) => {


      const actualIndex =
        packagePhotos.indexOf(
          filename
        );


      recentGrid.appendChild(

        createPhoto(
          filename,
          actualIndex
        )

      );


    }
  );



  /* =====================================================
     PHOTO LIGHTBOX
  ====================================================== */


  const photoLightbox =
    document.getElementById(
      "photoLightbox"
    );


  const lightboxImage =
    document.getElementById(
      "lightboxImage"
    );


  const closePhoto =
    document.getElementById(
      "closePhoto"
    );


  const previousPhoto =
    document.getElementById(
      "previousPhoto"
    );


  const nextPhoto =
    document.getElementById(
      "nextPhoto"
    );


  let currentPhotoIndex = 0;



  /* =====================================================
     OPEN PHOTO
  ====================================================== */


  function openPhoto(index) {


    currentPhotoIndex =
      Number(index);


    lightboxImage.src =
      `photos/${packagePhotos[currentPhotoIndex]}`;


    photoLightbox.classList.add(
      "active"
    );


    photoLightbox.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.classList.add(
      "lightbox-open"
    );


  }



  /* =====================================================
     CLOSE PHOTO
  ====================================================== */


  function closePhotoViewer() {


    photoLightbox.classList.remove(
      "active"
    );


    photoLightbox.setAttribute(
      "aria-hidden",
      "true"
    );


    lightboxImage.src = "";


    document.body.classList.remove(
      "lightbox-open"
    );


  }



  /* =====================================================
     NEXT PHOTO
  ====================================================== */


  function showNextPhoto() {


    currentPhotoIndex++;


    if (
      currentPhotoIndex >=
      packagePhotos.length
    ) {

      currentPhotoIndex = 0;

    }


    openPhoto(
      currentPhotoIndex
    );


  }



  /* =====================================================
     PREVIOUS PHOTO
  ====================================================== */


  function showPreviousPhoto() {


    currentPhotoIndex--;


    if (
      currentPhotoIndex < 0
    ) {

      currentPhotoIndex =
        packagePhotos.length - 1;

    }


    openPhoto(
      currentPhotoIndex
    );


  }



  /* =====================================================
     PHOTO CLICK EVENTS
  ====================================================== */


  document.addEventListener(
    "click",
    (event) => {


      const photo =
        event.target.closest(
          ".photo-card"
        );


      if (photo) {


        openPhoto(
          photo.dataset.index
        );


      }


    }
  );



  closePhoto.addEventListener(
    "click",
    closePhotoViewer
  );


  nextPhoto.addEventListener(
    "click",
    showNextPhoto
  );


  previousPhoto.addEventListener(
    "click",
    showPreviousPhoto
  );



  photoLightbox.addEventListener(
    "click",
    (event) => {


      if (
        event.target ===
        photoLightbox
      ) {

        closePhotoViewer();

      }


    }
  );



  /* =====================================================
     KEYBOARD CONTROLS
  ====================================================== */


  document.addEventListener(
    "keydown",
    (event) => {


      if (
        !photoLightbox.classList.contains(
          "active"
        )
      ) {

        return;

      }


      if (
        event.key ===
        "Escape"
      ) {

        closePhotoViewer();

      }


      if (
        event.key ===
        "ArrowRight"
      ) {

        showNextPhoto();

      }


      if (
        event.key ===
        "ArrowLeft"
      ) {

        showPreviousPhoto();

      }


    }
  );



})();
