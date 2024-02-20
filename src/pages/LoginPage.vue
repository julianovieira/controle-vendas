<template>
  <q-page>
    <div class="row">
        <div class="col-12 col-md-4 col-lg-4 q-pa-xl">
          <div class="text-center">
            <q-img
            class="logo"
            src="~/src/assets/login.svg"
            />

          </div>
          <div class="text-h5 text-center q-pa-md q-mt-lg">Autenticação de Usuário</div>
          <div class="text-gray-7">Por favor, entre com suas credencias.</div>
          <div class="column">
            <q-input
              label="Email"
              outlined
              v-model="form.email"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Email é obrigatório!']"
              type="email"
              dense
            >
              <template v-slot:prepend>
                <q-icon name="email"></q-icon>
              </template>
            </q-input>
            <q-input
              class="q-mt-sm"
              label="Password"
              outlined
              v-model="form.password"
              lazy-rules
              :type="isPassword ? 'password' : 'text'"
              :rules="[val => (val && val.length >= 0) || 'Password é obrigatório!']"
              dense
            >
              <template v-slot:prepend>
                <q-icon name="lock"></q-icon>
              </template>
              <template v-slot:append>
                <q-icon
                  @click="isPassword = !isPassword"
                  :name="isPassword ? 'visibility_off' : 'visibility'" />
              </template>
            </q-input>
          </div>
          <div class="column q-mt-sm">
            <q-btn
              :disable="!isSubmitBtn(form)"
              :color="isSubmitBtn(form) ? 'primary' : 'grey-6'"
              @click="handleLogin"
              dense
              rounded
            >
              Login
            </q-btn>
          </div>
          <div class="full-width q-mt-sm q-gutter-y-sm">
            <q-btn
              label="Cadastre-se"
              color="primary"
              flat
              rounded
              class="full-width"
              :to="{name: 'register'}"
              size="sm"
            />
            <q-btn
              label="Esqueceu sua Senha?"
              color="primary"
              flat
              rounded
              class="full-width"
              :to="{name: 'forgot-password'}"
              size="sm"
            />
          </div>
        </div>
        <div v-if="$q.platform.is.desktop" class="col-12 col-md-8 col-lg-8 text-center">
          <div class="text-center">
            <q-img
            class="login-logo"
            src="~/src/assets/logo-login.svg" />
          </div>
        </div>
    </div>
  </q-page>
</template>

<script>

import Hooks from 'src/hooks'

import { defineComponent, ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import useAuthUser from 'src/composables/useAuthUser'
import useNotify from 'src/composables/useNotify'

export default defineComponent({
  name: 'RegisterPage',
  setup () {
    const router = useRouter()
    const { login, isLoggedIn } = useAuthUser()
    const { notifyError, notifySuccess } = useNotify()

    const { isSubmitBtn } = Hooks()
    const isPassword = ref(true)
    const $q = useQuasar()

    const form = ref({
      email: '',
      password: ''
    })

    onMounted(() => {
      if (isLoggedIn) {
        router.push({ name: 'dashboard' })
      }
    })

    const handleLogin = async () => {
      try {
        await login(form.value)
        notifySuccess('Login realizado com sucesso')
        router.push({ name: 'dashboard' })
      } catch (error) {
        notifyError(error.message)
      }
    }

    return {
      form,
      handleLogin,
      isSubmitBtn,
      isPassword,
      $q
    }
  }

})
</script>

<style scope>
  .logo {
    width: 40%;
  }
  .login-logo {
    width: 55%;
    margin-top: 10px;
  }
</style>
