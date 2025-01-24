<template>
  <div class="content">
    <Sidebar></Sidebar>
    <main ref="mainRef">
      <div class="content-wrapper">
        <div class="tags-container">
          <el-icon
            v-if="!otherStore.collapse"
            class="icon"
            icon
            @click="otherStore.toggleCollapse()"
            ><Fold
          /></el-icon>
          <el-icon v-else class="icon" icon @click="otherStore.toggleCollapse()"
            ><Expand
          /></el-icon>
          <el-divider direction="vertical" />
          <div
            v-show="isOver"
            ref="tagArrowLeftRef"
            class="tag-arrow-left tag-arrow flex-center"
            @click="arrowLeftHandler"
          >
            <el-icon><ArrowLeft /></el-icon>
          </div>
          <div ref="tagsWrapperRef" class="tags-wrapper">
            <div
              ref="tagsRef"
              class="tags"
              :style="{ transform: `translateX(${distanceOfTagbar}px)` }"
            >
              <el-tag
                v-for="(tag, index) in dynamicTags"
                :key="tag.name"
                :disable-transitions="true"
                :closable="index === 0 ? false : true"
                effect="plain"
                class="default"
                :class="{ active: tag.active }"
                @close="handleClose(tag, index)"
                @click="handleClick(tag)"
                @vue:mounted="
                  () => {
                    watch(
                      () => tag,
                      (nV1) => {
                        nextTick(() => {
                          if (nV1.active) {
                            //切换tag
                            const currentActiveTag = tagsRef.querySelector('.active') as HTMLElement
                            shouldRemoveTagEl = currentActiveTag
                          }
                        })
                      },
                      {
                        deep: true
                      }
                    )
                  }
                "
              >
                <ElIcon>
                  <component :is="tag.meta.icon"></component>
                </ElIcon>
                <ElText>{{ tag.meta.title }}</ElText>
              </el-tag>
            </div>
          </div>
          <div
            v-show="isOver"
            ref="tagArrowRightRef"
            class="tag-arrow-right tag-arrow flex-center"
            @click="arrowRightHandler"
          >
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
        <router-view v-slot="{ Component }">
          <FadeShiftTransition
            @enter="
              () => {
                NProgress.done()
              }
            "
          >
            <component :is="Component" style="overflow: auto" />
          </FadeShiftTransition>
        </router-view>
      </div>
      <div style="display: flex; flex-direction: column; margin-top: var(--main-padding)">
        <ElText type="info" size="small">
          <ElLink
            type="info"
            href="https://github.com/WuKaiYang0/dragonBoat"
            :target="Target._blank"
            style="font-size: inherit"
          >
            GitHub
          </ElLink>
        </ElText>
        <ElText type="info" size="small">Copyright © 2024 SCNU Students</ElText>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import { useOtherStore } from '@/stores/other'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import type { TagSetting } from '@/typings/common'
import router from '@/router'
import { useRoute } from 'vue-router'
import FadeShiftTransition from './transition/FadeShiftTransition.vue'
import NProgress from 'nprogress'
import { judgeOverXByChildren, removeObserver } from '@/hooks/useJudgeIsOverflowXByels'
import { bounce } from '@/utils/common'
const isOver = ref(false)
const tagsWrapperRef = ref<HTMLElement>()
const tagsRef = ref<HTMLElement>()
const tagArrowLeftRef = ref<HTMLElement>()
const tagArrowRightRef = ref<HTMLElement>()
const otherStore = useOtherStore()
const rootRoute = router.getRoutes().find((item) => item.path === '/')
const redirectRoute = router.getRoutes().find((item) => item.path === rootRoute.redirect)
enum Target {
  '_blank' = '_blank',
  '_parent' = '_parent',
  '_self' = '_self',
  '_top' = '_top'
}
const rootTag: TagSetting = {
  active: true,
  fullPath: redirectRoute.path,
  meta: redirectRoute.meta,
  name: redirectRoute.name
}
const dynamicTags = ref<TagSetting[]>([rootTag])
//判断是否第一次点击（新tag）
let isFreshTag = false
let observes = null as ResizeObserver[]
const distanceOfTagbar = ref(0)
const visableEls = ref(new Set<HTMLElement>())
const shouldRemoveTagEl = ref<HTMLElement>(null)
const thresholdOfShouldRemoveTagEl = 0.4
const handleClick = (tag: TagSetting) => {
  dynamicTags.value.forEach((item) => (item.active = false))
  tag.active = true
  router.push(tag.fullPath)
}

const handleClose = (tag: TagSetting, index: number) => {
  //第一个是首页，不能被del
  if (index > 0) {
    //查找当前Tag在dynamicTags的索引值
    const currentTagIndex = dynamicTags.value.findIndex((tag) => tag.active === true)
    //del Tag
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
    if (currentTagIndex >= index) {
      handleClick(dynamicTags.value[currentTagIndex - 1])
    }
    //若前面条件不满足，只删除了没有选择的标签...
  }
}
watch(shouldRemoveTagEl, (nV) => {
  if (nV) {
    const offsetLeftOfActiveTagEl = shouldRemoveTagEl.value.offsetLeft
    const isVisable = Array.from(visableEls.value.values()).includes(nV)
    const visableWidth = tagsWrapperRef.value.offsetWidth /**可视元素(tagWrapper)宽度 */
    const finishedDistance = new DOMMatrixReadOnly(tagsRef.value.style.transform)
      .m41 /**已经移动的距离 */
    const leftVisableAndUnVisableWidth =
      visableWidth + Math.abs(finishedDistance) /*可视元素(tagWrapper)+已经移动的距离 **/
    const vLeftVisableAndUnVisableWidth =
      leftVisableAndUnVisableWidth -
      offsetLeftOfActiveTagEl *
        thresholdOfShouldRemoveTagEl /**实际上，需要减元素计算交叉阈值后的宽度 */
    if (!isVisable) {
      //tag不可见
      if (offsetLeftOfActiveTagEl < vLeftVisableAndUnVisableWidth) {
        //在可见tag当中的左边
        distanceOfTagbar.value = -nV.offsetLeft
      } else {
        distanceOfTagbar.value = -(
          (
            Math.abs(finishedDistance) /**已经移动的距离 */ +
            shouldRemoveTagEl.value.offsetLeft -
            leftVisableAndUnVisableWidth +
            /**选中的tag左侧边到可视元素(tagWrapper)的距离 */ shouldRemoveTagEl.value.offsetWidth
          ) /**加上选中的tag的宽度 */
        )
      }
    }
  }
})
watch(
  useRoute(),
  (currnetRoute) => {
    const r = currnetRoute
    otherStore.$state.matchedRoutes = r.matched
    const newTag: TagSetting = {
      active: false,
      fullPath: r.fullPath,
      meta: r.meta,
      name: r.name
    }
    //看是否存在，存在就取
    const currentTag = dynamicTags.value.find((t) => t.fullPath === newTag.fullPath)
    if (!currentTag) {
      isFreshTag = true
      //说明不存在
      dynamicTags.value.push(newTag)
      handleClick(newTag)
    } else {
      //存在
      handleClick(currentTag)
    }
  },
  { immediate: true }
)
watch(
  dynamicTags,
  () => {
    nextTick(() => {
      tagRegisterObserve()
    })
  },
  { deep: true }
)
let tagsWrapperOffsetWidth = 0
const ob1 = new ResizeObserver((en) => {
  const el = en[0].target as HTMLElement
  const differ = el.offsetWidth - tagsWrapperOffsetWidth
  const finishedDistance = new DOMMatrixReadOnly(tagsRef.value.style.transform).m41
  if (finishedDistance < 0 && differ > 0) {
    distanceOfTagbar.value = Math.abs(differ) + distanceOfTagbar.value
  }
  tagsWrapperOffsetWidth = el.offsetWidth
})
watch(isOver, (nV) => {
  if (nV) {
    tagsWrapperOffsetWidth = tagsWrapperRef.value.offsetWidth
    ob1.observe(tagsWrapperRef.value)
  } else {
    distanceOfTagbar.value = 0
    ob1.unobserve(tagsWrapperRef.value)
  }
})
// 以上述配置开始观察目标节点
const intersectionObserverCallback: IntersectionObserverCallback = (entries) => {
  //作用：在监控tag中知道，切换 tag时，哪个tag元素是可见的
  entries.filter((e) => {
    const _el = e.target as HTMLElement
    if (e.isIntersecting) {
      visableEls.value.add(_el)
    } else {
      visableEls.value.delete(_el)
    }
  })
  const internalIntersectionObserver = () => {
    //只执行一次
    const resizeObserverCallback = () => {
      //新路由
      const en = entries.filter((t) => t.target.classList.contains('active'))
      const newActiveEl = en[0].target as HTMLElement
      shouldRemoveTagEl.value = newActiveEl
      isFreshTag = false
      ob.unobserve(tagsWrapperRef.value)
    }
    const ob = new ResizeObserver(bounce(resizeObserverCallback, 200))
    ob.observe(tagsWrapperRef.value)
  }
  //新路由
  if (!isFreshTag) return
  bounce(internalIntersectionObserver, 0)()
}
const intersectionObserver = new IntersectionObserver(intersectionObserverCallback, {
  root: tagsWrapperRef.value,
  threshold: thresholdOfShouldRemoveTagEl
})
const arrowLeftHandler = () => {
  const visableWidth = tagsWrapperRef.value.offsetWidth
  const finishedDistance = new DOMMatrixReadOnly(tagsRef.value.style.transform).m41 //m41为translateX的值
  const leftUnVisableWidth = Math.abs(finishedDistance)
  const maxRightDistance = leftUnVisableWidth + visableWidth
  if (finishedDistance < 0) {
    //右侧有tag超出
    const foldNum = maxRightDistance / visableWidth //计算折叠数量
    if (foldNum > 2.5) {
      distanceOfTagbar.value = -(leftUnVisableWidth - visableWidth)
    } else if (foldNum >= 0) {
      //直接移动到最后一个
      distanceOfTagbar.value = 0
    }
  }
}
const arrowRightHandler = () => {
  const visableWidth = tagsWrapperRef.value.offsetWidth
  const tagBarWidth = tagsRef.value.offsetWidth
  const finishedDistance = new DOMMatrixReadOnly(tagsRef.value.style.transform).m41
  const rightUnVisableWidth = tagBarWidth - visableWidth - Math.abs(finishedDistance) //m41为translateX的值
  const maxRightDistance = rightUnVisableWidth + visableWidth
  if (visableWidth < tagBarWidth) {
    //右侧有tag超出
    const foldNum = maxRightDistance / visableWidth //计算折叠数量
    if (foldNum > 2.5) {
      distanceOfTagbar.value = -(Math.abs(finishedDistance) + visableWidth)
    } else if (foldNum >= 0) {
      //直接移动到最后一个
      const lastTagEl = Array.from(tagsRef.value.children)[
        tagsRef.value.children.length - 1
      ] as HTMLElement
      distanceOfTagbar.value = -(lastTagEl.offsetLeft + lastTagEl.offsetWidth - visableWidth + 2)
    }
  }
}
const tagRegisterObserve = () => {
  for (let i = 0; i < tagsRef.value.children.length; i++) {
    intersectionObserver.observe(tagsRef.value.children[i])
  }
}
const mainRef = ref<HTMLElement>()
nextTick(() => {
  // observes = judgeOverXByEls(tagsWrapperRef.value, [tagsRef.value], isOver)
  observes = judgeOverXByChildren(tagsWrapperRef.value, isOver)
  //等待菜单折叠
  const ob = new ResizeObserver(
    bounce(() => {
      tagRegisterObserve()
      ob.unobserve(mainRef.value)
    }, 100)
  )
  ob.observe(mainRef.value)
})
onMounted(() => {
  otherStore.setRedirectRoute()
})
onUnmounted(() => {
  removeObserver(observes)
})
</script>
<style scoped>
.content {
  display: flex;
  flex: 1;
  height: calc(100% - var(--main-head-height));

  main {
    background-color: var(--main-bg-color);
    width: 100%;
    padding: 10px 15px 15px 15px;
    overflow-x: hidden;
    .content-wrapper {
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
      /* overflow: hidden; */
      .tags-container {
        height: var(--main-tags-height);
        background-color: var(--main-tag-bg-color);
        display: flex;
        align-items: center;
        padding-left: 5px;
        flex-shrink: 0;
        .icon {
          font-size: var(--main-head-icon-size) !important;
          flex-shrink: 0;
        }
        :deep(.el-divider--vertical) {
          margin-right: unset;
        }
        .tags-wrapper {
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          overflow: hidden;
          transition: all 0.3s;
          .tags {
            display: flex;
            align-items: center;
            position: relative;
            height: var(--main-tags-height);
            transition: all 0.3s;
            .default {
              box-sizing: border-box;
              height: calc(100% - 4px);
              margin-left: 10px;
              border: 1px solid #4060c7;
              --el-tag-text-color: var(--main-tag-basic-color);
              --el-text-color-regular: var(--main-tag-basic-color);
            }
            .default:first-of-type {
              margin-left: 0px;
            }
            .active {
              --el-text-color-regular: #ffffff;
              color: #ffffff !important;
              background-color: #4060c7 !important;
              --el-color-primary: #4060c7 !important;
            }
          }
        }
        .tag-arrow {
          flex-shrink: 0;
          width: var(--tag-arrow-width);
          justify-content: center;
        }
        .tag-arrow-left {
          width: var(--tag-arrow-width);
        }
        .tag-arrow-right {
          box-shadow: var(--el-box-shadow-light);
        }
      }
    }
  }
}
</style>
