<template>
    <q-page padding>
        <div class="row justify-center">
            <div class="col-12 text-center">
                <p class="text-h6">Cadastro de Produto</p>
            </div>
            <q-form class="col-md-7 col-sm-12 col-xs-12 q-gutter-y-md" @submit.prevent="handleSubmit">
              <q-input
                label="Imagem Produto"
                stack-label
                v-model ='img'
                type="file"
                accept="image/*"
              />
              <q-input
                label="Nome"
                v-model="form.name"
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Nome é obrigatório!']"
              />
              <q-editor placeholder="Descrição do produto..." v-model="form.description" min-height="5rem" />
              <q-input
                label="Estoque"
                v-model="form.amount"
                lazy-rules
                :rules="[val => !!val || 'Estoque é obrigatório!']"
                type="number"
              />
              <q-input
                label="Preço"
                v-model="form.price"
                lazy-rules
                :rules="[val => !!val || 'Preço é obrigatório!']"
                prefix="R$"
              />
              <q-select
                label="Categoria"
                v-model="form.category_id"
                :options="optionsCategory"
                option-value="id"
                option-label="name"
                map-options
                emit-value
                :rules="[val => !!val || 'Categoria é obrigatório!']"
               >
                <template v-slot:after>
                  <q-btn round dense flat icon="add_circle_outline" @click="handleShowAddCategory" />
                </template>
              </q-select>
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
                :to="{ name: 'product'}"
              />
            </q-form>
        </div>
        <DialogAddCategory
          :show="showDialogAddCategory"
          @hide-dialog="showDialogAddCategory = false"
        >
        </DialogAddCategory>
    </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DialogAddCategory from 'src/components/DialogAddCategory.vue'
import useApi from 'src/composables/useApi'
import useNotify from 'src/composables/useNotify'
import useAuthUser from 'src/composables/useAuthUser'

export default defineComponent({
  name: 'formProductPage',
  components: {
    DialogAddCategory
  },
  setup () {
    const { notifyError, notifySuccess } = useNotify()
    const { post, getById, update, listPublic, uploadImg } = useApi()
    const router = useRouter()
    const route = useRoute()
    const { user } = useAuthUser()
    const table = 'product'
    const optionsCategory = ref([])
    const showDialogAddCategory = ref(false)
    const img = ref([])

    let product = {}
    const form = ref({
      name: '',
      description: '',
      amount: 0,
      price: 0,
      category_id: '',
      image_url: ''
    })

    const isUpdate = computed(() => route.params.id)

    onMounted(() => {
      handleListCategory()
      if (isUpdate.value) {
        handleGetProduct(isUpdate.value)
      }
    })

    watch(showDialogAddCategory, () => {
      handleListCategory()
    })

    const handleShowAddCategory = () => {
      showDialogAddCategory.value = true
    }

    const handleListCategory = async () => {
      optionsCategory.value = await listPublic('category', user.value.id)
    }

    const handleGetProduct = async (id) => {
      try {
        product = await getById(table, id)
        form.value = product
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleSubmit = async () => {
      try {
        if (img.value.length > 0) {
          const imgUrl = await uploadImg(img.value[0], 'products')
          form.value.image_url = imgUrl
        }
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
        router.push({ name: 'product' })
      } catch (error) {
        notifyError(error.message)
      }
    }
    return {
      form,
      optionsCategory,
      handleSubmit,
      handleShowAddCategory,
      showDialogAddCategory,
      isUpdate,
      img

    }
  }
})
</script>
