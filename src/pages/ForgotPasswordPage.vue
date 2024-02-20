<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleForgotPassword">
      <p class="col-12 text-h5 text-center q-pt-md">Reset Password</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          label="Email"
          v-model="email"
          lazy-rules
          :rules="[val => (val && val.length > 0) || 'Email is required']"
          type="email"
        />
        <div class="full-width q-pt-md q-gutter-y-md">
          <q-btn
            label="Send Reset Email"
            color="primary"
            outline
            rounded
            class="full-width"
            type="submit"
          />
          <q-btn
            label="Back"
            color="negative"
            flat
            rounded
            class="full-width "
            :to="{name: 'login'}"
            icon="undo"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import useAuthUser from 'src/composables/useAuthUser'
import useNotify from 'src/composables/useNotify'

export default defineComponent({
  name: 'ForgotPasswordPage',
  setup () {
    const { sendPasswordRestEmail } = useAuthUser()
    const { notifyError, notifySuccess } = useNotify()
    const email = ref('')

    const handleForgotPassword = async () => {
      try {
        await sendPasswordRestEmail(email.value)
        notifySuccess(`Password reset email send to: ${email.value}`)
      } catch (error) {
        notifyError(error.message)
      }
    }
    return {
      email,
      handleForgotPassword
    }
  }
})
</script>
