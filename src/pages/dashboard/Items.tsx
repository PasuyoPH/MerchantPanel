import { useEffect, useState, useRef } from 'react'
import { Http } from 'app-structs'
import { Constants } from 'app-types'
import Header from '../../../components/Text/Header'
import Label from '../../../components/Text/Label'
import { RestaurantFilter } from 'app-types/src/filters'
import Button from '../../../components/Display/Button'
import { Buffer }from 'buffer'
import { PageProps } from '../../../types'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const http = new Http.Client()

const AddItem = (props: PageProps) => {
    const [
      [error, message],
      setResult
    ] = useState([false, '']),

    // forms
    [name, setName] = useState<string>(),
    [price, setPrice] = useState<string>(),
    [banner, setBanner] = useState<string>(),
    [profile, setProfile] = useState<string>(),
    [types, setTypes] = useState<number[]>([]),

    // urls
    [profileUrl, setProfileUrl] = useState<string>(),
    [bannerUrl, setBannerUrl] = useState<string>(),

    bannerRef = useRef<HTMLInputElement>(null),
    profileRef = useRef<HTMLInputElement>(null),

    // filters
    [filters, setFilters] = useState<RestaurantFilter[]>([])

  const uploadBase64 = async (data: string) => {
      const [_, img] = data.split(';base64,'),
        form = new FormData()

      form.append(
        'photo',
        new Blob(
          [ Buffer.from(img, 'base64') ],
          {
            type: 'image/jpg'
          }
        ),
      )

      const result = await http.request<string>(
        {
          method: 'post',
          url: Constants.Url.Routes.PROFILE,
          data: form,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      return result.value
    },
    save = async () => {
      setResult([false, ''])

      const result = await http.request(
        {
          method: 'post',
          url: Constants.Url.Routes.MERCHANT_ME_ITEMS,
          data: {
            name,
            price: Number(price),
            banner: bannerUrl,
            image: profileUrl
          },
          headers: {
            Authorization: props.token
          }
        }
      )

      if (result.message)
        setResult(
          [
            result.error ?? false,
            result.message
          ]
        )

      if (!result.error)
        location.href = '/merchant/dashboard'
    }

  useEffect(
    () => {
      const init = async () => {
        if (!profile?.startsWith('data')) return
        const url = await uploadBase64(profile)

        setProfileUrl(url ?? '')
      }

      init()
        .catch(console.error)
    },
    [profile]
  )

  useEffect(
    () => {
      const init = async () => {
        if (!banner?.startsWith('data')) return
        const url = await uploadBase64(banner)

        setBannerUrl(url ?? '')
      }

      init()
        .catch(console.error)
    },
    [banner]
  )

  useEffect(
    () => {
      const fetchFilters = async () => {
        const result = await http.request<RestaurantFilter[]>(
          {
            method: 'get',
            url: Constants.Url.Routes.FILTERS
          }
        )

        //setFilters(result.value ?? [])
      }

      fetchFilters()
        .catch(console.error)
    },
    []
  )
  return (
    <div
      style={
        {
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }
      }
    >
      <input
        ref={bannerRef}
        type='file'
        style={{ display: 'none' }}
        onChange={
          (event) => {
            const [file] = (event.target.files ?? []),
              reader = new FileReader()

            reader.readAsDataURL(file)
            reader.onload = async () => {
              // upload profile
              setBanner(reader.result as string)
            }
          }
        }
      />

      <input
        ref={profileRef}
        type='file'
        style={{ display: 'none' }}
        onChange={
          (event) => {
            const [file] = (event.target.files ?? []),
              reader = new FileReader()

            reader.readAsDataURL(file)
            reader.onload = async () => {
              // upload profile
              setProfile(reader.result as string)
            }
          }
        }
      />

      <Header
        text='Add New item'
      />

      <div
        style={
          {
            display: 'flex',
            flexDirection: 'row',
            gap: 8
          }
        }
      >
        <img
          src={profile}
          width={64}
          height={64}
          style={{ borderRadius: 10, cursor: 'pointer' }}
          onClick={
            () => {
              if (!profileRef.current) return
              profileRef.current.click()
            }
          }
        />

        <img
          src={banner}
          width={256 + 64}
          height={128 + 32}
          style={{ borderRadius: 10, cursor: 'pointer' }}
          onClick={
            () => {
              if (!bannerRef.current) return
              bannerRef.current.click()
            }
          }
        />
      </div>

      <div
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }
        }
      >
        <div>
          <input
            placeholder='Item Name'
            onChange={
              (event) => setName(event.target.value)
            }
          />
        </div>

        <div>
          <input
            placeholder='Price'
            onChange={
              (event) => {
                if (event.target.value.match(/[a-zA-Z]/g)) return
                                
                setPrice(event.target.value)
              }
            }
          />
        </div>
      </div>

      { /* food type */ }
      <div
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }
        }
      >
        <Header
          size={24}
          text='Set food type'
        />

        {
          filters.map(
            (filter, idx) => idx !== 0 ? (
              <div
                key={idx}
                style={
                  {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }
                }
              >
                <input
                  type='checkbox'
                  placeholder={filter.name}
                  checked={types.includes(idx - 1)}
                  onChange={
                    (event) => {
                      if (event.target.checked)
                        setTypes(
                          [...types, idx - 1]
                        )
                      else {
                        setTypes(
                          types.filter(
                            (type) => type !== idx - 1
                          )
                        )
                      }
                    }
                  }
                />

                <Label
                  text={filter.name}
                />
              </div>
            ) : null
          )
        }
      </div>

      <div
        style={
          {
            display: 'flex',
            flexDirection: 'row'
          }
        }
      >
        <Button
          text={{ content: 'Add', reverse: true }}
          icon={faPlus}
          inverted={
            { color: Constants.Colors.Text.green }
          }
          onPress={save}
        />
      </div>

      {
        message ? (
          <Label
            color={
              error ?
                Constants.Colors.Text.danger :
                Constants.Colors.Text.green
            }
            text={message}
          />
        ) : null
      }
    </div>
  )
}

export default AddItem