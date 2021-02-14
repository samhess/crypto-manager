function openDialog(element) {
  document.getElementById(element).showModal()
}

function closeDialog(element) {
  document.getElementById(element).close()
}

export {
  openDialog,
  closeDialog
}