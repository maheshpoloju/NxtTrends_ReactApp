import {Elements} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js'
import {useContext, useState} from 'react'
import CartContext from '../../context/CartContext'
import PaymentsPage from '../PaymentsPage'
import './index.css'

const CartSummary = () => {
  const {cartList} = useContext(CartContext)
  const stripePromise = loadStripe(
    'pk_test_51QGHGvGPoj0K2AOdifADRtJXuSgXxHS4tqnWRTyJB3aKkQkfeUzv2YNHcnS6B2oha7XokNjtv5CGKZRSh4ELEusK00ylBwH0Br',
  )
  let total = 0
  cartList.forEach(eachCartItem => {
    total += eachCartItem.price * eachCartItem.quantity
  })
  const [showPaymentsPage, setShowPaymentsPage] = useState(false)
  const handleCheckoutBtn = () => setShowPaymentsPage(true)

  return (
    <>
      <div className="cart-summary-container">
        <h1 className="order-total-value">
          <span className="order-total-label">Order Total:</span> Rs {total}
          /-
        </h1>
        <p className="total-items">{cartList.length} Items in cart</p>
        <button
          onClick={handleCheckoutBtn}
          type="button"
          className="checkout-button d-sm-none"
        >
          Checkout
        </button>
      </div>
      <button
        onClick={handleCheckoutBtn}
        type="button"
        className="checkout-button d-lg-none"
      >
        Checkout
      </button>
      {showPaymentsPage && (
        <Elements stripe={stripePromise}>
          <PaymentsPage total={total} />
        </Elements>
      )}
    </>
  )
}

export default CartSummary
