<template>
  <q-page padding>
    <!-- Informações de gerais do pedido -->
    <div class="row justify-between q-pa-sm">
      <q-card class="col-md-12 col-sm-12 col-xs-12 q-pa-sm">
        <div class="text-h6 text-center text-bold q-mb-sm">Informações Venda </div>
        <!-- Informações do produto -->
        <div class="row">
          <div class="col-md-6">
            <div class="text-center text-bold">Produto</div>
            <div class="row q-gutter-sm q-mb-sm">
              <q-select
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
                label="Quantidade"
                filled
                v-model="formProductList.quant"
                min="0"
                dense
                type="number"
              />
              <q-input
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
<!--  Informações de cliente e pagamento -->
          <div class="col-md-6">
            <div class="text-center text-bold">cliente</div>
            <div class="row">
              <q-select
                class="col-12 q-mb-sm"
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
      <!-- Informações de forma de pagamentos -->
            <div class="row q-mt-sm" style="width: 100%;">
              <div style="display:flex; align-items:center;">
                <div class="text-center text-bold q-ml-md q-mr-lg">Forma de Pagamento:</div>
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
          </div>
        </div>
      </q-card>
      </div>
  <!-- Informações da listagem de produtos -->
    <div class="row justify-between q-pa-sm">
      <q-card class="col-md-12 col-sm-12 col-xs-12 q-pa-md" >
        <q-table
        title="Lista de Itens"
        :rows="listItens"
        :columns="columnsSale"
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
    <div class="row q-pa-sm">
      <q-card class="row justify-between col-md-12 col-sm-12 col-xs-12 q-pa-md q-col-gutter-y-sm">
        <div class="flex text-center q-mr-sm">
          <label class="text-h5"><strong>Total: </strong></label>
          <span class=" q-ml-md text-h5 text-bold">
            R$ {{saleTotal(listItens)}}
          </span>
        </div>
        <div>
          <q-btn
            color="primary"
            text-color="dark"
            unelevated
            icon="mdi-cart-outline"
            label="Finalizar Venda"
            size="md"
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
import { columnsSale } from './table'

export default defineComponent({
  setup () {
    const products = ref([])
    const customers = ref([])
    const payments = ref([])

    const { list } = useApi()
    const { notifyError } = useNotify()

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
      id_produto: '',
      description: '',
      quant: 0,
      price_unit: 0,
      price_total: 0
    })

    const listItens = ref([])

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
      formProductList.value.id_produto = products.value.id
      formProductList.value.description = products.value.label
      formProductList.value.price_total = (formProductList.value.price_unit * formProductList.value.quant)
      const formList = formProductList.value
      listItens.value.push(formList)
      localStorage.setItem('listItens', JSON.stringify(listItens.value))
      formProductList.value = { id_produto: '', description: '', quant: 0, price_unit: 0, price_total: 0 }
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
        console.log(data)
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
      products,
      customers,
      payments,
      options,
      optionsCustomers,
      optionsPayments,
      handlePerProducts,
      handlePerCustomers,
      handleRemoveProduct,
      filterFn,
      filterFnCustomers,
      filterFnPayments,
      setProduct,
      setCustomers,
      setPayments,
      formProductList,
      columnsSale,
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
