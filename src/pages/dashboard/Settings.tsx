import { Constants, Merchant } from 'app-types'
import { useState, useEffect, useRef } from 'react'
import { Http } from 'app-structs'
import Label from '../../../components/Text/Label'
import { Buffer } from 'buffer'
import { RestaurantFilter } from 'app-types/src/filters'
import { HexColorPicker, HexColorInput } from 'react-colorful'
import Button from '../../../components/Display/Button'
import { faSave } from '@fortawesome/free-regular-svg-icons'
import { PageProps } from '../../../types'
import Header from '../../../components/Text/Header'

const http = new Http.Client()

const Settings = (props: PageProps) => {
  // todo: use token to get self
  const [name, setName] = useState<string>(),
    [banner, setBanner] = useState<string>(),
    [profile, setProfile] = useState<string>(),
    [types, setTypes] = useState<number[]>([]),
    [bio, setBio] = useState<string>(),
    [accent, setAccent] = useState<string>(),
    [open, setOpen] = useState<boolean>(),
    [opensAt, setOpensAt] = useState<number>(),
    [closedAt, setClosedAt] = useState<number>(),

    // urls
    [profileUrl, setProfileUrl] = useState<string>(),
    [bannerUrl, setBannerUrl] = useState<string>(),

    bannerRef = useRef<HTMLInputElement>(null),
    profileRef = useRef<HTMLInputElement>(null),

    [filters, setFilters] = useState<RestaurantFilter[]>([]),
    [loaded, setLoaded] = useState(false)

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
            'Content-Type': 'multipart/form-data',
            Authorization: props.token
          }
        }
      )

      return result.value
    },
    save = async () => {
      await http.request(
        {
          method: 'patch',
          url: Constants.Url.Routes.MERCHANT_ME,
          data: {
            name,
            bio,
            banner: bannerUrl,
            logo: profileUrl,
            types,
            accent,
            open,
            opensAt,
            closedAt
          },
          headers: {
            Authorization: props.token
          }
        }
      )
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
      const fetchMerchantData = async () => {
          const result = await http.request<Merchant.MerchantData>(
            {
              url: Constants.Url.Routes.MERCHANT_ME_SELF,
              method: 'get',
              headers: {
                Authorization: props.token
              }
            }
          )
        
          // update forms
          setName(result.value?.name)
          setBio(result.value?.bio)
          setBanner(result.value?.banner)
          setProfile(result.value?.logo)
          setTypes(result.value?.types ?? [])
          setAccent(result.value?.accent)
          setOpen(result.value?.open)
          setOpensAt(result.value?.opensAt)
          setClosedAt(result.value?.closedAt)

          setLoaded(true)
        },
        fetchFilters = async () => {
          const result = await http.request<RestaurantFilter[]>(
            {
              method: 'get',
              url: Constants.Url.Routes.FILTERS
            }
          )

          setFilters(result.value ?? [])
        }

      fetchFilters()
        .catch(console.error)

      fetchMerchantData()
        .catch(console.error)
    },
    []
  )

  return loaded ? (
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
                display: 'block',
                flexDirection: 'column'
              }
            }
          >
            <Label
              text='Merchant Name'
              weight='bold'
            />

            <input
              value={name ?? '' }
              placeholder='Name'
              onChange={
                (event) => setName(event.target.value ?? '')
              }
            />
          </div>

          <div
            style={
              {
                display: 'flex',
                flexDirection: 'column'
              }
            }
          >
            <Label
              text='Merchant Bio'
              weight='bold'
            />

            <textarea
              value={bio ?? ''}
              placeholder='Bio'
              draggable
              onChange={
                (event) => setBio(event.target.value ?? '')
              }
            />
          </div>
        </div>
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
        <HexColorPicker
          color={accent ?? ''}
          onChange={
            (color) => setAccent(color)
          }
        />
      
        <div>
          <HexColorInput
            color={accent ?? ''}
            onChange={
              (color) => setAccent(color)
            }
          />
        </div>
      </div>

      <div
        style={
          {
            display: 'flex',
            flexDirection: 'row',
            gap: 16
          }
        }
      >
        <img
          src={profile}
          width={128}
          height={128}
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
            (filter, idx) => (
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
                  placeholder={filter?.name}
                  checked={types.includes(idx)}
                  onChange={
                    (event) => {
                      if (event.target.checked)
                        setTypes(
                          [...types, idx]
                        )
                      else {
                        setTypes(
                          types.filter(
                            (type) => type !== idx
                          )
                        )
                      }
                    }
                  }
                />

                <Label
                  text={filter?.name}
                />
              </div>
            )
          )
        }
      </div>

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <input
          type='checkbox'
          placeholder={'Merchant Opened'}
          checked={open}
          onChange={() => setOpen(!open)}
        />
        
        <Label text='Open' />
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
        <Label text='Open At:' />

        <select
          onChange={
            (event) => setOpensAt(
              Number(event.target.value ?? 0)
            )
          }
        >
          {
            (
              () => {
                const arr: React.ReactNode[] = []

                for (let i = 0; i < 24; i++) {
                  arr.push(
                    <option
                      value={i + 1}
                    >
                      {
                        i === 0 ? '12 AM' : (
                          i === 12 ? '12 PM' : (
                            i < 12 ? `${i} AM` : `${i - 12} PM`
                          )
                        )
                      }
                    </option>
                  )
                }

                return arr
              }
            )()
          }
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
        <Label text='Closes At:' />

        <select
          onChange={
            (event) => setClosedAt(
              Number(event.target.value ?? 0)
            )
          }
        >
          {
            (
              () => {
                const arr: React.ReactNode[] = []

                for (let i = 0; i < 24; i++) {
                  arr.push(
                    <option
                      value={i + 1}
                    >
                      {
                        i === 0 ? '12 AM' : (
                          i === 12 ? '12 PM' : (
                            i < 12 ? `${i} AM` : `${i - 12} PM`
                          )
                        )
                      }
                    </option>
                  )
                }

                return arr
              }
            )()
          }
        </select>
      </div>

      <div
        style={{ display: 'flex', flexDirection: 'row' }}
      >
        <Button
          text={{ content: 'Save', reverse: true }}
          icon={faSave}
          inverted={
            { color: Constants.Colors.Text.green }
          }
          onPress={save}
        />
      </div>
    </div>
  ) : null
}

export default Settings