<template>
  <q-page padding>
    <!-- Informações de gerais do pedido -->
    <div class="row q-gutter-sm q-pa-sm">
      <q-card class="col-md-12 col-sm-12 col-xs-12 q-pa-md">
        <div class="text-h6 text-center text-bold q-mb-md">Informações de Entrada </div>
        <div class="row q-gutter-md q-px-sm">
          <div class="col-md-7 col-sm-12 col-xs-12">
            <!-- Informações sobre fornecedr -->
            <div class="text-left text-bold">Fornecedor</div>
            <div class="row">
              <q-select
                class="col-12 "
                filled
                standout
                placeholder="Selecionar"
                v-model="providers"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                :options="optionsProviders"
                @filter="filterFnProviders"
                @input-value="setProviders"
                dense
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sem resultados
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-select>
            </div>
          </div>
          <!-- Informações sobre a forma de pagamento -->
          <div class="col-md-4 col-sm-12 col-xs-12">
            <div class="text-left text-bold" >Pagamento</div>
            <q-select
              filled
              standout
              placeholder="Selecionar"
              v-model="payments"
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              :options="optionsPayments"
              @filter="filterFnPayments"
              @input-value="setPayments"
              dense
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sem resultados
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-select>
          </div>
        </div>
      </q-card>
    <!-- Informações tela adicinar itens de produtos -->
      <q-card class="col-md-12 col-sm-12 col-xs-12 q-pa-md">
        <div class="q-px-sm">
          <div class="text-left text-bold">Produto</div>
          <div class="row q-gutter-md">
            <q-select
              class="col-md-5 col-sm-12 col-xs-12"
              filled
              standout
              placeholder="Selecionar"
              v-model="products"
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              :options="options"
              @filter="filterFn"
              @input-value="setProduct"
              dense
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sem resultados
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-select>
            <q-input
              class="col-md-3 col-sm-12 col-xs-12"
              label="Quantidade"
              filled
              v-model="formProductList.quant"
              min="0"
              dense
              type="number"
            />
            <q-input
              class="col-md-3 col-sm-12 col-xs-12"
              label="Preço"
              filled
              v-model="formProductList.price_unit"
              min="0"
              prefix="R$"
              dense
              type="number"
            />
          </div>
          <div class="row justify-between">
            <q-btn
              flat
              class="q-pa-sm"
              color="primary"
              label="Inserir Produto"
              @click="insertListItem"
              dense
              no-caps
            />
            <div class="flex text-center q-mr-sm">
              <label class="text-subtitle2 text-primary q-pa-md"><strong>Total: </strong></label>
              <span class=" q-ml-sm text-subtitle2 text-bold text-primary q-pa-md">
                R$ {{ (formProductList.price_unit * formProductList.quant).toFixed(2) }}
              </span>
            </div>
          </div>
        </div>
      </q-card>
    </div>
  <!-- Informações da listagem de produtos -->
    <div class="row q-mt-sm">
      <q-card class="col-md-12 col-sm-12 col-xs-12 q-pa-md" >
        <q-table
        title="Lista Produtos"
        :rows="listItensEntry"
        :columns="columnsEntryItens"
        row-key="name"
        virtual-scroll
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
        hide-pagination
        >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
              <q-btn icon="mdi-delete-outline" color="negative" dense size="sm" @click="handleRemoveProduct(props.rowIndex)">
                <q-tooltip>
                  Remover
                </q-tooltip>
              </q-btn>
          </q-td>
        </template>
        </q-table>
      </q-card>
    </div>
<!-- Informações de total venda e botão finalizar -->
    <div class="row q-mt-md">
      <q-card class="row justify-between col-md-12 col-sm-12 col-xs-12 q-pa-md q-col-gutter-y-sm">
        <div class="flex text-center q-mr-sm">
          <label class="text-h6"><strong>Total: </strong></label>
          <span class=" q-ml-md text-h6 text-bold">
            R$ {{saleTotal(listItensEntry)}}
          </span>
        </div>
        <div>
          <q-btn
            color="primary"
            text-color="white"
            unelevated
            icon="mdi-cart-outline"
            label="Finalizar Entrada"
            size="md"
            @click="submitEndEntry"
          />
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script>

import { defineComponent, onMounted, ref, watch } from 'vue'
import useApi from 'src/composables/useApi'
import useNotify from 'src/composables/useNotify'
import { columnsEntryItens } from './table'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup () {
    const products = ref([])
    const providers = ref([])
    const payments = ref([])

    const { list, post, getById, update } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const router = useRouter()

    const listProducts = ref([])
    const listProviders = ref([])
    const listPayment = ref([])

    const stringOptions = ref([])
    const newStringOptions = ref([])
    const options = ref(stringOptions)

    const stringOptionsProviders = ref([])
    const newStringOptionsProviders = ref([])
    const optionsProviders = ref(stringOptionsProviders)

    const stringOptionsPayments = ref([])
    const newStringOptionsPayments = ref([])
    const optionsPayments = ref(stringOptionsPayments)

    const formProductList = ref({
      transaction_id: '',
      product_id: '',
      description: '',
      quant: 0,
      price_unit: 0,
      price_total: 0
    })

    const formEntry = ref({
      total_value: 0,
      payment_id: '',
      type_mov_id: '',
      provider_id: ''
    })

    const formMovStock = ref({
      transaction_id: '',
      product_id: '',
      type_mov_id: '',
      quant: 0
    })

    const listItensEntry = ref([])

    onMounted(() => {
      handlePerProducts()
      handlePerProviders()
      handlePerPayments()
      if (localStorage.getItem('listItensEntry')) {
        listItensEntry.value = JSON.parse(localStorage.getItem('listItensEntry'))
      }
    })

    watch(listItensEntry, () => {
      saleTotal(listItensEntry.value)
    })

    const insertListItem = () => {
      formProductList.value.product_id = products.value.id
      formProductList.value.description = products.value.label
      formProductList.value.price_total = (formProductList.value.price_unit * formProductList.value.quant)
      const formList = formProductList.value
      listItensEntry.value.push(formList)
      localStorage.setItem('listItensEntry', JSON.stringify(listItensEntry.value))
      formProductList.value = { product_id: '', description: '', quant: 0, price_unit: 0, price_total: 0 }
    }

    const updateStockEntry = async (productId, quant) => {
      try {
        const product = await getById('product', productId)
        product.amount += quant
        await update('product', product)
      } catch (error) {
        notifyError(error)
      }
    }

    const calculateAvgCostPrice = async (productId, quant, price) => {
      try {
        const product = await getById('product', productId)
        if (product.amount === 0) {
          product.avg_cost_price = price
          product.avg_cost_price_ant = 0
          await update('product', product)
        } else {
          product.avg_cost_price_ant = product.avg_cost_price
          product.avg_cost_price = ((product.avg_cost_price * product.amount) + (quant * price)) / (product.amount + quant)
          await update('product', product)
        }
      } catch (error) {
        notifyError(error)
      }
    }

    const handlePerProducts = async () => {
      try {
        const data = await list('product')
        listProducts.value = data
        listProducts.value.forEach((product) => {
          stringOptions.value.push({ label: product.name, id: product.id })
        })
        newStringOptions.value = stringOptions.value
      } catch (error) {
        notifyError(error)
      }
    }

    const handlePerProviders = async () => {
      try {
        const data = await list('provider')
        listProviders.value = data
        listProviders.value.forEach((provider) => {
          stringOptionsProviders.value.push({ label: provider.name, id: provider.id })
        })
        newStringOptionsProviders.value = stringOptionsProviders.value
      } catch (error) {
        notifyError(error)
      }
    }

    const handlePerPayments = async () => {
      try {
        const data = await list('payment')
        listPayment.value = data
        listPayment.value.forEach((payment) => {
          stringOptionsPayments.value.push({ label: payment.name, id: payment.id })
        })
        newStringOptionsPayments.value = stringOptionsPayments.value
      } catch (error) {
        notifyError(error)
      }
    }

    const handleRemoveProduct = (id) => {
      listItensEntry.value.splice(id, 1)
      localStorage.setItem('listItensEntry', JSON.stringify(listItensEntry.value))
    }

    const filterFn = (val, update, abort) => {
      update(() => {
        const needle = val.toLocaleLowerCase()
        if (val === '') {
          options.value = stringOptions.value
        } else {
          options.value = newStringOptions.value.filter(v => v.label.toLocaleLowerCase().includes(needle))
        }
      })
    }

    const filterFnProviders = (val, update, abort) => {
      update(() => {
        const needle = val.toLocaleLowerCase()
        if (val === '') {
          optionsProviders.value = stringOptionsProviders.value
        } else {
          optionsProviders.value = newStringOptionsProviders.value.filter(v => v.label.toLocaleLowerCase().includes(needle))
        }
      })
    }

    const filterFnPayments = (val, update, abort) => {
      update(() => {
        const needle = val.toLocaleLowerCase()
        if (val === '') {
          optionsPayments.value = stringOptionsPayments.value
        } else {
          optionsPayments.value = newStringOptionsPayments.value.filter(v => v.label.toLocaleLowerCase().includes(needle))
        }
      })
    }

    const submitEndEntry = async () => {
      try {
        if (listItensEntry.value.length) {
          formEntry.value.provider_id = providers.value.id
          formEntry.value.payment_id = payments.value.id
          formEntry.value.type_mov_id = 1

          formEntry.value.total_value = parseFloat(saleTotal(listItensEntry.value))

          const entrada = await post('transaction', formEntry.value)

          listItensEntry.value.forEach(async (item) => {
            item.transaction_id = entrada[0].id

            await post('transaction_has_product', item)

            formMovStock.value.product_id = item.product_id
            formMovStock.value.quant = item.quant
            formMovStock.value.type_mov_id = 1
            formMovStock.value.transaction_id = entrada[0].id

            const stock = await post('mov_stock', formMovStock.value)
            await calculateAvgCostPrice(item.product_id, parseInt(item.quant), parseFloat(item.price_unit))
            await updateStockEntry(stock[0].product_id, stock[0].quant)
          })
          localStorage.removeItem('listItensEntry')
          notifySuccess('Entrada salva com sucesso')
          router.push({ name: 'entry' })
        } else {
          notifyError('Não é permitida entrada SEM ITENS')
        }
      } catch (error) {
        notifyError(error)
      }
    }

    const setProduct = (val) => {
      products.value = val
    }

    const setProviders = (val) => {
      providers.value = val
    }

    const setPayments = (val) => {
      payments.value = val
    }

    const saleTotal = (listItem) => {
      let total = 0
      if (listItem.length > 0) {
        listItem.forEach(item => {
          total += item.price_unit * item.quant
        })
      }
      return total.toFixed(2)
    }

    return {
      products,
      providers,
      payments,
      options,
      optionsProviders,
      optionsPayments,
      handlePerProducts,
      handlePerProviders,
      handleRemoveProduct,
      submitEndEntry,
      filterFn,
      filterFnProviders,
      filterFnPayments,
      setProduct,
      setProviders,
      setPayments,
      formProductList,
      columnsEntryItens,
      listItensEntry,
      saleTotal,
      insertListItem,
      pagination: ref({
        rowsPerPage: 10
      })
    }
  }
})
</script>
