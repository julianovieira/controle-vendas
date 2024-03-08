<template>
  <div id="chart" class="q-pa-sm">
    <apexchart type="bar" height="360" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>

import useApi from 'src/composables/useApi'
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({

  setup () {
    const { list } = useApi()
    const listProduct = ref([])
    const totalProduct = ref([])
    onMounted(() => {
      handleSalesPerProduct()
    })
    const handleSalesPerProduct = async () => {
      const product = await list('sales_per_product')
      product.forEach(item => {
        listProduct.value.push(item.description)
        totalProduct.value.push(item.total)
      })
    }
    const series = ref([{ name: 'Total Vendido', data: totalProduct }])
    const chartOptions = ref({
      chart: {
        type: 'bar',
        height: 360
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: listProduct
      }
    })

    return {
      series,
      chartOptions
    }
  }
})
</script>
