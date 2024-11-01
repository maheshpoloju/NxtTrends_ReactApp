import {useState} from 'react'
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js'
import './CustomPaymentForm.css'

const CustomPaymentForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleSubmit = async event => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    // Get the card elements
    const cardNumberElement = elements.getElement(CardNumberElement)
    const cardExpiryElement = elements.getElement(CardExpiryElement)
    const cardCvcElement = elements.getElement(CardCvcElement)

    const {
      error: stripeError,
      paymentMethod,
    } = await stripe.createPaymentMethod({
      type: 'card',
      card: {
        number: cardNumberElement.value,
        exp_month: cardExpiryElement.value.split('/')[0], // MM
        exp_year: cardExpiryElement.value.split('/')[1], // YY
        cvc: cardCvcElement.value,
      },
    })

    if (stripeError) {
      setError(stripeError.message)
      setSuccess(null)
    } else {
      setError(null)
      setSuccess(`Payment succeeded! PaymentMethod ID: ${paymentMethod.id}`)
    }
  }

  return (
    <div className="form-container">
      <h2>Payment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="cardNum">Card Number</label>
          <CardNumberElement id="cardNum" className="card-input" />
        </div>
        <div>
          <label htmlFor="expDate">Expiration Date (MM/YY)</label>
          <CardExpiryElement id="expDate" className="card-input" />
        </div>
        <div>
          <label htmlFor="cvc">CVC</label>
          <CardCvcElement id="cvc" className="card-input" />
        </div>
        <button type="submit" disabled={!stripe}>
          Pay
        </button>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </form>
    </div>
  )
}

export default CustomPaymentForm
