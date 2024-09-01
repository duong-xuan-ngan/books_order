import React, { useEffect } from 'react'

const [cart, setCart] = useState()
const addToCart = (bookId) => {
    if (bookId) {
        commerce.cart.add(bookId, 1)
        .then(res => {
            setCart(res.cart)
        })
    }
    else {
        window.alert('Please Select book')
    }
    useEffect(() => {
        commerce.cart.retrieve()
            .then(res => {
                setCart(res)
            })
    }, [])

  return (
    <div>addToCart</div>
  )
}

export default addToCart