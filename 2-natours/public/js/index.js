import '@babel/polyfill';

import { login, logout } from './login';
import { displayMap } from './map';
import { updateUserData } from './updateSettings';

const mapEle = document.getElementById('map');
const formLogin = document.querySelector('.form--login');
const logoutEle = document.getElementById('logout');
const formUserDataUpdate = document.querySelector('.form-user-data');

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
    updateUserData(name, email);
  });
}
