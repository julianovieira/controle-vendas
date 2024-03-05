import { pushScopeId } from 'vue';
<template>
 <q-page padding>
    <div class="row">
      <q-table
        class="col-12"
        :rows="providers"
        :columns="columnsProvider"
        :loading="loading"
        row-key="id"
      >
      <template v-slot:top>
        <span class="text-h6">
            Fornecedores
        </span>
        <q-space />
        <q-btn v-if="$q.platform.is.desktop"
          label="Adicionar"
          color="primary"
          icon="mdi-plus-box"
          rounded
          flat
          :to="{ name: 'form-provider' }" >
            <q-tooltip>
              Fornecedor Novo
            </q-tooltip>
        </q-btn>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-sm">
            <q-btn icon="mdi-file-edit-outline" color="info" dense size="sm" @click="handleEdit(props.row)" >
              <q-tooltip>
                Editar
              </q-tooltip>
            </q-btn>
            <q-btn icon="mdi-delete-outline" color="negative" dense size="sm" @click="handleRemoveProvider(props.row)">
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
      <q-btn fab icon="mdi-plus" color="primary" :to="{ name: 'form-provider'}">
      </q-btn>
    </q-page-sticky>
 </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import useApi from 'src/composables/useApi'
import useNotify from 'src/composables/useNotify'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { columnsProvider } from './table'

export default defineComponent({
  name: 'listCustomerPage',
  setup () {
    const providers = ref([])
    const { list, remove } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const table = 'provider'
    const loading = ref(true)
    const router = useRouter()
    const $q = useQuasar()

    const handleListProvider = async () => {
      try {
        loading.value = true
        providers.value = await list(table)
        loading.value = false
      } catch (error) {
        notifyError(error.message)
      }
    }

    onMounted(() => {
      handleListProvider()
    })

    const handleEdit = (provider) => {
      router.push({ name: 'form-provider', params: { id: provider.id } })
    }

    const handleRemoveProvider = (provider) => {
      try {
        $q.dialog({
          title: 'Confirme',
          message: `Gostaria realmente de remover (a/o) fornecedor - ${provider.name}?`,
          cancel: true,
          persistent: true
        }).onOk(async () => {
          await remove(table, provider.id)
          notifySuccess('Removido com sucesso')
          handleListProvider()
        })
      } catch (error) {
        notifyError(error.message)
      }
    }

    return {
      columnsProvider,
      providers,
      loading,
      handleEdit,
      handleRemoveProvider
    }
  }
})
</script>
