<template>
 <q-page padding>
    <div class="row">
      <q-table
        class="col-12"
        :rows="products"
        :columns="columnsProduct"
        :loading="loading"
        row-key="id"
      >
      <template v-slot:top>
        <span class="text-h6">
            Produtos
        </span>
        <q-btn
          label="Catálogo"
          dense
          size="sm"
          outline
          class="q-ml-sm"
          icon="mdi-store"
          color="primary"
          @click="handleGoToStore"
        />
        <q-btn
          label="Link"
          dense
          size="sm"
          outline
          class="q-ml-sm"
          icon="mdi-content-copy"
          color="primary"
          @click="handleCopyPublicUrl"
        />
        <q-space />
        <q-btn v-if="$q.platform.is.desktop"
          label="Adicionar"
          color="primary"
          icon="mdi-plus-box"
          rounded
          flat
          :to="{ name: 'form-product' }" >
            <q-tooltip>
              Produto Novo
            </q-tooltip>
        </q-btn>
      </template>
      <template v-slot:body-cell-image_url="props">
        <q-td :props="props">
          <q-avatar v-if="props.row.image_url"
            rounded>
            <img :src="props.row.image_url">
          </q-avatar>
          <q-avatar v-else color="primary" text-color="white" icon="mdi-image-off-outline" />
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-sm">
            <q-btn icon="mdi-file-edit-outline" color="info" dense size="sm" @click="handleEdit(props.row)" >
              <q-tooltip>
                Editar
              </q-tooltip>
            </q-btn>
            <q-btn icon="mdi-delete-outline" color="negative" dense size="sm" @click="handleRemoveProduct(props.row)">
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
      <q-btn fab icon="mdi-plus" color="primary" :to="{ name: 'form-product'}">
      </q-btn>
    </q-page-sticky>
 </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import useApi from 'src/composables/useApi'
import useNotify from 'src/composables/useNotify'
import useAuthUser from 'src/composables/useAuthUser'
import { useRouter } from 'vue-router'
import { useQuasar, openURL, copyToClipboard } from 'quasar'
import { columnsProduct } from './table'

export default defineComponent({
  name: 'listProductPage',
  setup () {
    const products = ref([])
    const { list, remove } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const { user } = useAuthUser()
    const table = 'product'
    const loading = ref(true)
    const router = useRouter()
    const $q = useQuasar()

    const handleListProducts = async () => {
      try {
        loading.value = true
        products.value = await list(table)
        loading.value = false
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleGoToStore = () => {
      const userId = user.value.id
      const link = router.resolve({ name: 'product-public', params: { id: userId } })
      // router.push({ name: 'product-public', params: { id: userId } })
      openURL(window.origin + link.href)
    }

    const handleCopyPublicUrl = () => {
      const userId = user.value.id
      const link = router.resolve({ name: 'product-public', params: { id: userId } })
      const externalLink = window.origin + link.href
      copyToClipboard(externalLink)
        .then(() => {
          notifySuccess('Link copiado com sucesso')
        })
        .catch(() => {
          notifyError('Erro ao copiar link')
        })
    }

    onMounted(() => {
      handleListProducts()
    })

    const handleEdit = (product) => {
      router.push({ name: 'form-product', params: { id: product.id } })
    }

    const handleRemoveProduct = (product) => {
      try {
        $q.dialog({
          title: 'Confirma',
          message: `Gostaria realmente de remover o produto - ${product.name}?`,
          cancel: true,
          persistent: true
        }).onOk(async () => {
          await remove(table, product.id)
          notifySuccess('Removido com sucesso')
          handleListProducts()
        })
      } catch (error) {
        notifyError(error.message)
      }
    }

    return {
      columnsProduct,
      products,
      loading,
      handleEdit,
      handleGoToStore,
      handleCopyPublicUrl,
      handleRemoveProduct
    }
  }
})
</script>
