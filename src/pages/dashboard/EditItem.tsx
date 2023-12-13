import { useParams } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { Http } from 'app-structs'
import { Constants, Items, Merchant } from 'app-types'
import Header from '../../../components/Text/Header'
import Label from '../../../components/Text/Label'
import { RestaurantFilter } from 'app-types/src/filters'
import Button from '../../../components/Display/Button'
import { faSave } from '@fortawesome/free-regular-svg-icons'
import { Buffer }from 'buffer'
import { PageProps } from '../../../types'

type ItemData = { item: Items.Item, merchant: Merchant.MerchantData }

const http = new Http.Client()

const EditItem = (props: PageProps) => {
  const { itemId } = useParams(),
    [data, setData] = useState<ItemData | null | undefined>(),

    // forms
    [name, setName] = useState<string>(),
    [price, setPrice] = useState<string>(),
    [banner, setBanner] = useState<string>(),
    [profile, setProfile] = useState<string>(),
    [types, setTypes] = useState<number[]>([]),
    [eta, setEta] = useState<number>(),
    [available, setAvailable] = useState<boolean>(),

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
      await http.request(
        {
          method: 'patch',
          url: Constants.Url.Routes.MERCHANT_ME_ITEM(data?.item.uid ?? ''),
          data: {
            name,
            price: Number(price),
            banner: bannerUrl,
            image: profileUrl,
            eta,
            available: available ?? false
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
      const fetchItem = async () => {
          const result = await http.request<ItemData>(
            {
              method: 'get',
              url: Constants.Url.Routes.ITEM(itemId ?? '')
            }
          )
          
          setName(result.value?.item.name)
          setPrice(result.value?.item.price.toFixed(2))
          setBanner(result.value?.item.banner)
          setProfile(result.value?.item.image)
          setEta(result.value?.item.eta ?? 0)
          setAvailable(result.value?.item.available)
          //setTypes(result.value?.item.types ?? [])

          setData(result.value)
        }

      fetchItem()
        .catch(console.error)
    },
    []
  )
  return data ? (
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
        text='Modify merchant item'
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
            gap: 12
          }
        }
      >
        <div>
          <input
            value={name}
            placeholder='Item Name'
            onChange={
              (event) => setName(event.target.value)
            }
          />
        </div>

        <div>
          <input
            value={price}
            placeholder='Price'
            onChange={
              (event) => {
                if (event.target.value.match(/[a-zA-Z]/g)) return
                                
                setPrice(event.target.value)
              }
            }
          />
        </div>

        <div>
          <Label
            text='Eta in minutes'
          />

          <input
            value={eta?.toString()}
            placeholder='ETA (in minutes)'
            onChange={
              (event) => {
                if (event.target.value.match(/[a-zA-Z]/g)) return
                                
                setEta(
                  isNaN(event.target.value as any) ?
                  0 :
                  Number(event.target.value)
                )
              }
            }
          />
        </div>

        <div>
          <Label
            text='Available'
          />

          <input
            checked={available}
            type='checkbox'
            onChange={
              (event) => setAvailable(event.target.checked)
            }
          />
        </div>
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

export default EditItem