<template>
    <q-dialog
      :full-width="$q.platform.is.mobile"
      :model-value="show"
      @befor-hide="handleClose"
      persistent
    >
        <q-card>
            <q-card-section>
                <div class="text-h6">
                    Details
                </div>
            </q-card-section>
            <q-card-section v-if="product.image_url">
                <q-img :src="product.image_url" :ratio="16/9" fit="contain" style="min-width: 300px;" />
            </q-card-section>
            <q-card-section>
                <div class="text-h6">
                    {{ product.name }}
                </div>
                <div class="text-subtitle2">
                    {{ formatCurrency(product.price ) }}
                </div>
                <div class="text-body" v-html="product.description">
                </div>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn label="Cancel" outline color="primary" v-close-popup @click="handleClose" />
                <q-btn v-if="brand.phone" labal="Order Now" icon="mdi-whatsapp" color="green-7" @click="handleSendWhatsapp" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import { formatCurrency } from 'src/utils/format'
import { openURL } from 'quasar'
import useApi from 'src/composables/useApi'

export default defineComponent({
  name: 'DialogProductDetails',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    product: {
      type: Object
    }
  },
  setup (props, { emit }) {
    const { brand } = useApi()
    const phone = '991660492'
    const msg = 'Hi, I am interested in the product: '
    const handleClose = () => {
      emit('hideDialog')
    }
    const handleSendWhatsapp = () => {
      const link = encodeURI(`https://api.whatsapp.com/send?phone=55${phone}&text=${msg} - ${props.product.name} - ${formatCurrency(props.product.price)}`)
      openURL(link)
    }
    return {
      formatCurrency,
      handleClose,
      handleSendWhatsapp,
      brand
    }
  }
})
</script>
