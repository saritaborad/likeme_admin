/* eslint-disable react/jsx-no-target-blank */
import {useIntl} from 'react-intl'
import {SidebarMenuItem} from './SidebarMenuItem'
import {useAuth} from '../../../../../app/modules/auth'

const SidebarMenuMain = () => {
  const intl = useIntl()
  const {currentUser} = useAuth()

  return (
    <>
      {currentUser?.is_agent ? (
        <>
          <SidebarMenuItem to='/dashboard' icon='fas  fa-users' title='Dashboard' fontIcon='bi-layers' />
          <SidebarMenuItem to='/hostAgent' icon='fas  fa-users' title='Host List' fontIcon='bi-layers' />
        </>
      ) : (
        <>
          <SidebarMenuItem to='/dashboard' icon='fas  fa-tachometer-alt' title='Dashboard' fontIcon='bi-layers' />
          <SidebarMenuItem to='/reviewImage' icon='fas fa-user-shield' title='Review Images' fontIcon='bi-layers' />
          <SidebarMenuItem to='/reviewVideo' icon='fas fa-user-shield' title='Review Videos' fontIcon='bi-layers' />
          <SidebarMenuItem to='/users' icon='fas fa-headset' title='Users' fontIcon='bi-layers' />
          <SidebarMenuItem to='/hosts' icon='fas fa-shield-alt' title='Host List' fontIcon='bi-layers' />
          <SidebarMenuItem to='/agents' icon='fas  fa-user-secret' title='Agents' fontIcon='bi-layers' />
          <SidebarMenuItem to='/hostapps' icon='fas fa-user-shield' title='Host Applications' fontIcon='bi-layers' />
          <SidebarMenuItem to='/redeemRequest' icon='fas fa-money-bill-wave' title='Redeem Request' fontIcon='bi-layers' />
          <SidebarMenuItem to='/userPurchase' icon='fas fa-coins' title='User Purchase' fontIcon='bi-layers' />
          <SidebarMenuItem to='/notification' icon='fas fa-bell' title='Notifications' fontIcon='bi-layers' />
          <SidebarMenuItem to='/reports' icon='fas fa-user-lock' title='Reports' fontIcon='bi-layers' />
          <SidebarMenuItem to='/subscription' icon='fas fa-box' title='Coin Plans' fontIcon='bi-layers' />
          <SidebarMenuItem to='/gifts' icon='fas fa-gifts' title='Gifts' fontIcon='bi-layers' />
          <SidebarMenuItem to='/country' icon='fas fa-globe-asia' title='Country List' fontIcon='bi-layers' />
          <SidebarMenuItem to='/paymentgateway' icon='fas fa-credit-card' title='Payment Gateway' fontIcon='bi-layers' />
          <SidebarMenuItem to='/notiCredential' icon='fas fa-bell' title='Notification credentials' fontIcon='bi-layers' />
          <SidebarMenuItem to='/notificationContent' icon='fas fa-bell' title='Notification Content' fontIcon='bi-layers' />
          <SidebarMenuItem to='/message' icon='fa-solid fa-message' title='Fake Chat Message' fontIcon='bi-layers' />
          <SidebarMenuItem to='/reportReson' icon='fa-solid fa-user-clock' title='Report Reason' fontIcon='bi-layers' />
          <SidebarMenuItem to='/setting' icon='fas fa-cog' title='Setting' fontIcon='bi-layers' />
          <SidebarMenuItem to='/privacy' icon='fas fa-user-secret' title='Privacy Policy' fontIcon='bi-layers' />
          <SidebarMenuItem to='/terms' icon='fas fa-user-secret' title='Terms & Conditions' fontIcon='bi-layers' />
        </>
      )}
    </>
  )
}

export {SidebarMenuMain}
