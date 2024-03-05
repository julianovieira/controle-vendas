<template>
 <q-page padding>
    <div class="row">
      <q-table
        class="col-12"
        :rows="entries"
        :columns="columnsEntry"
        :loading="loading"
        row-key="id"
      >
      <template v-slot:top>
        <span class="text-h6">
            Entradas
        </span>
        <q-space />
        <q-btn v-if="$q.platform.is.desktop"
          label="Adicionar"
          color="primary"
          icon="mdi-plus-box"
          rounded
          flat
          :to="{ name: 'form-entry' }" >
            <q-tooltip>
              Entrada Nova
            </q-tooltip>
        </q-btn>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-sm">
          <q-btn icon="mdi-view-list-outline" color="info" dense size="sm" @click="handleShowEntryDetails(props.row)">
              <q-tooltip>
                Detalhes
              </q-tooltip>
            </q-btn>
            <q-btn icon="mdi-delete-outline" color="negative" dense size="sm" @click="handleRemoveEntry(props.row)">
              <q-tooltip>
                Remover
              </q-tooltip>
            </q-btn>
        </q-td>
      </template>
      </q-table>
    </div>
    <!-- Botão flutuante para cadastro de entradas em despositivo mobile -->
    <q-page-sticky v-if="$q.platform.is.mobile"
      position="bottom-right"
      :offset="[18, 18]">
      <q-btn fab icon="mdi-plus" color="primary" :to="{ name: 'form-entry'}">
      </q-btn>
    </q-page-sticky>
    <DialogSaleDetails
      :show="showDialogDetails"
      :listItens="listSalesItens"
      @hide-dialog="showDialogDetails = false"
    >
    </DialogSaleDetails>
 </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import useApi from 'src/composables/useApi'
import useNotify from 'src/composables/useNotify'
import { useQuasar } from 'quasar'
import { columnsEntry } from './table'
import DialogSaleDetails from 'src/components/DialogSaleDetails.vue'

export default defineComponent({
  name: 'listEntryPage',
  components: {
    DialogSaleDetails
  },
  setup () {
    const entries = ref([])
    const listSalesItens = ref([])
    const { list, remove, getListStock, update, getById, getListTransactionItens } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const loading = ref(true)
    const showDialogDetails = ref(false)
    const $q = useQuasar()

    const handleListEntry = async () => {
      try {
        loading.value = true
        entries.value = await list('list_entries')
        loading.value = false
      } catch (error) {
        notifyError(error.message)
      }
    }

    onMounted(() => {
      handleListEntry()
    })

    const updateStockOutput = async (productId, quant) => {
      try {
        const product = await getById('product', productId)
        if (product.amount > 0) {
          product.amount -= quant
          await update('product', product)
        }
      } catch (error) {
        notifyError(error)
      }
    }

    const recalculateAvgCostPrice = async (entry) => {
      try {
        const transactions = await getListTransactionItens('transaction_has_product', entry.id)
        transactions.forEach(async (item) => {
          const product = await getById('product', item.product_id)
          if (product.avg_cost_price_ant > 0) {
            product.avg_cost_price = product.avg_cost_price_ant
            product.avg_cost_price_ant = 0
            await update('product', product)
          }
          if (entries.value.length === 1) {
            product.avg_cost_price = 0
            await update('product', product)
          }
        })
      } catch (error) {
        notifyError(error)
      }
    }

    const handleRemoveEntry = (entry) => {
      try {
        $q.dialog({
          title: 'Confirma',
          message: `Gostaria realmente de remover a venda - ${entry.id}?`,
          cancel: true,
          persistent: true
        }).onOk(async () => {
          const stock = await getListStock('mov_stock', entry.id)
          stock.forEach(item => {
            updateStockOutput(item.product_id, item.quant)
          })
          await recalculateAvgCostPrice(entry)
          await remove('transaction', entry.id)
          notifySuccess('Removido com sucesso')
          handleListEntry()
        })
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleShowEntryDetails = async (entry) => {
      const listIens = await getListTransactionItens('transaction_has_product', entry.id)
      listSalesItens.value = listIens
      showDialogDetails.value = true
    }

    return {
      columnsEntry,
      entries,
      loading,
      handleRemoveEntry,
      handleShowEntryDetails,
      listSalesItens,
      showDialogDetails
    }
  }
})
</script>
