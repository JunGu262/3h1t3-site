/* EDIT HERE: public contact information and global settings. Everything in this file is visible to anyone who opens the site. */
window.SITE = {
  brand: "3h1t3",
  twitterHandle: "3h1t3", // X/Twitter handle, without @
  currency: "USD",
  zzzOrdersOpen: true, // Zenless Zone Zero requests. true = form enabled. Set false to close it.
  genshinOrdersOpen: true, // Genshin Impact requests. true = form enabled. Set false to close it.
  email: "", // Leave EMPTY if it is your personal email: it would be public and the form would show it as a button.
  formEndpoint: "https://api.web3forms.com/submit", // URL of your form service. Web3Forms: https://api.web3forms.com/submit . Formspree: the form URL they give you.
  formAccessKey: "dd24facb-0a2b-438a-adc9-4723be2b5a5d" // Web3Forms access key (public by design). Leave empty for Formspree. The email that receives requests is set in the service, NOT here.
};
