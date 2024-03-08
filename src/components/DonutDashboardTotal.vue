<template>
  <div id="chart" class="q-pa-sm">
        <apexchart type="donut" :options="chartOptions" :series="series"></apexchart>
      </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import useApi from 'src/composables/useApi'

export default defineComponent({
  setup () {
    const { list } = useApi()
    const totalCategory = ref([])
    const listCategory = ref([])

    onMounted(() => {
      handleSalesPerCategory()
    })

    const handleSalesPerCategory = async () => {
      const category = await list('sales_per_category')
      console.log(category)
      category.forEach(item => {
        totalCategory.value.push(item.total)
        listCategory.value.push(item.description)
      })
    }
    const series = ref(totalCategory)
    const chartOptions = ref({
      chart: {
        type: 'donut'
      },
      labels: listCategory,
      responsive: [{
        breakpoint: 400,
        options: {
          chart: {
            width: 360
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    })
    return {
      series,
      chartOptions
    }
  }
})
</script>
