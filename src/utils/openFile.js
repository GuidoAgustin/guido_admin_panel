export default (url) => {
  const fileLink = document.createElement('a')
  fileLink.href = url
  fileLink.setAttribute('target', '_blank')
  document.body.appendChild(fileLink)

  fileLink.click()
}
