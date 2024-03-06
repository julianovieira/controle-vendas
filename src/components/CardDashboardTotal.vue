<template>
  <q-card bordered v-ripple:primary>
    <q-skeleton height="50px" v-if="load" />
    <q-card-section class="row justify-between" v-else>
      <div>
        <div class="text-h6">
          {{ total }}
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
import { formatCurrency } from 'src/utils/format'

export default defineComponent({
  name: 'CardDashboardTotal',
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
    const total = ref(0)
    const load = ref(true)
    const { list } = useApi()

    onMounted(async () => {
      const sales = await list(props.table)
      let totalItem = 0
      sales.forEach(item => {
        totalItem += item.total_value
      })
      total.value = formatCurrency(totalItem)
      load.value = false
    })

    return {
      total,
      load
    }
  }
})
</script>
