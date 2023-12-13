import { useEffect, useState } from 'react'
import Header from '../../../components/Text/Header'
import { Address, Constants } from 'app-types'
import { Http } from 'app-structs'
import AddressCard from '../../../components/Card/Address'
import Button from '../../../components/Display/Button'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { PageProps } from '../../../types'

const http = new Http.Client()

const Addresses = (props: PageProps) => {
  const [addresses, setAddresses] = useState<Address.AddressData[]>(),
    [message, setMessage] = useState<string>()

  useEffect(
    () => {
      const fetchAddresses = async () => {
        const result = await http.request<Address.AddressData[]>(
          {
            method: 'get',
            url: Constants.Url.Routes.MERCHANT_ME_ADDRESSES,
            headers: {
              Authorization: props.token
            }
          }
        )

        console.log(result)
        setAddresses(result.value ?? [])
      }

      fetchAddresses()
        .catch(console.error)
    },
    []
  )

  return addresses ? (
    <div
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
          {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }
        }
      >
        <Header
          text='Your addresses'
          label={message}
        />

        <Button
          text={{ content: 'New', reverse: true }}
          icon={faPlus}
          inverted={{ color: Constants.Colors.Text.green }}
          onPress={
            () => location.href = '/merchant/dashboard/address/new'
          }
        />
      </div>

      <div
        style={
          {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 16
          }
        }
      >
        {
          addresses.map(
            (address, idx) => (
              <div
                key={idx}
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }
                }
              >
                <AddressCard 
                  address={address}
                  token={props.token ?? ''}
                  onDelete={
                    () => setAddresses(
                      addresses.filter(
                        (a) => a.uid !== address.uid
                      )
                    )
                  }
                  onError={setMessage}
                />
              </div>
            )
          )
        }
      </div>      
    </div>
  ) : null
}

export default Addresses