import { ref } from 'vue'
import useSupabase from 'boot/supabase'

const user = ref(null)

export default function useAuthUser () {
  // Importando as configurações do banco de dados supabase
  const { supabase } = useSupabase()

  //  Função para logar no sistema passando os parametros e email e senha
  const login = async (data) => {
    console.log(data)
    const { user, error } = await supabase.auth.signInWithPassword(data)
    if (error) throw error
    return user
  }

  // Função para logar no sitema usando provider(GitHub)
  const loginWithSocialProvider = async (provider) => {
    const { user, error } = await supabase.auth.signIn(provider)
    if (error) throw error
    return user
  }

  // Funçção para fazer o logout do sistema
  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const isLoggedIn = () => {
    return !!user.value
  }
  // Função para registrar usuário, com confirmação por email
  const register = async ({ email, password, ...meta }) => {
    const { user, error } = await supabase.auth.signUp(
      { email, password, options: { emailRedirectTo: `${window.location.origin}/dashboard?fromEmail=registrationConfirmation` } },
      {
        data: meta,
        redirectTo: `${window.location.origin}/dashboard?fromEmail=registrationConfirmation`
      }
    )
    if (error) throw error
    return user
  }

  // Função para atualização de usuário
  const update = async (data) => {
    const { user, error } = await supabase.auth.update(data)
    if (error) throw error
    return user
  }

  // Função para redefinição de senha
  const sendPasswordRestEmail = async (email) => {
    const { user, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` })
    if (error) throw error
    return user
  }

  const resetPassword = async (newPassword) => {
    try {
      const { user, error } = await supabase.auth.updateUser(
        {
          password: newPassword
        }
      )
      if (error) throw error
      return user
    } catch (error) {
      alert(error.message)
    }
  }

  return {
    user,
    login,
    loginWithSocialProvider,
    logout,
    isLoggedIn,
    register,
    update,
    sendPasswordRestEmail,
    resetPassword
  }
}
