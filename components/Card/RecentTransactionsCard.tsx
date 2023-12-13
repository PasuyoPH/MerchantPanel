import { Constants, Transactions } from 'app-types'
import Header from '../Text/Header'
import RecentTransactionsStyle from './RecentTransactions.module.css'
import Label from '../Text/Label'
import { Http } from 'app-structs'

const transactions: any[] = []

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

const RecentTransactionsCard = (props: { token: string }) => {
  return (
    <div
      className={RecentTransactionsStyle.container}
      style={
        { backgroundColor: Constants.Colors.Text.alt }
      }
    >
      <Header
        text='Recent Transactions'
        label='View all transactions made'
      />

      <table>
        <thead>
          <tr>
            <th>
              Transaction ID
            </th>
            <th>
              Amount
            </th>
            <th>
              Currency
            </th>
            <th>
              Status
            </th>
            <th>
              Created At
            </th>
          </tr>
        </thead>
        
        {
          Array.isArray(transactions) ? (
            transactions.map(
              (transaction, idx) => (
                <tbody key={idx}>
                  <tr>
                    <td>
                      <Label
                        text={transaction.uid}
                      />
                    </td>
                    <td>
                      <Label
                        text={transaction.amount?.toFixed(2)}
                      />
                    </td>
                    <td>
                      <Label
                        text={transaction.currency ?? 'PHP'}
                      />
                    </td>
                    <td>
                      <Label
                        text={statusToText(transaction.status) ?? 'Status Unknown'}
                      />
                    </td>
                    <td>
                      <Label
                        text={
                          new Date(
                            Number(transaction.createdAt)
                          )
                            .toUTCString()
                        }
                      />
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

export default RecentTransactionsCard