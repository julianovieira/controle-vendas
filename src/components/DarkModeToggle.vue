<template>
  <q-toggle
    v-model="darkMode"
    checked-icon="mdi-weather-night"
    color="dark"
    unchecked-icon="mdi-white-balance-sunny"
    size="md"
  />
</template>
<script>
import { defineComponent, ref, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'DarkMode',
  setup () {
    const darkMode = ref(false)
    const $q = useQuasar()

    onMounted(() => {
      const darkModeisActive = $q.localStorage.getItem('darkMode')
      if (darkModeisActive) {
        darkMode.value = true
      }
    })

    watch(darkMode, (darkMode) => {
      $q.dark.set(darkMode)
      $q.localStorage.set('darkMode', darkMode)
    })

    return {
      darkMode
    }
  }
})
</script>
