import axios from 'axios';
import { showAlert } from './alert';

// Boi vi dang dung thu vien stripe o client ( <script src="https://js.stripe.com/v3/"></script> )
// neu ma import Stripe from 'stripe' thi se khong co phuong thuc redirectToCheckout =)) nho nhe, dung quen Duong à
const stripe = Stripe(
  'pk_test_51ImCrfBkpfa5azqqu0Dml8ldaVWUMhsF54aZguiKTXLOK2rT1tshmQGURcReflqVczRT1lhbGKuVuJzLuoPE5uLF00OLLCNB35'
);

export const bookTour = async (tourId) => {
  try {
    const session = await axios({
      url: `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`,
    });
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    showAlert('error', error);
  }
};
