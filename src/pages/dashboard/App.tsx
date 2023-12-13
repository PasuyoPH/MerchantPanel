import StatsCard from '../../../components/Card/Stats'
import RecentTransactionsCard from '../../../components/Card/RecentTransactionsCard'
import ItemsCard from '../../../components/Card/ItemsCard'
import OrdersCard from '../../../components/Card/OrdersCard'

import { faDollarSign } from '@fortawesome/free-solid-svg-icons/faDollarSign'
import { faChartSimple } from '@fortawesome/free-solid-svg-icons/faChartSimple'
import { Constants } from 'app-types'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faMobilePhone } from '@fortawesome/free-solid-svg-icons/faMobilePhone'
import { faList } from '@fortawesome/free-solid-svg-icons/faList'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { PageProps } from '../../../types'
import { useEffect, useState } from 'react'
import { Http } from 'app-structs'

interface Stats {
  sales: number
  likes: number
  orders: number
}

const http = new Http.Client()

const DashboardApp = (props: PageProps) => {
  const [stats, setStats] = useState<Stats | null>(),
    [orders, setOrders] = useState<string[]>([]),
    [ws, setWs] = useState<WebSocket>()

  useEffect(
    () => {
      const init = async () => {
        const result = await http.request<Stats>(
          {
            method: 'get',
            url: Constants.Url.Routes.MERCHANT_ME_STATS,
            headers: {
              Authorization: props.token
            }
          }
        )

        setStats(result.value ?? null)
      }

      init()
        .catch(console.error)

      // create ws connection
      const connection = new WebSocket(Constants.Url.Gateway)
      connection.onopen = () => connection.send(
        JSON.stringify(
          {
            c: 0,
            d: {
              token: props.token,
              type: 2
            }
          }
        )
      )

      connection.onmessage = (message: MessageEvent) => {
        const content = message.data.toString()

        try {
          const packet = JSON.parse(content)

          switch (packet.c) {
            case 3: { // new orders
              setOrders(
                (latest) => ([...latest, packet.d.uid])
              )
            } break
          }
        } catch {}
      }

      setWs(connection)

      return () => {
        connection.close()
      }
    },
    []
  )

  return (
    <div
      style={
        {
          display: 'flex',
          flexDirection: 'column',
          gap: 32
        }
      }
    >
      <div
        style={
          {
            display: 'flex',
            flexDirection: 'row',
            gap: 16
          }
        }
      >
        <StatsCard
          value={stats?.sales ?? 0}
          label='Total Earnings'
          icon={
            {
              main: faDollarSign,
              secondary: faChartSimple
            }
          }
          color={Constants.Colors.Text.green}
        />

        <StatsCard
          value={stats?.orders ?? 0}
          label='Orders Made'
          icon={
            {
              main: faCheck,
              secondary: faList
            }
          }
          color={Constants.Colors.Text.blue}
        />

        <StatsCard
          value={stats?.likes ?? 0}
          label='Likes Accumulated'
          icon={
            {
              main: faHeart,
              secondary: faMobilePhone
            }
          }
          color={Constants.Colors.Text.danger}
        />
      </div>

      { /* Most recent trasnactions */  }
      <div
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            gap: 32
          }
        }
      >
        <OrdersCard 
          token={props.token ?? ''}
          others={orders}
        />
      
        {/*<RecentTransactionsCard
          token={props.token ?? ''}
      />*/}

        <ItemsCard
          token={props.token ?? ''}
        />
      </div>
    </div>
  )
}

export default DashboardApp