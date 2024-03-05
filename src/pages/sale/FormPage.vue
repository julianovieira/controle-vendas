<template>
  <q-page padding>
    <!-- Informações de gerais do pedido -->
    <div class="row q-gutter-sm q-pa-sm">
      <q-card class="col-md-12 col-sm-12 col-xs-12 q-pa-md">
        <div class="text-h6 text-center text-bold q-mb-md">Informações de Venda </div>
        <div class="row q-gutter-md q-px-sm">
          <div class="col-md-7 col-sm-12 col-xs-12">
            <!-- Informações sobre cliente -->
            <div class="text-left text-bold">Cliente</div>
            <div class="row">
              <q-select
                class="col-12 "
                filled
                standout
                placeholder="Selecionar"
                v-model="customers"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                :options="optionsCustomers"
                @filter="filterFnCustomers"
                @input-value="setCustomers"
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
          <div class="row justify-between q-mt-sm">
            <q-btn
              :disable="isDisableBtnInsertItens"
              :color="!isDisableBtnInsertItens ? 'primary' : 'grey-6'"
              flat
              class="q-pa-xs"
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
        :rows="listItens"
        :columns="columnsSaleItens"
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
            R$ {{saleTotal(listItens)}}
          </span>
        </div>
        <div>
          <q-btn
            color="primary"
            text-color="white"
            unelevated
            icon="mdi-cart-outline"
            label="Finalizar Venda"
            size="md"
            @click="submitEndSale"
          />
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script>

import { defineComponent, onMounted, ref, watch, computed } from 'vue'
import useApi from 'src/composables/useApi'
import useNotify from 'src/composables/useNotify'
import { columnsSaleItens } from './table'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup () {
    const products = ref([])
    const customers = ref([])
    const payments = ref([])

    const { list, post, getById, update } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const router = useRouter()

    const listProducts = ref([])
    const listCustomer = ref([])
    const listPayment = ref([])

    const stringOptions = ref([])
    const newStringOptions = ref([])
    const options = ref(stringOptions)

    const stringOptionsCustomers = ref([])
    const newStringOptionsCustomers = ref([])
    const optionsCustomers = ref(stringOptionsCustomers)

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

    const formSale = ref({
      total_value: 0,
      customer_id: '',
      payment_id: '',
      type_mov_id: ''
    })

    const formMovStock = ref({
      transaction_id: '',
      product_id: '',
      type_mov_id: '',
      quant: 0
    })

    const listItens = ref([])

    const isDisableBtnInsertItens = computed(() => {
      return !(formProductList.value.quant > 0 && formProductList.value.price_unit > 0)
    })

    onMounted(() => {
      handlePerProducts()
      handlePerCustomers()
      handlePerPayments()
      if (localStorage.getItem('listItens')) {
        listItens.value = JSON.parse(localStorage.getItem('listItens'))
      }
    })

    watch(listItens, () => {
      saleTotal(listItens.value)
    })

    const insertListItem = () => {
      try {
        formProductList.value.product_id = products.value.id
        formProductList.value.description = products.value.label
        formProductList.value.price_total = (formProductList.value.price_unit * formProductList.value.quant)
        const formList = formProductList.value
        listItens.value.push(formList)
        localStorage.setItem('listItens', JSON.stringify(listItens.value))
        formProductList.value = { product_id: '', description: '', quant: 0, price_unit: 0, price_total: 0 }
      } catch (error) {
        notifyError(error)
      }
    }

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

    const handlePerCustomers = async () => {
      try {
        const data = await list('customer')
        listCustomer.value = data
        listCustomer.value.forEach((customer) => {
          stringOptionsCustomers.value.push({ label: customer.name, id: customer.id })
        })
        newStringOptionsCustomers.value = stringOptionsCustomers.value
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
      listItens.value.splice(id, 1)
      localStorage.setItem('listItens', JSON.stringify(listItens.value))
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

    const filterFnCustomers = (val, update, abort) => {
      update(() => {
        const needle = val.toLocaleLowerCase()
        if (val === '') {
          optionsCustomers.value = stringOptionsCustomers.value
        } else {
          optionsCustomers.value = newStringOptionsCustomers.value.filter(v => v.label.toLocaleLowerCase().includes(needle))
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

    const submitEndSale = async () => {
      try {
        if (listItens.value.length) {
          formSale.value.customer_id = customers.value.id
          formSale.value.payment_id = payments.value.id
          formSale.value.type_mov_id = 2

          formSale.value.total_value = parseFloat(saleTotal(listItens.value))

          console.log(formSale.value)

          const venda = await post('transaction', formSale.value)

          listItens.value.forEach(async (item) => {
            item.transaction_id = venda[0].id

            await post('transaction_has_product', item)

            formMovStock.value.product_id = item.product_id
            formMovStock.value.quant = item.quant
            formMovStock.value.type_mov_id = 2
            formMovStock.value.transaction_id = venda[0].id

            const stock = await post('mov_stock', formMovStock.value)
            updateStockOutput(stock[0].product_id, stock[0].quant)
          })
          localStorage.removeItem('listItens')
          notifySuccess('Venda salva com sucesso')
          router.push({ name: 'sale' })
        } else {
          notifyError('Não é permitida venda SEM ITENS')
        }
      } catch (error) {
        notifyError(error)
      }
    }

    const setProduct = (val) => {
      products.value = val
    }

    const setCustomers = (val) => {
      customers.value = val
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
      isDisableBtnInsertItens,
      products,
      customers,
      payments,
      options,
      optionsCustomers,
      optionsPayments,
      handlePerProducts,
      handlePerCustomers,
      handleRemoveProduct,
      submitEndSale,
      filterFn,
      filterFnCustomers,
      filterFnPayments,
      setProduct,
      setCustomers,
      setPayments,
      formProductList,
      columnsSaleItens,
      listItens,
      saleTotal,
      insertListItem,
      pagination: ref({
        rowsPerPage: 10
      })
    }
  }
})
</script>
