import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

export function useDeferredTableRender(totalCount, options = {}) {
  const {
    initialCount = 24,
    batchSize = 24,
    batchDelay = 16
  } = options

  const isReady = ref(false)
  const visibleCount = ref(0)

  let frameId = null
  let timerId = null

  const resolveTotal = () => {
    const value = typeof totalCount === 'function' ? totalCount() : totalCount?.value
    return Number.isFinite(value) ? Math.max(0, value) : 0
  }

  const clearPending = () => {
    if (frameId !== null) {
      cancelAnimationFrame(frameId)
      frameId = null
    }
    if (timerId !== null) {
      clearTimeout(timerId)
      timerId = null
    }
  }

  const flushVisibleCount = () => {
    const total = resolveTotal()
    if (!isReady.value) {
      visibleCount.value = 0
      return
    }

    if (visibleCount.value === 0) {
      visibleCount.value = Math.min(initialCount, total)
    } else if (visibleCount.value > total) {
      visibleCount.value = total
    }

    if (visibleCount.value >= total) return

    timerId = setTimeout(() => {
      visibleCount.value = Math.min(total, visibleCount.value + batchSize)
      flushVisibleCount()
    }, batchDelay)
  }

  const start = () => {
    clearPending()
    isReady.value = false
    visibleCount.value = 0
    frameId = requestAnimationFrame(() => {
      isReady.value = true
      flushVisibleCount()
    })
  }

  watch(
    () => resolveTotal(),
    (total) => {
      if (!isReady.value) return
      if (total === 0) {
        clearPending()
        visibleCount.value = 0
        return
      }
      if (visibleCount.value === 0) {
        visibleCount.value = Math.min(initialCount, total)
      }
      flushVisibleCount()
    }
  )

  onMounted(start)
  onUnmounted(clearPending)

  return {
    isReady,
    visibleCount,
    isComplete: computed(() => isReady.value && visibleCount.value >= resolveTotal()),
    start
  }
}
