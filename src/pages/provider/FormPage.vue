<template>
    <q-page padding>
        <div class="row justify-center">
            <div class="col-12 text-center">
                <p class="text-h6">Cadastro de Fornecedor</p>
            </div>
            <q-form class="col-md-7 col-sm-12 col-xs-12 q-gutter-y-md" @submit.prevent="handleSubmit">
              <q-input
                label="Nome"
                v-model="form.name"
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Nome é Obrigatório!']"
              />
              <q-input
                label="CNPJ"
                v-model="form.cnpj"
                mask="##.###.###/####-##"
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'CNPJ é Obrigatório!']"
              />
              <q-input
                label="Email"
                type="email"
                v-model="form.email"
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Email é Obrigatório!']"
              />
              <q-input
                label="Telefone"
                v-model="form.phone"
                mask="(##) #####-####"
                unmasked-value
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Telefone é Obrigatório!']"
              />
              <q-editor placeholder="Descrição/Observações..." v-model="form.description" min-height="5rem" />
              <q-btn
                :label="isUpdate ? 'Atualizar' : 'Salvar'"
                type="submit"
                color="primary"
                rounded
                class="full-width"
              />
              <q-btn
                label="Cancelar"
                color="negative"
                flat
                rounded
                class="full-width"
                icon="undo"
                :to="{ name: 'provider'}"
              />
            </q-form>
        </div>
    </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useApi from 'src/composables/useApi'
import useNotify from 'src/composables/useNotify'

export default defineComponent({
  name: 'formProviderPage',
  setup () {
    const { notifyError, notifySuccess } = useNotify()
    const { post, getById, update } = useApi()
    const router = useRouter()
    const route = useRoute()
    const table = 'provider'

    let provider = {}
    const form = ref({
      name: '',
      cnpj: '',
      email: '',
      phone: '',
      description: ''
    })

    const isUpdate = computed(() => route.params.id)

    onMounted(() => {
      if (isUpdate.value) {
        handleGetCustomer(isUpdate.value)
      }
    })

    const handleGetCustomer = async (id) => {
      try {
        provider = await getById(table, id)
        form.value = provider
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleSubmit = async () => {
      try {
        if (isUpdate.value) {
          try {
            await update(table, form.value)
            notifySuccess('Atualização realizada com sucesso')
          } catch (error) {
            notifyError(error.message)
          }
        } else {
          await post(table, form.value)
          notifySuccess('Cadastro realizado com sucesso')
        }
        router.push({ name: 'provider' })
      } catch (error) {
        notifyError(error.message)
      }
    }
    return {
      form,
      handleSubmit,
      isUpdate

    }
  }
})
</script>
