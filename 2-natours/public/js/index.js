import '@babel/polyfill';

import { login, logout } from './login';
import { displayMap } from './map';
import { updateSettings } from './updateSettings';

const mapEle = document.getElementById('map');
const formLogin = document.querySelector('.form--login');
const logoutEle = document.getElementById('logout');
const formUserDataUpdate = document.querySelector('.form-user-data');
const formUserSettings = document.querySelector('.form-user-settings');

if (formLogin)
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });

if (mapEle) {
  const locArr = JSON.parse(mapEle.dataset.locations);
  displayMap(locArr);
}
if (logoutEle) {
  logoutEle.addEventListener('click', logout);
}
if (formUserDataUpdate) {
  formUserDataUpdate.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateSettings({ name, email }, 'data');
  });
}
if (formUserSettings) {
  formUserSettings.addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-confirm').value;
    document.getElementById('save-password').textContent = 'Updating ...';

    await updateSettings(
      { currentPassword, newPassword, confirmPassword },
      'password'
    );
    document.getElementById('save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
