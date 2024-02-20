import { formatCurrency } from 'src/utils/format'
import { ref } from 'vue'

const columnsProduct = [
  { name: 'image_url', align: 'left', label: 'Imagem', field: 'image_url', sortable: false },
  { name: 'name', align: 'left', label: 'Nome', field: 'name', sortable: true },
  { name: 'price', align: 'left', label: 'Preço', field: 'price', format: (val) => formatCurrency(val), sortable: true },
  { name: 'amount', align: 'left', label: 'Estoque', field: 'amount', sortable: true },
  { name: 'actions', align: 'right', label: 'Ações', field: 'actions' }
]

const initialPagination = ref({
  page: 1,
  rowsPerPage: 8
})

export {
  columnsProduct,
  initialPagination
}
