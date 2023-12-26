import { faCity, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Address, App, Constants } from 'app-types'
import GoogleMapReact from 'google-map-react'
import Header from '../../../components/Text/Header'
import Autocomplete from 'react-google-autocomplete'
import { useEffect, useState } from 'react'
import Modal from '../../../components/Display/Modal'
import Button from '../../../components/Display/Button'
import { faPaperPlane, faPenToSquare, faSave } from '@fortawesome/free-regular-svg-icons'
import useStateRef from 'react-usestateref'
import Label from '../../../components/Text/Label'
import { Http } from 'app-structs'
import { PageProps } from '../../../types'

interface AddressForm {
  text?: string
  template?: string
  landmark?: string
  contactPhone?: string
  contactName?: string
  useUserData?: boolean
}

const http = new Http.Client()

const NewAddress = (props: PageProps) => {
  const [currentPosition, setCurrentPosition, currentPositionRef] = useStateRef<App.Geo | null>(null),
    //[text, setText] = useState<string>(),
    [modalShown, setModalShown] = useState(false),
    [form, setForm, formRef] = useStateRef<AddressForm>({}),
    [
      [error, message],
      setResult
    ] = useState([false, ''])

  useEffect(
    () => {
      console.log(navigator)

      navigator.geolocation.getCurrentPosition(
        (position) => setCurrentPosition(
          {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        )
      )
    },
    []
  )

  useEffect(
    () => {
      console.log('Change:', currentPosition)
    },
    [currentPosition]
  )

  const saveAddress = async (data: AddressForm) => {
      const result = await http.request<Address.AddressData>(
        {
          url: Constants.Url.Routes.MERCHANT_ME_ADDRESSES,
          method: 'post',
          headers: { Authorization: props.token },
          data: {
            address: {
              ...data,
              latitude: currentPositionRef.current?.lat,
              longitude: currentPositionRef.current?.lng
            }
          }
        }
      )

      if (result.error)
        setResult(
          [
            result.error,
            result.message ?? ''
          ]
        )
      else {
        setResult(
          [
            false,
            'Address successfully saved.'
          ]
        )

        location.href = '/merchant/dashboard/address'
      }
    },
    reverseLocationGeocode = async () => {
      if (formRef.current.text) return
      const result = await http.request<string>(
        {
          url: Constants.Url.Routes.GEOCODE,
          method: 'post',
          data: {
            lat: currentPositionRef.current?.lat,
            long: currentPositionRef.current?.lng
          }
        }
      )
      
      setForm(
        (currentForm) => (
          { ...currentForm, text: result.value ?? '' }
        )
      )
    }

  return (
    <>
      <div
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100%',
            gap: 8
          }
        }
      >
        <div
          style={
            {
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignSelf: 'flex-start',
              width: '100%',
              alignItems: 'center'
            }
          }
        >
          <div
            style={
              {
                display: 'flex',
                flexDirection: 'column'
              }
            }
          >
            <Header
              text='Add new address'
            />

            {/*<Autocomplete
              apiKey='AIzaSyAe1O4RsaElYL79mHnPSHRGL_lVCf9uP0M'
              options={
                {
                  componentRestrictions: { country: 'ph' },
                  types: ['address']
                }
              }
              onPlaceSelected={
                (place) => {
                  const location = place?.geometry?.location
                  if (!location) return

                  setForm(
                    (currentForm) => (
                      { ...currentForm, text: place.formatted_address }
                    )
                  )

                  setCurrentPosition(
                    () => (
                      {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                      }
                    )
                  )
                }
              }
              libraries={['establishment']}
            />*/}
          </div>

          <div>
            <Button
              text={{ content: 'Save', reverse: true }}
              icon={faSave}
              inverted={
                { color: Constants.Colors.All.lightBlue}
              }
              onPress={
                () => {
                  //reverseLocationGeocode()
                  setModalShown(true)
                }
              }
            />
          </div>
        </div>

        <div
          style={
            {
              position: 'absolute',
              zIndex: 1,
            }
          }
        >
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            fontSize={20}
            color={Constants.Colors.Text.danger}
          />
        </div>

        {
          currentPosition ? (
            <GoogleMapReact
              bootstrapURLKeys={
                { key: 'AIzaSyAe1O4RsaElYL79mHnPSHRGL_lVCf9uP0M' }
              }
              center={currentPosition}
              defaultZoom={10}
              onChange={
                (event) => setCurrentPosition(event.center)
              }
            />
          ) : (
            <div
              style={
                {
                  width: '100%',
                  height: 480,
                  backgroundColor: 'lightgrey'
                }
              }
            />
          )
        }
      </div>

      <Modal
        onDismiss={
          () => {
            setResult([false, ''])
            setModalShown(false)
            setForm({})
          }
        }
        show={modalShown}
        container={
          {
            style: {
              margin: 32
            }
          }
        }
      >
            <div
              style={
                {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }
              }
            >
              { /* Address provided */ }
              <div
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column'
                  }
                }
              >
                <div
                  style={
                    {
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8
                    }
                  }
                >
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    color={Constants.Colors.Text.tertiary}
                  />

                  <Label
                    weight='bold'
                    size={18}
                    color={Constants.Colors.Text.tertiary}
                    text='Address'
                  />
                </div>

                <input
                  placeholder='Input Address'
                  onChange={
                    (event) => setForm(
                      (currentForm) => (
                        { ...currentForm, text: event.target.value ?? '' }
                      )
                    )
                  }
                />
              </div>

              { /* Landmark */ }
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
                      flexDirection: 'column'
                    }
                  }
                >
                  <div
                    style={
                      {
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8
                      }
                    }
                  >
                    <FontAwesomeIcon
                      icon={faCity}
                      color={Constants.Colors.Text.tertiary}
                    />

                    <Label
                      weight='bold'
                      size={18}
                      color={Constants.Colors.Text.tertiary}
                      text='Landmark'
                    />
                  </div>

                  <Label
                    size={12}
                    color={Constants.Colors.Text.secondary}
                    text='Decide a landmark for the address.'
                  />
                </div>

                <input
                  placeholder='Optional'
                  value={form.landmark}
                  onChange={
                    (event) => setForm(
                      (currentForm) => (
                        { ...currentForm, landmark: event.target.value ?? '' }
                      )
                    )
                  }
                />
              </div>

              { /* Contact */ }
              

              {/*<Divider
                color={Constants.Colors.Text.secondary + '33'}
                width={.3}
              />*/}

              { /* Save As */ }
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
                      flexDirection: 'column'
                    }
                  }
                >
                  <div
                    style={
                      {
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8
                      }
                    }
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      color={Constants.Colors.Text.tertiary}
                    />

                    <Label
                      weight='bold'
                      size={18}
                      color={Constants.Colors.Text.tertiary}
                      text='Save As'
                    />
                  </div>

                  <Label
                    size={12}
                    color={Constants.Colors.Text.secondary}
                    text='Choose a name to save your address as.'
                  />
                </div>

                <input
                  placeholder='Name Here'
                  value={form.template}
                  onChange={
                    (event) => setForm(
                      (currentForm) => (
                        { ...currentForm, template: event.target.value ?? '' }
                      )
                    )
                  }
                />
              </div>

              <div
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                  }
                }
              >
                <Button
                  inverted={
                    { color: Constants.Colors.Text.green }
                  }
                  text={
                    { content: 'Save' }
                  }
                  icon={faSave}
                  onPress={
                    () => {
                      console.log('Addr:', form.text)
                      console.log('Landmark:', form.landmark)
                      console.log('Name:', form.template)

                      saveAddress(form)
                    }
                  }
                />

                {
                 message ? (
                    <Label
                      color={
                        error ?
                          Constants.Colors.Text.danger :
                          Constants.Colors.Text.green
                      }
                      size={14}
                      text={message}
                    />
                  ) : null
                }
              </div>
            </div>
      </Modal>
    </>
  )
}

export default NewAddress