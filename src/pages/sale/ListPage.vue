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
            Vendas
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
          <q-btn icon="mdi-view-list-outline" color="info" dense size="sm" @click="handleShowSaleDetails(props.row)">
              <q-tooltip>
                Detalhes
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
import { columnsSale } from './table'
import DialogSaleDetails from 'src/components/DialogSaleDetails.vue'

export default defineComponent({
  name: 'listSalePage',
  components: {
    DialogSaleDetails
  },
  setup () {
    const sales = ref([])
    const listSalesItens = ref([])
    const { list, remove, getListStock, update, getById, getListTransactionItens } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const loading = ref(true)
    const showDialogDetails = ref(false)
    const $q = useQuasar()

    const handleListSale = async () => {
      try {
        loading.value = true
        sales.value = await list('list_sales')
        loading.value = false
      } catch (error) {
        notifyError(error.message)
      }
    }

    onMounted(() => {
      handleListSale()
    })

    const updateStockEntry = async (productId, quant) => {
      try {
        const product = await getById('product', productId)
        if (product.amount >= 0) {
          product.amount += quant
          await update('product', product)
        }
      } catch (error) {
        notifyError(error)
      }
    }

    const handleRemoveSale = (sale) => {
      try {
        $q.dialog({
          title: 'Confirma',
          message: `Gostaria realmente de remover a venda - ${sale.id}?`,
          cancel: true,
          persistent: true
        }).onOk(async () => {
          const stock = await getListStock('mov_stock', sale.id)
          stock.forEach(item => {
            updateStockEntry(item.product_id, item.quant)
          })
          await remove('transaction', sale.id)
          notifySuccess('Removido com sucesso')
          handleListSale()
        })
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleShowSaleDetails = async (sale) => {
      const listIens = await getListTransactionItens('transaction_has_product', sale.id)
      listSalesItens.value = listIens
      showDialogDetails.value = true
    }

    return {
      columnsSale,
      sales,
      loading,
      handleRemoveSale,
      handleShowSaleDetails,
      listSalesItens,
      showDialogDetails
    }
  }
})
</script>
