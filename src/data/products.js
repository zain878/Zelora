// Centralized product catalogue for the whole site. Every page that shows
// products (Home's featured section, Shop, category filtering, product
// detail pages, the cart, and checkout) reads from this one array — so
// adding a product here is the ONLY change needed; no component edits.
//
// TO ADD A NEW ZELORÀ PRODUCT LATER:
//   1. Add the photo file to src/assets/products/ (e.g. "bridal-set.jpg").
//   2. Import it at the top of this file:
//        import bridalSet from '../assets/products/bridal-set.jpg'
//   3. Add one object to the `products` array below, using that import as
//      `image`, and filling in name/category/price/description/available
//      (and `featured: true` if it should also appear on the homepage).
//   4. Save — it appears automatically in Shop, its category filter, its
//      own product page, the cart, and checkout. Nothing else to touch.
//
// The shape below (id, name, category, price, image, description,
// available, featured) is already everything the cart/checkout/reviews
// system needs — no additional fields required for now.
//
// Until real photography is ready, `image` values below point at
// placehold.co placeholder URLs. A locally-imported image (see step 2
// above) works exactly the same way — both are just strings by the time
// they reach any component.

const products = [
  {
    id: 1,
    name: 'The Wrap Coat',
    category: 'Fashion',
    price: '$320',
    image: 'https://placehold.co/700x900/e7ddca/262220?text=Fashion',
    description:
      'A structured wrap coat in a mid-weight wool blend, cut for a clean silhouette that layers easily over both tailored and casual pieces.',
    available: true,
    featured: true,
  },
  {
    id: 2,
    name: 'Tailored Blazer',
    category: 'Fashion',
    price: '$260',
    image: 'https://placehold.co/700x900/dfd3bd/262220?text=Fashion',
    description:
      'A single-breasted blazer with a slightly relaxed shoulder, built to move between the studio and the evening.',
    available: true,
    featured: false,
  },
  {
    id: 5,
    name: 'Linen Day Set',
    category: 'Casual',
    price: '$140',
    image: 'https://placehold.co/700x900/e2d6c4/262220?text=Casual',
    description:
      'A two-piece linen set in a relaxed fit, made for warm days that move from errands to dinner without a change of clothes.',
    available: true,
    featured: true,
  },
  {
    id: 6,
    name: 'Relaxed Cotton Shirt',
    category: 'Casual',
    price: '$95',
    image: 'https://placehold.co/700x900/d9cbb4/262220?text=Casual',
    description:
      'A boxy cotton shirt with a dropped shoulder, worn open over layers or buttoned on its own.',
    available: true,
    featured: false,
  },

]

export default products
