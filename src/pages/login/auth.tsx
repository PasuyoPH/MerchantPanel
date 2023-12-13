import { useState, useEffect } from 'react'
import IconPNG from '../../icon.png'
import { Constants } from 'app-types'
import Header from '../../../components/Text/Header'
import Label from '../../../components/Text/Label'
import Button from '../../../components/Display/Button'
import { faSignIn } from '@fortawesome/free-solid-svg-icons'
import { Http } from 'app-structs'
import { PageProps } from '../../../types'

const http = new Http.Client()

const Auth = (props: PageProps) => {
  useEffect(
    () => {
      const token = localStorage.getItem('token')
      if (token)
        location.href = '/merchant/dashboard'
    },
    []
  )

  const [username, setUsername] = useState<string>(),
    [password, setPassword] = useState<string>(),
    [
      [error, message],
      setResult
    ] = useState([false, ''])

  const login = async () => {
    setResult([false, ''])

    const result = await http.request<string>(
      {
        method: 'post',
        url: Constants.Url.Routes.MERCHANT_ME_TOKEN,
        data: { username, password }
      }
    )

    if (result.message)
      setResult(
        [
          !!result.error,
          result.message
        ]
      )
      
    if (result.value)
      props.events.emit('token', result.value)
  }

  return (
    <div
      style={
        {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: Constants.Colors.All.whiteSmoke,
          gap: 8
        }
      }
    >
      <img
        src={IconPNG}
        style={
          { height: 256 }
        }
      />

      <div
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
            backgroundColor: Constants.Colors.All.whiteSmoke,
            boxShadow: '0px 4px 10px 2px lightgrey',
            padding: '32px',
            borderRadius: 4
          }
        }
      >
        <div
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }
          }
        >
          <Header
            text='Login'
          />

          <Label
            text='as Merchant'
            color={Constants.Colors.Text.secondary}
            style='italic'
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
          <input
            placeholder='Username'
            onChange={
              (event) => setUsername(event.target.value)
            }
          />

          <input
            placeholder='Password'
            onChange={
              (event) => setPassword(event.target.value)
            }
            type='password'
          />
        </div>

        <div
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8
            }
          }
        >
          <Button
            text={{ content: 'Login', reverse: true }}
            inverted={
              { color: Constants.Colors.All.lightBlue }
            }
            icon={faSignIn}
            onPress={login}
          />

          {
            message ? (
              <Label
                color={
                  error ?
                    Constants.Colors.Text.danger :
                    Constants.Colors.Text.green
                }
                text={message}
                containerStyle={
                  { maxWidth: 256, textAlign: 'center' }
                }
              />
            ) : null
          }
        </div>
      </div>
    </div>
  )
}

export default Auth