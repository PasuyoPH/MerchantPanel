import { faHouseChimney, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Address, Constants } from 'app-types'
import { Http } from 'app-structs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Label from '../Text/Label'
import Button from '../Display/Button'
import { animated, useSpring } from '@react-spring/web'

interface AddressCardProps {
  token: string
  address: Address.AddressData

  hideButtons?: boolean

  // callbacks, to be executed when their original fn is done & worked
  onDelete?: () => void
  onPress?: () => void // execute only when main card is clicked
  onError?: (msg: string) => void
}

const http = new Http.Client()

const AddressCard = (props: AddressCardProps) => { 
  const [springs, api] = useSpring(
    () => (
      {
        from: {
          transform: 'scale(100%)'
        }
      }
    )
  )
  
  const deleteAddress = async () => {
    const result = await http.request(
      {
        method: 'delete',
        url: Constants.Url.Routes.MERCHANT_ME_ADDRESS(props.address.uid),
        headers: {
          Authorization: props.token
        }
      }
    )

    if (result.error && typeof props.onError === 'function')
      props.onError(result.message ?? '')

    if (!result.error && typeof props.onDelete === 'function')
      props.onDelete()
  }

  return (
    // we can't use our buttons, we need to make new ones from scratch to support this custom design
    <div
      style={
        {
          display: 'flex',
          flexDirection: 'column',
          //alignItems: 'flex-start',
          width: 256
        }
      }
    >
      <animated.div
        onMouseEnter={
          () => api.start(
            {
              from: { transform: 'scale(100%)' },
              to: { transform: 'scale(105%)' }
            }
          )
        }
        onMouseLeave={
          () => api.start(
            {
              from: { transform: 'scale(105%)' },
              to: { transform: 'scale(100%)' }
            }
          )
        }
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: Constants.Colors.All.lightBlue,
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: 18,
            paddingRight: 18,
            borderRadius: 12,
            gap: 8,
            ...springs
          }
        }
        onClick={props.onPress}
      >
        <div
          style={
            {
              display: 'flex',
              flexDirection: 'row',
              gap: 12,
              alignItems: 'center'
            }
          }
        >
          <FontAwesomeIcon
            color={Constants.Colors.Text.alt}
            icon={faHouseChimney}
            fontSize={22}
          />

          <Label
            color={Constants.Colors.Text.alt}
            weight='bold'
            size={20}
            text={props.address?.template ?? 'No Template'}
          />
        </div>

        <div
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }
          }
        >
          <Label
            size={12}
            color={Constants.Colors.Layout.secondary}
            style='italic'
            text={props.address?.landmark ?? 'No landmark available'}
          />

          <Label
            size={14}
            color={Constants.Colors.Layout.secondary}
            text={props.address?.text ?? 'Address unavailable'}
          />
        </div>

        {
          props.hideButtons ? null : (
            <div
              style={
                {
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  gap: 8
                }
              }
            >
              {/*<Button
                icon={faPenToSquare}
                bg={Constants.Colors.All.main}
                paddingHorizontal={8}
                paddingVertical={8}
                text={{ size: 10 }}
            />*/}

              <Button
                icon={faTrash}
                bg={Constants.Colors.Text.danger}
                paddingHorizontal={8}
                paddingVertical={8}
                text={{ size: 10 }}
                onPress={deleteAddress}
              />
            </div>
          )
        }
      </animated.div>
    </div>
  )
}

export default AddressCard