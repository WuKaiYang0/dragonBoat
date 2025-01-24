import { bounce } from '@/utils/common'
import { type Ref } from 'vue'

export const computedAllWidthByElOrNum = (
  elsOrNum: Array<HTMLElement | number> | HTMLCollection
) => {
  let sum = 0
  for (let i = 0; i < elsOrNum.length; i++) {
    let num = 0
    if (Number(elsOrNum[i])) {
      num = elsOrNum[i] as number
    } else {
      num = (elsOrNum[i] as HTMLElement)?.getBoundingClientRect().width
    }
    sum += num
  }
  return sum
}
export const judgeOverXByChildren = (scrollTargetEl: HTMLElement, isOver: Ref<boolean>) => {
  let elTimer = null
  const existObserve = [] as ResizeObserver[]
  const elObserverCallback: ResizeObserverCallback = () => {
    targetObserver.disconnect()
    targetObserver.observe(scrollTargetEl)
  }
  for (let i = 0; i < scrollTargetEl.children.length; i++) {
    const el = scrollTargetEl.children[i]
    const elObserver = new ResizeObserver(() => {
      clearInterval(elTimer)
      elTimer = setTimeout(elObserverCallback, 50)
    })
    elObserver.observe(el)
    existObserve.push(elObserver)
  }
  const targetObserverCallback: ResizeObserverCallback = (entries) => {
    if (entries.length > 1) {
      throw new Error('只能监听一个目标元素')
    }
    const {
      contentRect: { width },
      target
    } = entries[0]
    const targetWidth = computedAllWidthByElOrNum(target.children)
    if (width < targetWidth) {
      //超出
      isOver.value = true
    } else {
      //未超出
      isOver.value = false
    }
  }
  const targetObserver = new ResizeObserver((entries, observer) => {
    const callback = bounce(() => targetObserverCallback(entries, observer), 50)
    callback()
  })
  targetObserver.observe(scrollTargetEl)
  existObserve.push(targetObserver)
  return existObserve
}
export const judgeOverXByEls = (
  scrollTargetEl: HTMLElement,
  elsOrNum: Array<HTMLElement | number>,
  isOver: Ref<boolean>
) => {
  const existObserve = [] as ResizeObserver[]
  let fixednessTargetWidth = computedAllWidthByElOrNum(elsOrNum)
  let targetWidth = null
  for (let i = 0; i < elsOrNum.length; i++) {
    if (!Number(elsOrNum[i])) {
      const el = elsOrNum[i] as HTMLElement
      const ob = new ResizeObserver(() => {
        //优化：若元素改变了重新计算宽度
        if (!isOver.value) {
          //!isOver.value为true 未超出边界
          // 假若某元素还未隐藏，或其elsOrNum里的元素尺寸变化了，需要重新计算尺寸
          targetWidth = computedAllWidthByElOrNum(elsOrNum)
          fixednessTargetWidth = targetWidth
        } else {
          //假若元素隐藏了
          targetWidth = fixednessTargetWidth
        }
      })
      ob.observe(el)
      existObserve.push(ob)
    }
  }
  const targetObserverCallback: ResizeObserverCallback = (entries) => {
    if (entries.length > 1) {
      throw new Error('只能监听一个目标元素')
    }
    const {
      contentRect: { width }
    } = entries[0]
    console.log('width', width, entries[0].target)
    if (width < targetWidth) {
      //超出
      isOver.value = true
    } else {
      //未超出
      isOver.value = false
    }
  }
  const targetObserver = new ResizeObserver((entries, observer) => {
    const callback = bounce(() => targetObserverCallback(entries, observer), 100)
    callback()
  })
  targetObserver.observe(scrollTargetEl)
  existObserve.push(targetObserver)
  return existObserve
}
export const removeObserver = (existObserve: ResizeObserver[]) => {
  for (let i = 0; i < existObserve.length; i++) {
    existObserve[i].disconnect()
  }
}
