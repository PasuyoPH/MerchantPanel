import { Outlet } from 'react-router-dom'
import SidebarStyle from './Sidebar.module.css'
import { Constants } from 'app-types'
import Header from '../Text/Header'
import Label from '../Text/Label'

const Sidebar = () => {
  return (
    <div
      style={
        {
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          height: '100vh'
        }
      }
    >
      <div
        className={SidebarStyle.container}
        style={
          { backgroundColor: Constants.Colors.All.whiteSmoke }
        }
      >
        <div
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0px 64px'
            }
          }
        >
          <Header
            text='PASUYO'
          />
          
          <Label
            text='Merchant'
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
          <div
            className={SidebarStyle.item}
            onClick={
              () => location.href = '/merchant/dashboard'
            }
          >
            Home
          </div>
          <div
            className={SidebarStyle.item}
            onClick={
              () => location.href = '/merchant/dashboard/address'
            }
          >
            Addresses
          </div>
          <div
            className={SidebarStyle.item}
            onClick={
              () => location.href = '/merchant/dashboard/settings'
            }
          >
            Settings
          </div>
        </div>

        <div
          style={
            {
              display: 'flex',
              flexDirection: 'column'
            }
          }
        > 
          <div
            className={SidebarStyle.item}
            onClick={
              () => {
                localStorage.removeItem('token')
                location.href = '/merchant/auth'
              }
            }
          >
            <Label
              text='Logout'
              color={Constants.Colors.Text.danger}
            />
          </div>
        </div>
      </div>
      
      <div
        style={
          {
            flexGrow: 1,
            padding: 32,
            backgroundColor: Constants.Colors.All.whiteSmoke,
            overflow: 'auto'
          }
        }
      >
        <Outlet />
      </div>
    </div>
  )
}

export default Sidebar