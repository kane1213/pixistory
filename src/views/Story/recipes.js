export default [
  { id: 1, name: 'ローストビーフ', images: ['meats.png', 'ingredient1.png', 'ingredient2.png', ...new Array(6).fill(1).map((v, i) => `step${v + i}.png`)].map(str => `/recipe1/${str}`) },
  { id: 2, name: 'じゃがいものピュレ', images: ['poteto1.png', 'ingredient1.png', 'ingredient2.png', ...new Array(6).fill(1).map((v, i) => `step${v + i}.png`)].map(str => `/recipe2/${str}`) }
]

