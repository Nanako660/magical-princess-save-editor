import { ref, onMounted, onUnmounted } from 'vue'

export function useViewportTableHeight(offset = 260, min = 360) {
  const tableHeight = ref(min)

  const updateHeight = () => {
    tableHeight.value = Math.max(min, window.innerHeight - offset)
  }

  onMounted(() => {
    updateHeight()
    window.addEventListener('resize', updateHeight)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateHeight)
  })

  return { tableHeight }
}
