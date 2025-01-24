export const darkTheme = (switchEl: HTMLElement) => {
  // 为不支持此 API 的浏览器提供回退方案：
  if (!document.startViewTransition) {
    return Promise.resolve(false)
  } else {
    const elRect = (switchEl as HTMLElement).getBoundingClientRect()
    const { left, top, width, height } = elRect
    const x = left + width / 2
    const y = top + height / 2
    // 获取到最远角的距离
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    // 开始一次视图过渡：
    const transition = document.startViewTransition(() => {
      document.querySelector('html').classList.toggle('dark')
    })
    // 等待伪元素创建完成：
    transition.ready.then(() => {
      const isDark = document.querySelector('html').classList.contains('dark') ? true : false
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
      document.documentElement.animate(
        {
          clipPath: isDark ? clipPath : clipPath.reverse()
        },
        {
          duration: 400,
          easing: 'ease-in',
          // 指定要附加动画的伪元素
          pseudoElement: isDark ? `::view-transition-new(root)` : `::view-transition-old(root)`
        }
      )
    })
    return new Promise((res) => {
      transition.updateCallbackDone.then(() => {
        res(true)
      })
    })
  }
}
