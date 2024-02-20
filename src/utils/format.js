const formatCurrency = (currency) => {
  const formatted = currency.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
  return formatted
}

const formatCPF = (cpf) => {
  // retira os caracteres indesejados...
  cpf = cpf.replace(/[^\d]/g, '')
  if (cpf.length === 11) {
    // realizar a formatação...
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3-')
  }
  return cpf
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

export {
  formatCurrency,
  formatCPF,
  formatPhone
}
