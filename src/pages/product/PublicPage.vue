<template>
 <q-page padding>
    <div v-if="brand.name" class="row">
      <div class="col-12 text-center text-h5">
        {{ brand.name }}
      </div>
    </div>
    <div class="row">
      <q-select
        class="col-12"
        outlined
        v-model="categoryId"
        :options="optionsCategories"
        option-label="name"
        option-value="id"
        map-options
        emit-value
        clearable
        label="Category"
        dense
        @update:model-value="handleListProducts(route.params.id)"
      />
      <q-table
        class="col-12"
        v-model:pagination="initialPagination"
        :rows="products"
        :columns="columnsProduct"
        :loading="loading"
        row-key="id"
        grid
        :filter="filter"
        hide-pagination
      >
      <template v-slot:top>
        <span class="text-h6">
            Product
        </span>
        <q-space />
        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search" class="q-mr-sm">
          <template v-slot:append>
            <q-icon name="mdi-magnify" />
          </template>
        </q-input>
      </template>
      <template v-slot:item="props">
        <transition-group
          appear
          enter-active-class="animated fadeInLeft"
          leave-active-class="animated fadeOutRight"
        >
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-3" key="card">
            <q-card class="cursor-pointer" @click="handleShowDetails(props.row)" >
              <q-img :src="props.row.image_url" :ratio="16/9" fit="contain" />
              <q-card-section class="text-center">
                <div class="text-h6">{{ props.row.name }}</div>
                <div class="text-subtitle">{{ formatCurrency(props.row.price) }}</div>
              </q-card-section>
            </q-card>
          </div>
          <!-- <div class=" q-pa-xs col-12 rounded-borders" key="parallax" v-if="props.rowIndex === 3 && brand.parallax_url">
            <q-parallax :height="200" :speed="0.5">
              <template v-slot:media>
                <img :src="brand.parallax_url">
              </template>

              <h3 class="text-primary text-weight-bold">{{ brand.name }}</h3>
            </q-parallax>
          </div> -->
        </transition-group>
      </template>
      </q-table>
    </div>
    <div class="row justify-center q-mt-md">
      <q-pagination
        v-model="initialPagination.page"
        :max="pagesNumber"
        direction-links
        @update:model-value="handleScrollToTop"
      />
    </div>
    <DialogProductDetails
      :show="showDialogDetails"
      :product="productDetails"
      @hide-dialog="showDialogDetails = false"
    >
    </DialogProductDetails>
 </q-page>
</template>

<script>
import { defineComponent, onMounted, ref, computed } from 'vue'
import useApi from 'src/composables/useApi'
import useNotify from 'src/composables/useNotify'
import { useRoute } from 'vue-router'
import { columnsProduct, initialPagination } from './table'
import { formatCurrency } from 'src/utils/format'
import DialogProductDetails from 'src/components/DialogProductDetails.vue'

export default defineComponent({
  name: 'listPublicPage',
  components: {
    DialogProductDetails
  },
  setup () {
    const products = ref([])
    const { listPublic, brand } = useApi()
    const { notifyError } = useNotify()
    const table = 'product'
    const loading = ref(true)
    const filter = ref('')
    const showDialogDetails = ref(false)
    const productDetails = ref({})
    const route = useRoute()
    const optionsCategories = ref([])
    const categoryId = ref('')

    const handleListProducts = async (userId) => {
      try {
        loading.value = true
        products.value = categoryId.value ? await listPublic(table, userId, 'category_id', categoryId.value) : await listPublic(table, userId)
        loading.value = false
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleShowDetails = (product) => {
      productDetails.value = product
      showDialogDetails.value = true
    }
    const handleListCategories = async (userId) => {
      optionsCategories.value = await listPublic('category', userId)
    }

    const handleScrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    onMounted(() => {
      if (route.params.id) {
        handleListCategories(route.params.id)
        handleListProducts(route.params.id)
      }
    })

    return {
      columnsProduct,
      products,
      filter,
      loading,
      formatCurrency,
      showDialogDetails,
      productDetails,
      handleShowDetails,
      brand,
      optionsCategories,
      categoryId,
      route,
      handleListProducts,
      initialPagination,
      handleScrollToTop,
      pagesNumber: computed(() => Math.ceil(products.value.length / initialPagination.value.rowsPerPage))
    }
  }
})
</script>
