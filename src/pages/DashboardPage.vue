<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-md-3 col-sm-12 col-xs-12">
        <card-dashboard-total
        class="bg-positive"
          table="list_sales"
          label="Vendas"
          icon="mdi-finance"
        />
      </div>
      <div class="col-md-3 col-sm-12 col-xs-12">
        <card-dashboard-total
        class="bg-negative"
          table="list_entries"
          label="Compras"
          icon="mdi-cart-variant"
        />
      </div>
      <div class="col-md-3 col-sm-12 col-xs-12">
        <card-dashboard-count
          class="bg-info"
          table="customer"
          label="Clientes"
          icon="mdi-account-group"
        />
      </div>
      <div class="col-md-3 col-sm-12 col-xs-12">
        <card-dashboard-count
          class="bg-warning"
          table="product"
          label="Produtos"
          icon="mdi-gift-open-outline"
        />
      </div>
    </div>
    <div class="row justify-around q-col-gutter-sm q-mt-lg">
      <div class="col-md-6 col-sm-12 col-xs-12">
        <p class="text-h6 text-bold text-center">Vendas por Produtos</p>
        <bar-dashboard-total />
      </div>
      <div class="col-md-5 col-sm-12 col-xs-12">
        <p class="text-h6 text-bold text-center">Vendas por Categoria</p>
        <div>
          <donut-dashboard-total />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import CardDashboardCount from 'src/components/CardDashboardCount.vue'
import CardDashboardTotal from 'src/components/CardDashboardTotal.vue'
import DonutDashboardTotal from 'src/components/DonutDashboardTotal.vue'
import BarDashboardTotal from 'src/components/BarDashboardTotal.vue'

export default defineComponent({
  name: 'DashboardPage',
  components: {
    CardDashboardCount, CardDashboardTotal, DonutDashboardTotal, BarDashboardTotal
  },
  setup () {
    return {
    }
  }
})
</script>
