import { pushScopeId } from 'vue';
<template>
 <q-page padding>
    <div class="row">
      <q-table
        class="col-12"
        :rows="categories"
        :columns="columnsCategory"
        :loading="loading"
        row-key="id"
      >
      <template v-slot:top>
        <span class="text-h6">
            Categorias
        </span>
        <q-space />
        <q-btn v-if="$q.platform.is.desktop"
          label="Adicionar"
          color="primary"
          icon="mdi-plus-box"
          rounded
          flat
          :to="{ name: 'form-category' }" >
            <q-tooltip>
              Categoria Nova
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
            <q-btn icon="mdi-delete-outline" color="negative" dense size="sm" @click="handleRemoveCategory(props.row)">
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
      <q-btn fab icon="mdi-plus" color="primary" :to="{ name: 'form-category'}">
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
import { columnsCategory } from './table'

export default defineComponent({
  name: 'listCategoryPage',
  setup () {
    const categories = ref([])
    const { list, remove } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const table = 'category'
    const loading = ref(true)
    const router = useRouter()
    const $q = useQuasar()

    const handleListCategories = async () => {
      try {
        loading.value = true
        categories.value = await list(table)
        loading.value = false
      } catch (error) {
        notifyError(error.message)
      }
    }

    onMounted(() => {
      handleListCategories()
    })

    const handleEdit = (category) => {
      router.push({ name: 'form-category', params: { id: category.id } })
    }

    const handleRemoveCategory = (category) => {
      try {
        $q.dialog({
          title: 'Confirme',
          message: `Gostaria realmente de remover a categoria - ${category.name}?`,
          cancel: true,
          persistent: true
        }).onOk(async () => {
          await remove(table, category.id)
          notifySuccess('Removido com sucesso')
          handleListCategories()
        })
      } catch (error) {
        notifyError(error.message)
      }
    }

    return {
      columnsCategory,
      categories,
      loading,
      handleEdit,
      handleRemoveCategory
    }
  }
})
</script>
