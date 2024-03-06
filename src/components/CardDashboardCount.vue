<template>
  <q-card bordered v-ripple:primary>
    <q-skeleton height="50px" v-if="load" />
    <q-card-section class="row justify-between" v-else>
      <div>
        <div class="text-h6">
          {{ count }}
        </div>
        <div class="text-h6">
          {{ label }}
        </div>
      </div>
      <div>
        <q-btn flat round color="white" size="1.5rem" :icon="icon" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import useApi from 'src/composables/useApi'
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'CardDashboardCount',
  props: {
    table: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: false,
      default: 'mdi-database-outline'
    }
  },
  setup (props) {
    const count = ref(0)
    const load = ref(true)
    const { fetchCount } = useApi()

    onMounted(async () => {
      const response = await fetchCount(props.table)
      count.value = response.count
      load.value = false
    })

    return {
      count,
      load
    }
  }
})
</script>
