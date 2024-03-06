import useAuthUser from 'src/composables/useAuthUser'
import useSupabase from 'src/boot/supabase'
import useBrand from 'src/composables/useBrand'
import { useQuasar } from 'quasar'

import { v4 as uuidv4 } from 'uuid'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const brand = ref({
  name: '',
  phone: '',
  primary: '',
  secondary: '',
  parallax_url: ''
})

export default function useApi () {
  const { supabase } = useSupabase()
  const { user } = useAuthUser()
  const { setBrand } = useBrand()
  const route = useRoute()
  const $q = useQuasar()

  const list = async (tabela) => {
    const { data, error } = await supabase
      .from(tabela)
      .select('*')

    if (error) throw error
    return data
  }

  const listPublic = async (tabela, userId, columnFilter = '', filter = '') => {
    const { data, error } = await supabase
      .from(tabela)
      .select('*')
      .eq('user_id', userId)
      .eq(columnFilter, filter)

    if (error) throw error
    return data
  }

  const fetchCount = async (tabela) => {
    const { data, error, count } = await supabase
      .from(tabela)
      .select('*', { count: 'exact' })

    if (error) throw error
    return {
      data,
      count
    }
  }

  const getById = async (tabela, id) => {
    const { data, error } = await supabase
      .from(tabela)
      .select('*')
      .eq('id', id)
    if (error) throw error
    return data[0]
  }

  const getListStock = async (tabela, idTransaction) => {
    const { data, error } = await supabase
      .from(tabela)
      .select('*')
      .eq('transaction_id', idTransaction)
    if (error) throw error
    return data
  }

  const getListTransactionItens = async (tabela, idTransaction) => {
    const { data, error } = await supabase
      .from(tabela)
      .select('*')
      .eq('transaction_id', idTransaction)
    if (error) throw error
    return data
  }
  const post = async (tabela, form) => {
    const { data, error } = await supabase
      .from(tabela)
      .upsert(
        {
          ...form,
          user_id: user.value.id
        }
      )
      .select()
    if (error) throw error
    return data
  }

  const update = async (tabela, form) => {
    const { data, error } = await supabase
      .from(tabela)
      .update({ ...form })
      .match({ id: form.id })
      .select()
    if (error) throw error
    return data
  }

  const remove = async (tabela, id) => {
    const { data, error } = await supabase
      .from(tabela)
      .delete()
      .match({ id })
    if (error) throw error
    return data
  }

  const uploadImg = async (file, storage) => {
    const fileName = uuidv4()
    const { error } = await supabase
      .storage
      .from(storage)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
    const publicUrl = await getUrlPublic(fileName, storage)
    if (error) throw error
    return publicUrl
  }

  const getUrlPublic = async (fileName, storage) => {
    const { data, error } = supabase
      .storage
      .from(storage)
      .getPublicUrl(fileName)

    if (error) throw error
    return data.publicUrl
  }

  const getBrand = async () => {
    const id = route.params.id || user?.value?.id
    if (id) {
      $q.loading.show()
      const { data, error } = await supabase
        .from('config')
        .select('*')
        .eq('user_id', id)

      if (error) throw error
      if (data.length > 0) {
        brand.value = data[0]
        setBrand(brand.value.primary, brand.value.secondary)
      }
      $q.loading.hide()
      return brand
    }
  }

  return {
    list,
    listPublic,
    fetchCount,
    getById,
    getListStock,
    getListTransactionItens,
    post,
    update,
    remove,
    uploadImg,
    getBrand,
    brand
  }
}
