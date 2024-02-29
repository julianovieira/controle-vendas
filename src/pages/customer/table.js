import { ref } from 'vue'
import { formatPhone } from 'src/utils/format'

const columnsCustomer = [
  { name: 'name', align: 'left', label: 'Nome', field: 'name', sortable: false },
  { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
  { name: 'phone', align: 'left', label: 'Telefone', field: 'phone', format: (val) => formatPhone(val), sortable: true },
  { name: 'description', align: 'left', label: 'Observação', field: 'description', sortable: true },
  { name: 'actions', align: 'right', label: 'Ações', field: 'actions' }
]

const initialPagination = ref({
  page: 1,
  rowsPerPage: 8
})

export {
  columnsCustomer,
  initialPagination
}
