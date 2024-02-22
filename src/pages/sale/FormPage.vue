<template>
  <q-page padding>
    <div class="row justify-between q-pa-sm">
      <q-card class="col-md-12 col-sm-12 col-xs-12 q-pa-sm">
        <div class="text-h6 text-center text-bold q-mb-sm">Informações Venda </div>
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
                v-model="form.quant"
                min="0"
                dense
                type="number"
              />
              <q-input
                label="Preço"
                filled
                v-model="form.price_unit"
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
                <label class="text-h6"><strong>Total: </strong></label>
                <span class=" q-ml-md text-h6 text-bold">
                  R$ {{ (form.price_unit * form.quant).toFixed(2) }}
                </span>
              </div>
            </div>
          </div>
<!-- separando informaçõe de produto e cliente e pagamento -->
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
              <div class="row q-mt-sm" style="width: 100%;">
                <div class="text-center text-bold" style="width: 50%;">Forma de pagamento:</div>
                <div class="q-gutter-md" style="width: 50%;">
                  <q-radio dense v-model="form.form_pagto" val="dinheiro" label="Dinheiro" />
                  <q-radio dense v-model="form.form_pagto" val="cartao" label="Cartão" />
                  <q-radio dense v-model="form.form_pagto" val="pix" label="Pix" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card>
      </div>
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
  </q-page>
</template>
<script>
import { defineComponent, onMounted, ref } from 'vue'
import useApi from 'src/composables/useApi'
import useNotify from 'src/composables/useNotify'
import { columnsSale } from './table'

export default defineComponent({
  setup () {
    const products = ref([])
    const customers = ref([])
    const { list } = useApi()
    const { notifyError } = useNotify()

    const listProducts = ref([])
    const listCustomer = ref([])
    const stringOptions = ref([])
    const newStringOptions = ref([])
    const options = ref(stringOptions)
    const stringOptionsCustomers = ref([])
    const newStringOptionsCustomers = ref([])
    const optionsCustomers = ref(stringOptionsCustomers)

    const form = ref({
      id_produto: '',
      description: '',
      quant: 0,
      price_unit: 0,
      price_total: 0,
      form_pagto: 'dinheiro'
    })

    const listItens = ref([])

    onMounted(() => {
      handlePerProducts()
      handlePerCustomers()
      if (localStorage.getItem('listItens')) {
        listItens.value = JSON.parse(localStorage.getItem('listItens'))
      }
    })

    const insertListItem = () => {
      form.value.id_produto = products.value.id
      form.value.description = products.value.label
      form.value.price_total = (form.value.price_unit * form.value.quant)
      const formList = form.value
      listItens.value.push(formList)
      localStorage.setItem('listItens', JSON.stringify(listItens.value))
      form.value = { id_produto: '', description: '', quant: 0, price_unit: 0, price_total: 0 }
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

    const handleRemoveProduct = (id) => {
      console.log(id)
      console.log(listItens.value)
      listItens.value.splice(id, 1)
      console.log(listItens.value)
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

    const setProduct = (val) => {
      products.value = val
    }

    const setCustomers = (val) => {
      customers.value = val
    }

    return {
      products,
      customers,
      options,
      optionsCustomers,
      handlePerProducts,
      handlePerCustomers,
      handleRemoveProduct,
      filterFn,
      filterFnCustomers,
      setProduct,
      setCustomers,
      form,
      columnsSale,
      listItens,
      insertListItem,
      pagination: ref({
        rowsPerPage: 10
      })
    }
  }
})
</script>
