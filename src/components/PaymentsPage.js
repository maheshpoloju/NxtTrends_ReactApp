import {useState} from 'react'
import {CardElement, useElements, useStripe} from '@stripe/react-stripe-js'

const PaymentsPage = ({total}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [status, setStatus] = useState('')

  const handlePayment = async event => {
    event.preventDefault()
    if (!stripe || !elements) {
      return
    }
    try {
      const url = 'http://localhost:3001/create-payment'
      const amountInPaise = total * 100
      const paramsObj = {amount: amountInPaise}
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paramsObj),
      }
      const response = await fetch(url, options)
      const {clientSecret} = await response.json()
      const cardElement = elements.getElement(CardElement)
      const {error, paymentIntent} = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        },
      )
      if (error) {
        setStatus(`Payment failed: ${error.message}`)
      } else if (paymentIntent.status === 'succeeded') {
        setStatus('Payment successful! Thank you for your purchase.')
      }
    } catch (e) {
      console.log('Err in handleCheckout', e)
    }
  }
  return (
    <div>
      <h2>Complete Your Payment</h2>
      <form onSubmit={handlePayment}>
        <CardElement />
        <button type="submit" disabled={!stripe}>
          Confirm Payment
        </button>
        {status && <p>{status}</p>}
      </form>
    </div>
  )
}

export default PaymentsPage
