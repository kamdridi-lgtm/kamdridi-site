// KAM DRIDI — Production link and route configuration.
window.KAMDRIDI_LINKS = {
  storeHome: "https://store.kamdridi.com",
  bundleStripe: "https://buy.stripe.com/4gMbJ1eByf4w6kw0fCeEo01",

  youtubeChannel: "https://www.youtube.com/@kamdridi",
  instagram: "https://www.instagram.com/kamdridi/",
  spotify: "https://open.spotify.com/track/1jfpUX2dXWBzwnfAhhMm7W",
  deezer: "https://link.deezer.com/s/32vMfvEuvIO2AtxFIpupL",
  amazonMusic: "https://music.amazon.co.uk/tracks/B0GJNFV337?marketplaceId=A1F83G8C2ARO7P&musicTerritory=GB&ref=dm_sh_o7RL1FNeJ2hrMdCRhkFAVmB2c",
  bandcamp: "https://kamdridi.bandcamp.com",
  email: "mailto:contact@kamdridi.com",

  merch: {
    hoodie: "https://buy.stripe.com/fZu00jeByaOg4co9QceEo04",
    tee: "https://buy.stripe.com/4gMcN5ali6y0fV60fCeEo03",
    cd_vinyl: "https://buy.stripe.com/cNi6oHeByg8AbEQd2oeEo05",
    poster: "https://store.kamdridi.com",
    collector: "https://buy.stripe.com/6oUdR9eByf4w7oA6E0eEo00"
  }
};

window.KAMDRIDI_SITE = {
  nav: ["home", "music", "media", "photos", "press", "merch", "booking"],
  menu: ["home", "music", "media", "photos", "press", "merch", "booking", "contact"],
  routes: {
    home: {
      label: "Home",
      href: "/",
      match: ["/", "/index.html"],
      enabled: true,
      hint: "Start"
    },
    music: {
      label: "Music",
      href: "/#releases",
      match: ["/", "/index.html"],
      enabled: true,
      hint: "Releases"
    },
    media: {
      label: "Media",
      href: "/media.html",
      match: ["/media", "/media/", "/media.html"],
      enabled: true,
      hint: "Official"
    },
    photos: {
      label: "Photos",
      href: "/photos.html",
      match: ["/photos", "/photos/", "/photos.html"],
      enabled: true,
      hint: "Gallery"
    },
    press: {
      label: "Press",
      href: "/press.html",
      match: ["/press", "/press/", "/press.html"],
      enabled: true,
      hint: "EPK"
    },
    booking: {
      label: "Booking",
      href: "/booking.html",
      match: ["/booking", "/booking/", "/booking.html"],
      enabled: true,
      hint: "Contact"
    },
    contact: {
      label: "Contact",
      href: "/#contact",
      match: ["/", "/index.html"],
      enabled: true,
      hint: "Direct"
    },
    merch: {
      label: "Store",
      href: "/merch.html",
      match: ["/merch", "/merch/", "/merch.html"],
      enabled: true,
      hint: "Store",
      fallbackLabel: "Collector line soon",
      hideWhenDisabled: false
    },
    epk: {
      label: "EPK",
      href: "/press.html",
      match: ["/press", "/press/", "/press.html"],
      enabled: true
    }
  },
  media: {
    featuredEmbed: "",
    title: "Official Media",
    status: "Official media coming soon",
    body: "The public media room is being prepared with finished embeds only. Until the featured video is locked, this page stays clean: official links, press access, and the photo gallery."
  },
  photos: [
    {
      src: "/assets/images/present/live_stage.png",
      alt: "Kam Dridi live stage performance",
      caption: "Live stage still"
    },
    {
      src: "/assets/images/photos/p03_portrait_mic.jpg",
      alt: "Kam Dridi studio portrait holding a microphone",
      caption: "Studio mic portrait"
    },
    {
      src: "/assets/images/photos/p04_portrait_leather.jpg",
      alt: "Kam Dridi leather jacket portrait",
      caption: "Leather portrait"
    },
    {
      src: "/assets/images/photos/p01_hero.jpg",
      alt: "Kam Dridi band visual on rooftop under glowing logo",
      caption: "Band visual"
    }
  ]
};
