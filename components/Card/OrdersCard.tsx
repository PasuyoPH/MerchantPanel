import { Constants, Orders, Transactions } from 'app-types'
import Header from '../Text/Header'
import OrdersStyle from './Orders.module.css'
import Label from '../Text/Label'
import { Http } from 'app-structs'
import { useState , useEffect } from 'react'

const http = new Http.Client(),
  statusToText = (status: Transactions.TransactionStatus) => {
    switch (status) {
      case Transactions.TransactionStatus.USER_PAID:
        return 'PAID'

      case Transactions.TransactionStatus.USER_REFUNDED:
        return 'Refunded'

      case Transactions.TransactionStatus.WAITING_USER_PAYMENT:
        return 'Waiting for Payment'

      case Transactions.TransactionStatus.COD_PAYMENT_CONFIRMED:
        return 'Cash on Delivery ( Confirmed )'
      
      case Transactions.TransactionStatus.COD_WAITING_FOR_PAYMENT:
        return 'Cash on Delivery ( Waiting for Payment )'

      case Transactions.TransactionStatus.GCASH_MANUAL_WAITING_FOR_CONFIRMATION:
        return 'GCash ( Waiting for Confirmation )'
    }
  }

interface OrderData {
  uid: string;
  pending: boolean;
  items: { uid: string, name: string, quantity: number }[]
  total: number
  finsihed?: boolean
  pickedUp?: boolean
}

const OrdersCard = (props: { token: string, others: string[] }) => {
  const [orders, setOrders] = useState<OrderData[]>()

  const init = async () => {
    const result = await http.request<OrderData[]>(
      {
        method: 'get',
        url: Constants.Url.Routes.MERCHANT_ME_ORDERS,
        headers: {
          Authorization: props.token
        }
      }
    )

    console.log(result.value)
    setOrders(result.value ?? [])
  }

  useEffect(
    () => {
      init()
        .catch(console.error)
    },
    []
  )

  useEffect(
    () => {
      if (props.others.length < 1) return

      // fetch newest
      init()
        .catch(console.error)
    },
    [props.others]
  )

  return (
    <div
      className={OrdersStyle.container}
      style={
        { backgroundColor: Constants.Colors.Text.alt }
      }
    >
      <Header
        text='Orders'
        label='Orders to Make'
      />

      <table>
        <thead>
          <tr>
            <th>
              ID
            </th>
            <th>
              Total (w/ fees)
            </th>
            <th>
              Items
            </th>
            <th>
              Actions
            </th>
          </tr>
        </thead>
        
        {
          Array.isArray(orders) ? (
            orders.map(
              (order, idx) => (
                <tbody key={idx}>
                  <tr
                    style={
                      {
                        backgroundColor: (order.pending) ?
                          Constants.Colors.Text.danger :
                          order.finsihed ?
                            Constants.Colors.Text.green :
                            order.pickedUp ?
                              Constants.Colors.All.lightBlue :
                              Constants.Colors.All.main
                      }
                    }
                  >
                    <td>
                      <Label
                        text={order.uid}
                        color={Constants.Colors.Text.alt}
                      />
                    </td>
                    <td>
                      <Label
                        text={order.total?.toFixed(2)}
                        color={Constants.Colors.Text.alt}
                      />
                    </td>
                    <td
                      style={
                        {
                          display: 'flex',
                          flexDirection: 'column'
                        }
                      }
                    >
                      {
                        order.items.map(
                          (item, idx) => (
                            <div
                              key={idx}
                              style={
                                {
                                  display: 'flex',
                                  flexDirection: 'row',
                                  cursor: 'pointer',
                                  gap: 8
                                }
                              }
                              onClick={() => location.href = '/merchant/dashboard/items/' + item.uid}
                            >
                              <Label
                                text={item.name}
                                color={Constants.Colors.Text.alt}
                              />

                              <Label
                                text='-'
                                color={Constants.Colors.Text.alt}
                              />

                              <Label
                                text={item.quantity.toLocaleString()}
                                color={Constants.Colors.Text.alt}
                              />
                            </div>
                          )
                        )
                      }
                    </td>
                    <td>
                      {
                        order.pending ? (
                          <div
                            style={
                              {
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 16
                              }
                            }
                          >
                            <div
                              style={{ cursor: 'pointer' }}
                              onClick={
                                async () => {
                                  await http.request(
                                    {
                                      method: 'post',
                                      url: Constants.Url.Routes.MERCHANT_ME_APPROVE_ORDER(order.uid),
                                      headers: {
                                        Authorization: props.token
                                      }
                                    }
                                  )

                                  setOrders(
                                    orders.map(
                                      (o) => {
                                        if (order.uid === o.uid)
                                          o.pending = false

                                        return o
                                      }
                                    )
                                  )
                                }
                              }
                            >
                              <Label
                                text='Approve'
                                color={Constants.Colors.Text.alt}
                                size={14}
                              />
                            </div>

                            <Label
                              text='Cancel'
                              color={Constants.Colors.Text.alt}
                              containerStyle={
                                { cursor: 'pointer' }
                              }
                              size={14}
                            />
                          </div>
                        ) : null
                      }
                    </td>
                  </tr>
                </tbody>
              )
            )
          ) : null
        }
      </table>
    </div>
  )
}

export default OrdersCard