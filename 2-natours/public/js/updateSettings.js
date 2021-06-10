import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updatePassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    console.log(data);
    if (res.data.status === 'success')
      showAlert('success', `${type.toUpperCase()} updated successfully 🚀🚀🚀`);
  } catch (err) {
    showAlert('error', `Please check ${type} again 💥💥💥`);
  }
};
