<template>
    <q-page padding>
        <div class="row justify-center">
            <div class="col-12 text-center">
                <p class="text-h6">Configurações</p>
            </div>
            <q-form class="col-md-7 col-sm-12 col-xs-12 q-gutter-y-md q-pa-sm" @submit.prevent="handleSubmit">
              <q-input
                label="Nome"
                v-model="form.name"
              />
              <q-input
                label="Telefone"
                v-model="form.phone"
                mask="(##) #####-####"
                unmasked-value
              />
              <div class="row justify-center q-gutter-md q-pa-sm">
                <q-input
                  label="Cor Primaria"
                  v-model="form.primary"
                  class="col-md-5 col-sm-12 col-xs-12"
                >
                <template v-slot:prepend>
                  <q-icon name="mdi-palette" :style="{color:form.primary}" />
                </template>
                <template v-slot:append>
                  <q-icon name="colorize" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-color v-model="form.primary" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
                </q-input>

                <q-input
                  label="Cor Secundaria"
                  v-model="form.secondary"
                  :bg-color="form.secondary"
                  class="col-md-5 col-sm-12 col-xs-12"
                >
                <template v-slot:prepend>
                  <q-icon name="mdi-palette" :style="{color:form.secondary}" />
                </template>
                <template v-slot:append>
                  <q-icon name="colorize" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-color v-model="form.secondary" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
                </q-input>
              </div>
              <q-btn
                label="Salvar"
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
                :to="{ name: 'dashboard'}"
              />
            </q-form>
        </div>
    </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useApi from 'src/composables/useApi'
import useNotify from 'src/composables/useNotify'
import useBrand from 'src/composables/useBrand'
import useAuthUser from 'src/composables/useAuthUser'

export default defineComponent({
  name: 'formCategoryPage',
  setup () {
    const { notifyError, notifySuccess } = useNotify()
    const { post, listPublic, update } = useApi()
    const { setBrand } = useBrand()
    const { user } = useAuthUser()
    const router = useRouter()
    const table = 'config'
    const parallax = ref([])

    const config = {}
    const form = ref({
      name: '',
      phone: '',
      primary: '',
      secondary: ''
    })

    onMounted(() => {
      handleGetConfig()
    })

    const handleGetConfig = async () => {
      try {
        config.value = await listPublic(table, user.value.id)
        if (config.value.length > 0) form.value = config.value[0]
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleSubmit = async () => {
      try {
        if (form.value.id) {
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
        setBrand(form.value.primary, form.value.secondary)
        router.push({ name: 'dashboard' })
      } catch (error) {
        notifyError(error.message)
      }
    }
    return {
      form,
      handleSubmit,
      parallax
    }
  }
})
</script>
