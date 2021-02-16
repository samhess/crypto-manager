function dialog(element, action) {
  action = action || true
  if (action === 'open' || action == true) {
    document.getElementById(element).showModal()
  } else if (action === 'close' || action == false) {
    document.getElementById(element).close()
  }
}

function openDialog(element) {
  document.getElementById(element).showModal()
}


function closeDialog(element) {
  document.getElementById(element).close()
}

export {
  dialog,
  openDialog,
  closeDialog
}