export function humanReadableSize(bytes) {
  if (!bytes) return '0 Byte'

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}

export function formatToMoney(value) {
  // Convert to fixed decimal and replace decimal point
  let formatted = value.toFixed(2)

  // Add thousands separators
  formatted = formatted.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

  return formatted
}

export function textToHtml(text) {
  // Replace line breaks with <br> tags
  let htmlText = text.replace(/\r?\n/g, '<br>')

  // Replace multiple spaces with &nbsp; to preserve them in HTML
  htmlText = htmlText.replace(/ {2,}/g, (match) => '&nbsp;'.repeat(match.length))

  return htmlText
}
