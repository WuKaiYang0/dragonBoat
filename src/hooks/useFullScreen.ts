import { ref } from 'vue'
export const isFullScreen = ref(false)
export const toggleFullScreen = (el: HTMLElement) =>
  new Promise((res, rej) => {
    try {
      el.classList.toggle('fullScreen')
      res(true)
    } catch (error) {
      rej(error.message)
    }
  })
