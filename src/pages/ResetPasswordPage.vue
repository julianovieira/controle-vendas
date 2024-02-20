<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleRestPassword">
      <p class="col-12 text-h5 text-center q-pt-md">Reset Password</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          label="New Password"
          v-model="password"
          lazy-rules
          :rules="[val => (val && val.length >= 6) || 'Password é obrigatório e minimo 6 caracteres']"
        />
        <div class="full-width q-pt-md q-gutter-y-md">
          <q-btn
            label="Reset Password"
            color="primary"
            outline
            rounded
            class="full-width"
            type="submit"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import useAuthUser from 'src/composables/useAuthUser'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ForgotPasswordPage',
  setup () {
    const router = useRouter()
    // const route = useRoute()
    const { resetPassword } = useAuthUser()

    // const token = route.query.token

    const password = ref('')

    const handleRestPassword = async () => {
      try {
        await resetPassword(password.value)
        router.push({ name: 'login' })
      } catch (error) {
        alert(error.message)
      }
    }
    return {
      password,
      handleRestPassword
    }
  }
})
</script>
