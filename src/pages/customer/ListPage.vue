import { pushScopeId } from 'vue';
<template>
 <q-page padding>
    <div class="row">
      <q-table
        class="col-12"
        :rows="customers"
        :columns="columnsCustomer"
        :loading="loading"
        row-key="id"
        :filter="filter"
      >
      <template v-slot:top>
        <span class="text-h6">
            Clientes
        </span>
        <q-space />
        <q-input outlined dense debounce="200" v-model="filter" placeholder="Buscar Cliente" class="q-mr-sm">
          <template v-slot:append>
            <q-icon name="mdi-magnify" />
          </template>
        </q-input>
        <q-btn v-if="$q.platform.is.desktop"
          label="Adicionar"
          color="primary"
          icon="mdi-plus-box"
          rounded
          flat
          :to="{ name: 'form-customer' }" >
            <q-tooltip>
              Cliente Novo
            </q-tooltip>
        </q-btn>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-sm">
            <q-btn icon="mdi-file-edit-outline" color="info" dense size="sm" @click="handleEdit(props.row)" >
              <q-tooltip>
                Editar
              </q-tooltip>
            </q-btn>
            <q-btn icon="mdi-delete-outline" color="negative" dense size="sm" @click="handleRemoveProduct(props.row)">
              <q-tooltip>
                Remover
              </q-tooltip>
            </q-btn>
        </q-td>
      </template>
      </q-table>
    </div>
    <!-- Botão flutuante para cadastro de categoria em despositivo mobile -->
    <q-page-sticky v-if="$q.platform.is.mobile"
      position="bottom-right"
      :offset="[18, 18]">
      <q-btn fab icon="mdi-plus" color="primary" :to="{ name: 'form-customer'}">
      </q-btn>
    </q-page-sticky>
 </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import useApi from 'src/composables/useApi'
import useNotify from 'src/composables/useNotify'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { columnsCustomer } from './table'

export default defineComponent({
  name: 'listCustomerPage',
  setup () {
    const customers = ref([])
    const filter = ref('')
    const { list, remove } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const table = 'customer'
    const loading = ref(true)
    const router = useRouter()
    const $q = useQuasar()

    const handleListCustomers = async () => {
      try {
        loading.value = true
        customers.value = await list(table)
        loading.value = false
      } catch (error) {
        notifyError(error.message)
      }
    }

    onMounted(() => {
      handleListCustomers()
    })

    const handleEdit = (customer) => {
      router.push({ name: 'form-customer', params: { id: customer.id } })
    }

    const handleRemoveProduct = (customer) => {
      try {
        $q.dialog({
          title: 'Confirme',
          message: `Gostaria realmente de remover (a/o) cliente - ${customer.name}?`,
          cancel: true,
          persistent: true
        }).onOk(async () => {
          await remove(table, customer.id)
          notifySuccess('Removido com sucesso')
          handleListCustomers()
        })
      } catch (error) {
        notifyError(error.message)
      }
    }

    return {
      columnsCustomer,
      customers,
      filter,
      loading,
      handleEdit,
      handleRemoveProduct
    }
  }
})
</script>
