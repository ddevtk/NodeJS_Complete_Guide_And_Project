import axios from 'axios';
import { showAlert } from './alert';

export const updateUserData = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:8000/api/v1/users/updateMe',
      data: {
        name,
        email,
      },
    });
    if (res.data.status === 'success')
      showAlert('success', 'Data updated successfully 🚀🚀🚀');
  } catch (err) {
    showAlert('error', 'Please provide valid email and password');
  }
};
