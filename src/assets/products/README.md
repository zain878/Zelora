# Product photos go here

This folder is empty until real Zelorà product photography is ready. Once
it is, adding a product is 3 steps — see the top of `src/data/products.js`
for the full walkthrough. In short:

1. Drop the image file in here, e.g. `bridal-set.jpg`.
2. Import it in `src/data/products.js`:
   ```js
   import bridalSet from '../assets/products/bridal-set.jpg'
   ```
3. Use that import as the `image` field on a new product object.

Vite automatically optimizes and hashes locally-imported images at build
time — no extra image tooling needed. Until real photos arrive, the
`image` fields in `products.js` point at placehold.co placeholder URLs
instead, which work the same way from the rest of the app's point of view
(it's just a string either way).
