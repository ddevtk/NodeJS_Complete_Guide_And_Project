const hiddenAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, mes) => {
  hiddenAlert();
  const markup = `<div class="alert alert--${type}" >${mes}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(() => {
    hiddenAlert();
  }, 3000);
};
