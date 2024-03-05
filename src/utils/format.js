import { date } from 'quasar'

const formatCurrency = (currency) => {
  const formatted = currency.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
  return formatted
}

const formatCnpj = (cnpj) => {
  // retira os caracteres indesejados...
  cnpj = cnpj.replace(/[^\d]/g, '')
  if (cnpj.length === 14) {
    // realizar a formatação...
    cnpj = cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '$1.$2.$3/$4-')
  }
  return cnpj
}

const formatPhone = (phone) => {
  // retira os caracteres indesejados...
  phone = phone.replace(/[^\d]/g, '')
  if (phone.length === 11) {
    // realizar a formatação...
    phone = phone.replace(/(\d{0})(\d{2})(\d{0})(\d{5})/, '$1($2)$3 $4-')
  }
  return phone
}

const formatDate = (data) => {
  const dataFormatada = date.formatDate(data, 'DD/MM/YYYY HH:mm:ss')
  return dataFormatada
}

export {
  formatCurrency,
  formatCnpj,
  formatPhone,
  formatDate
}
