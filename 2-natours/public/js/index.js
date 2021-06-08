import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './map';

const mapEle = document.getElementById('map');
const formEle = document.querySelector('.form');
const logoutEle = document.getElementById('logout');

if (formEle)
  formEle.addEventListener('submit', (e) => {
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
  logout();
}
