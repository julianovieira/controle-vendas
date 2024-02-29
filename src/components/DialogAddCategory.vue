<template>
  <q-dialog
      :full-width="$q.platform.is.mobile"
      :model-value="show"
      @befor-hide="handleClose"
      persistent
    >
        <q-card class="q-pa-md" >
            <q-card-section>
                <div class="text-subtitle2 text-center">
                    Cadastro de Categoria
                </div>
            </q-card-section>
            <q-separator />
            <q-form class="col-md-12 col-sm-12 col-xs-12 " @submit.prevent="handleSubmit">
              <q-card-section>
                <q-input
                  label="Nome"
                  v-model="form.name"
                  lazy-rules
                  :rules="[val => (val && val.length > 0) || 'Nome é obrigatório!']"
                  dense
                />
              </q-card-section>
              <q-card-actions align="right">
                <q-btn label="Cancelar" flat color="negative" v-close-popup @click="handleClose" dense no-caps />
                <q-btn label="Salvar" icon="check" color="green" type="submit" dense no-caps />
              </q-card-actions>
            </q-form>
        </q-card>
    </q-dialog>
</template>

<script>
import useNotify from 'src/composables/useNotify'
import useApi from 'src/composables/useApi'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'DialogAddCategory',
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  setup (props, { emit }) {
    const { notifyError, notifySuccess } = useNotify()
    const { post } = useApi()

    const form = ref({
      name: ''
    })

    const handleClose = () => {
      emit('hideDialog')
    }

    const handleSubmit = async () => {
      console.log('clicou submit')
      try {
        await post('category', form.value)
        notifySuccess('Cadastro realizado com sucesso')
        handleClose()
      } catch (error) {
        notifyError(error.message)
      }
    }

    return {
      form,
      handleClose,
      handleSubmit
    }
  }
})
</script>
