// Real Zelorà business information, centralized so it's only ever
// written once. Update the values here and every component that shows
// contact/social info (Navbar, Footer, order confirmation, etc.) updates
// automatically.

const WHATSAPP_NUMBER = '+923197657452'

export const SITE = {
  name: 'Zelorà',
  tagline: 'Where ideas turn into style.',

  instagram: {
    url: 'https://www.instagram.com/madebyzelora/',
    handle: '@madebyzelora',
  },

  whatsapp: {
    number: WHATSAPP_NUMBER,
    // wa.me links need digits only (no +, spaces, or dashes).
    url: `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`,
  },
}
