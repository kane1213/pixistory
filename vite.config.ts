import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// import { loadEnv } from 'vite'
// https://vitejs.dev/config/



// import path from 'path'
// import fs from 'fs'
// const dirnameExportImg = './src/assets/images/circles'
// console.log({ dirnameExportImg })
// fs.readdir(dirnameExportImg, function (err, files) {
//   if (err) {
//     console.log(err)
//   }
//   files.map(
//     (file) => { console.log(file) }
//   )
// })


export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 7021,
    open: true
  }
})
