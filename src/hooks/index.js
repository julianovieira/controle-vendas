export default function () {
  const isSubmitBtn = (form) => {
    let isValid = false
    const emailValue = form.email
    const passwordValue = form.password
    if (emailValue && passwordValue) isValid = true
    return isValid
  }
  return {
    isSubmitBtn
  }
}
