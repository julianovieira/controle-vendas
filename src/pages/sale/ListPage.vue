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
import { useQuasar } from 'quasar'
import { columnsSale } from './table'

export default defineComponent({
  name: 'listSalePage',
  setup () {
    const sales = ref([])
    const { list, remove, getListStock, update, getById } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const loading = ref(true)
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

    const updateStockReturn = async (productId, quant) => {
      try {
        const product = await getById('product', productId)
        if (product.amount > 0) {
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
            updateStockReturn(item.product_id, item.quant)
          })
          await remove('sale', sale.id)
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
      handleRemoveSale
    }
  }
})
</script>
