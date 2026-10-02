/* =========================================================
   JB PRIVATE COLLECTIONS
   PACKAGE CONFIGURATION
   =========================================================

   THIS IS THE FILE TO EDIT WHEN YOU WANT TO:

   - Change a package price
   - Change number of photos
   - Change number of videos
   - Change package wording
   - Change teaser image
   - Change Stripe payment link

   Preview images come from:

   photos/

   Example:

   preview: "photos/photo17.JPG"

   ========================================================= */


const JB_PACKAGES = [


  /* =====================================================
     PACKAGE #1
     $20
  ====================================================== */

  {
    id: "20",

    title: "PACKAGE #1",

    price: "$20",

    priceLabel: "$20 GALLERY",

    photos: 8,

    videos: 2,

    tagline: "A LITTLE BIT OF JB",

    preview: "photos/photo1.JPG",

    paymentUrl:
      "https://buy.stripe.com/bJe7sLa0B2xW9xQ8O67kc0e"
  },



  /* =====================================================
     PACKAGE #2
     $40
  ====================================================== */

  {
    id: "40",

    title: "PACKAGE #2",

    price: "$40",

    priceLabel: "$40 GALLERY",

    photos: 15,

    videos: 4,

    tagline: "MORE OF WHAT YOU WANT",

    preview: "photos/photo5.JPG",

    paymentUrl:
      "https://buy.stripe.com/14AbJ14Gh5K8eSad4m7kc0k"
  },



  /* =====================================================
     PACKAGE #3
     $50
  ====================================================== */

  {
    id: "50",

    title: "PACKAGE #3",

    price: "$50",

    priceLabel: "$50 GALLERY",

    photos: 25,

    videos: 6,

    tagline: "TURN IT UP A NOTCH",

    preview: "photos/photo9.JPG",

    paymentUrl:
      "https://buy.stripe.com/5kQbJ13Cd6OcfWec0i7kc0f"
  },



  /* =====================================================
     PACKAGE #4
     $75
  ====================================================== */

  {
    id: "75",

    title: "PACKAGE #4",

    price: "$75",

    priceLabel: "$75 GALLERY",

    photos: 40,

    videos: 8,

    tagline: "JB EXCLUSIVE",

    preview: "photos/photo13.JPG",

    paymentUrl:
      "https://buy.stripe.com/aFaaEXgoZ6Och0i9Sa7kc0l"
  },



  /* =====================================================
     PACKAGE #5
     $100
  ====================================================== */

  {
    id: "100",

    title: "PACKAGE #5",

    price: "$100",

    priceLabel: "$100 FULL GALLERY",

    photos: 60,

    videos: 12,

    tagline: "THE FULL COLLECTION",

    preview: "photos/photo17.JPG",

    paymentUrl:
      "https://buy.stripe.com/cNidR9egR2xWaBU0hA7kc0g"
  }

];
