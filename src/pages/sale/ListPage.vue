<template>
 <q-page padding>
    <div class="row">
      <q-table
        class="col-12"
        :rows="sales"
        :columns="columnsSale"
        :loading="loading"
        row-key="id"
      >
      <template v-slot:top>
        <span class="text-h6">
            Lançamentos
        </span>
        <q-space />
        <q-btn v-if="$q.platform.is.desktop"
          label="Adicionar"
          color="primary"
          icon="mdi-plus-box"
          rounded
          flat
          :to="{ name: 'form-sale' }" >
            <q-tooltip>
              Lançamento Novo
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
            <q-btn icon="mdi-delete-outline" color="negative" dense size="sm" @click="handleRemoveSale(props.row)">
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
      <q-btn fab icon="mdi-plus" color="primary" :to="{ name: 'form-sale'}">
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
import { columnsSale } from './table'

export default defineComponent({
  name: 'listSalePage',
  setup () {
    const sales = ref([])
    const { list, remove } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const table = 'list_sales'
    const loading = ref(true)
    const router = useRouter()
    const $q = useQuasar()

    const handleListSale = async () => {
      try {
        loading.value = true
        sales.value = await list(table)
        loading.value = false
      } catch (error) {
        notifyError(error.message)
      }
    }

    onMounted(() => {
      handleListSale()
    })

    const handleEdit = (sale) => {
      router.push({ name: 'form-sale', params: { id: sale.id } })
    }

    const handleRemoveSale = (sale) => {
      try {
        $q.dialog({
          title: 'Confirma',
          message: `Gostaria realmente de remover a venda - ${sale.id}?`,
          cancel: true,
          persistent: true
        }).onOk(async () => {
          await remove(table, sale.id)
          notifySuccess('Removido com sucesso')
          handleListSale()
        })
      } catch (error) {
        notifyError(error.message)
      }
    }

    return {
      columnsSale,
      sales,
      loading,
      handleEdit,
      handleRemoveSale
    }
  }
})
</script>
