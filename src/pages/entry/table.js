import { formatCurrency, formatDate } from 'src/utils/format'
import { ref } from 'vue'

const columnsEntryItens = [
  { name: 'product_id', align: 'left', label: 'Código', field: 'product_id', sortable: false },
  { name: 'description', align: 'left', label: 'Descrição', field: 'description', sortable: true },
  { name: 'quant', align: 'left', label: 'Quantidade', field: 'quant', sortable: true },
  { name: 'price_unit', align: 'left', label: 'Preço Unit', field: 'price_unit', format: (val) => formatCurrency(val), sortable: true },
  { name: 'price_total', align: 'left', label: 'Preço Total', field: 'price_total', format: (val) => formatCurrency(val), sortable: true },
  { name: 'actions', align: 'right', label: 'Ações', field: 'actions' }
]

const columnsEntry = [
  { name: 'id', align: 'left', label: 'Nr Docto', field: 'id', sortable: false },
  { name: 'created_at', align: 'left', label: 'Data Emissão', field: 'created_at', format: (val) => formatDate(val), sortable: true },
  { name: 'type_mov_name', align: 'left', label: 'Tipo Movto', field: 'type_mov_name', sortable: false },
  { name: 'provider_name', align: 'left', label: 'Fornecedor', field: 'provider_name', sortable: true },
  { name: 'payment_name', align: 'left', label: 'Cod Pagto', field: 'payment_name', sortable: true },
  { name: 'total_value', align: 'left', label: 'Preço Total', field: 'total_value', format: (val) => formatCurrency(val), sortable: true },
  { name: 'actions', align: 'right', label: 'Ações', field: 'actions' }
]

const initialPagination = ref({
  page: 1,
  rowsPerPage: 8
})

export {
  columnsEntryItens,
  columnsEntry,
  initialPagination
}
