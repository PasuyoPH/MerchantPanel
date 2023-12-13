import DashboardApp from './pages/dashboard/App'
import './index.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Sidebar from '../components/Nav/Sidebar'
import Auth from './pages/login/auth'
import { useState, useEffect } from 'react'
import { PageProps } from '../types'
import { EventEmitter } from 'events'
import EditItem from './pages/dashboard/EditItem'
import Settings from './pages/dashboard/Settings'
import NewAddress from './pages/dashboard/NewAddress'
import Addresses from './pages/dashboard/Addresses'
import AddItem from './pages/dashboard/Items'

const events = new EventEmitter()

const MainComponent = () => {
  const [data, setData] = useState<PageProps>(
      { events }
    ),
    [loaded, setHasLoaded] = useState(false)

  useEffect(
    () => {
      const token = localStorage.getItem('token')
      if (token)
        setData(
          (latest) => ({ ...latest, token })
        )

      setHasLoaded(true)

      events.on(
        'token',
        (token: string) => {
          if (token)
            localStorage.setItem('token', token)
          else localStorage.removeItem('token')
          
          location.href = token ?
            '/merchant/dashboard' :
            '/merchant/auth'

          setData(
            (latest) => ({ ...latest, token })
          )
        }
      )

      return () => {
        events.removeAllListeners()
      }
    },
    []
  )

  const router = createBrowserRouter(
    [  
      {
        path: '/merchant/',
        element: <Navigate to='/merchant/auth' />
      },
      {
        path: '/merchant/dashboard',
        element: <Sidebar />,
        children: [
          {
            path: '',
            element: <Navigate to='/merchant/dashboard/app' />
          },
          
          {
            path: 'app',
            element: <DashboardApp
              {...data}
            />
          },
  
          {
            path: 'items',
            element: <AddItem
              {...data}
            />
          },
          
          {
            path: 'items/:itemId',
            element: <EditItem
              {...data}
            />
          },

          {
            path: 'settings',
            element: <Settings
              {...data}
            />
          },
  
          {
            path: 'address',
            element: <Addresses
              {...data}
            />
          },
  
          {
            path: 'address/new',
            element: <NewAddress
              {...data}
            />
          }
        ]
      },
      {
        path: '/merchant/auth',
        element: <Auth
          {...data}
        />
      }
    ]
  )
  
  return loaded ? (
    <RouterProvider
      router={router}
    />
  ) : null
}

export default MainComponent