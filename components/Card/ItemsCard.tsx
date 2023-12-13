import { Constants, Items } from 'app-types'
import Header from '../Text/Header'
import ItemsCardStyle from './ItemsCard.module.css'
import Label from '../Text/Label'
import { Http } from 'app-structs'
import { useEffect, useState } from 'react'
import Button from '../Display/Button'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const http = new Http.Client()

const ItemsCard = (props: { token: string }) => {
  const [items, setItems] = useState<Items.Item[]>()

  useEffect(
    () => {
      const init = async () => {
        const result = await http.request<Items.Item[]>(
          {
            method: 'get',
            url: Constants.Url.Routes.MERCHANT_ME_ITEMS,
            headers: { Authorization: props.token }
          }
        )

        setItems(result?.value ?? [])
      }

      init()
        .catch(console.error)
    },
    []
  )

  const deleteItem = async (uid: string) => {
    await http.request(
      {
        method: 'delete',
        url: Constants.Url.Routes.MERCHANT_ME_ITEM(uid),
        headers: {
          Authorization: props.token
        }
      }
    )

    setItems(
      items?.filter(
        (item) => item.uid !== uid
      )
    )
  }

  return (
    <div
      className={ItemsCardStyle.container}
      style={
        { backgroundColor: Constants.Colors.Text.alt }
      }
    >
      <div
        style={
          {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }
        }
      >
        <Header
          text='Merchant Items'
          label='View all items in inventory'
        />

        <Button
          text={{ content: 'Add', reverse: true }}
          icon={faPlus}
          inverted={{ color: Constants.Colors.Text.green }}
          onPress={
            () => location.href = '/merchant/dashboard/items'
          }
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>
              Logo
            </th>
            <th>
              ID
            </th>
            <th>
              Name
            </th>
            <th>
              Price
            </th>
            <th>
              Added At
            </th>
            <th>
              Actions
            </th>
          </tr>
        </thead>
        
        {
          Array.isArray(items) ? (
            items.map(
              (item, idx) => (
                <tbody key={idx}>
                  <tr>
                    <td>
                    <img
                      src={item.image}
                      style={{ width: 32, height: 32 }}
                    />
                    </td>
                    <td>
                      <Label
                        text={item.uid}
                      />
                    </td>
                    <td>
                     <Label
                        text={item.name}
                     />
                    </td>
                    <td>
                      <Label
                        text={item.price?.toFixed(2)}
                      />
                    </td>
                    <td>
                      <Label
                        text={
                          new Date(
                            Number(item.addedAt)
                          )
                            .toUTCString()
                        }
                      />
                    </td>
                    <td
                      style={
                        {
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8
                        }
                      }
                    >
                      <div
                        style={
                          { cursor: 'pointer' }
                        }
                        onClick={
                          () => location.href = '/merchant/dashboard/items/' + item.uid
                        }
                      >
                        <Label
                          text='Edit'
                          color={Constants.Colors.All.lightBlue}
                        />
                      </div>

                      <div
                        style={
                          { cursor: 'pointer' }
                        }
                        onClick={
                          () => deleteItem(item.uid)
                        }
                      >
                        <Label
                          text='Delete'
                          color={Constants.Colors.Text.danger}
                        />
                      </div>
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

export default ItemsCard