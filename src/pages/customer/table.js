import { ref } from 'vue'
import { formatCPF, formatPhone } from 'src/utils/format'

const columnsCustomer = [
  { name: 'name', align: 'left', label: 'Nome', field: 'name', sortable: false },
  { name: 'cpf_cnpf', align: 'left', label: 'CFP/CNPJ', field: 'cpf_cnpj', format: (val) => formatCPF(val), sortable: true },
  { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
  { name: 'phone', align: 'left', label: 'Telefone', field: 'phone', format: (val) => formatPhone(val), sortable: true },
  { name: 'address', align: 'left', label: 'Endereço', field: 'address', sortable: true },
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
