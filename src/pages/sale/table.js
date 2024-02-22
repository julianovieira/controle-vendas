import { formatCurrency } from 'src/utils/format'
import { ref } from 'vue'

const columnsSale = [
  { name: 'id_produto', align: 'left', label: 'Código', field: 'id_produto', sortable: false },
  { name: 'description', align: 'left', label: 'Descrição', field: 'description', sortable: true },
  { name: 'quant', align: 'left', label: 'Quantidade', field: 'quant', sortable: true },
  { name: 'price_unit', align: 'left', label: 'Preço Unit', field: 'price_unit', format: (val) => formatCurrency(val), sortable: true },
  { name: 'price_total', align: 'left', label: 'Preço Total', field: 'price_total', format: (val) => formatCurrency(val), sortable: true },
  { name: 'actions', align: 'right', label: 'Ações', field: 'actions' }
]

const initialPagination = ref({
  page: 1,
  rowsPerPage: 8
})

export {
  columnsSale,
  initialPagination
}
