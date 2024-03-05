<template>
    <q-dialog
      :full-width="$q.platform.is.mobile"
      :model-value="show"
      @befor-hide="handleClose"
      persistent
    >
        <q-card>
            <q-card-section>
              <div class="q-mt-sm">
                <q-table
                  title="Itens Vendidos"
                  :rows="listItens"
                  :columns="columnsSaleItens"
                  row-key="product_id"
                  hide-bottom
                />
              </div>
            </q-card-section>
            <q-card-actions align="right" class="q-mr-md">
                <q-btn label="Fechar" outline color="primary" v-close-popup @click="handleClose" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import { formatCurrency } from 'src/utils/format'

const columnsSaleItens = [
  { name: 'product_id', align: 'left', label: 'Código', field: 'product_id', sortable: false },
  { name: 'description', align: 'left', label: 'Descrição', field: 'description', sortable: true },
  { name: 'quant', align: 'left', label: 'Quantidade', field: 'quant', sortable: true },
  { name: 'price_unit', align: 'left', label: 'Preço Unit', field: 'price_unit', format: (val) => formatCurrency(val), sortable: true },
  { name: 'price_total', align: 'left', label: 'Preço Total', field: 'price_total', format: (val) => formatCurrency(val), sortable: true }
]

export default defineComponent({
  name: 'DialogProductDetails',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    listItens: {
      type: Array
    }
  },
  setup (props, { emit }) {
    const handleClose = () => {
      emit('hideDialog')
    }
    return {
      formatCurrency,
      handleClose,
      columnsSaleItens
    }
  }
})
</script>
