/* eslint-disable react/jsx-no-target-blank */
import {useIntl} from 'react-intl'
import {SidebarMenuItem} from './SidebarMenuItem'
import {useAuth} from '../../../../../app/modules/auth'

const SidebarMenuMain = () => {
  const intl = useIntl()
  const {currentUser, agent} = useAuth()

  return (
    <>
      {/* <SidebarMenuItem to='/dashboard' icon='/media/icons/duotune/art/art002.svg' title={intl.formatMessage({id: 'MENU.DASHBOARD'})} fontIcon='bi-app-indicator' /> */}
      {/* <SidebarMenuItem to='/builder' icon='/media/icons/duotune/general/gen019.svg' title='Layout Builder' fontIcon='bi-layers' /> */}
      {/* <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Crafted</span>
        </div>
      </div> */}
      {/* <SidebarMenuItemWithSub to='/crafted/pages' title='Pages' fontIcon='bi-archive' icon='/media/icons/duotune/general/gen022.svg'>
        <SidebarMenuItemWithSub to='/crafted/pages/profile' title='Profile' hasBullet={true}>
          <SidebarMenuItem to='/crafted/pages/profile/overview' title='Overview' hasBullet={true} />
          <SidebarMenuItem to='/crafted/pages/profile/projects' title='Projects' hasBullet={true} />
          <SidebarMenuItem to='/crafted/pages/profile/campaigns' title='Campaigns' hasBullet={true} />
          <SidebarMenuItem to='/crafted/pages/profile/documents' title='Documents' hasBullet={true} />
          <SidebarMenuItem to='/crafted/pages/profile/connections' title='Connections' hasBullet={true} />
        </SidebarMenuItemWithSub>

        <SidebarMenuItemWithSub to='/crafted/pages/wizards' title='Wizards' hasBullet={true}>
          <SidebarMenuItem to='/crafted/pages/wizards/horizontal' title='Horizontal' hasBullet={true} />
          <SidebarMenuItem to='/crafted/pages/wizards/vertical' title='Vertical' hasBullet={true} />
        </SidebarMenuItemWithSub>
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub to='/crafted/accounts' title='Accounts' icon='/media/icons/duotune/communication/com006.svg' fontIcon='bi-person'>
        <SidebarMenuItem to='/crafted/account/overview' title='Overview' hasBullet={true} />
        <SidebarMenuItem to='/crafted/account/settings' title='Settings' hasBullet={true} />
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub to='/error' title='Errors' fontIcon='bi-sticky' icon='/media/icons/duotune/general/gen040.svg'>
        <SidebarMenuItem to='/error/404' title='Error 404' hasBullet={true} />
        <SidebarMenuItem to='/error/500' title='Error 500' hasBullet={true} />
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub to='/crafted/widgets' title='Widgets' icon='/media/icons/duotune/general/gen025.svg' fontIcon='bi-layers'>
        <SidebarMenuItem to='/crafted/widgets/lists' title='Lists' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/statistics' title='Statistics' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/charts' title='Charts' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/mixed' title='Mixed' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/tables' title='Tables' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/feeds' title='Feeds' hasBullet={true} />
      </SidebarMenuItemWithSub> */}
      {/* <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Apps</span>
        </div>
      </div> */}
      {/* <SidebarMenuItemWithSub to='/apps/chat' title='Chat' fontIcon='bi-chat-left' icon='/media/icons/duotune/communication/com012.svg'>
        <SidebarMenuItem to='/apps/chat/private-chat' title='Private Chat' hasBullet={true} />
        <SidebarMenuItem to='/apps/chat/group-chat' title='Group Chart' hasBullet={true} />
        <SidebarMenuItem to='/apps/chat/drawer-chat' title='Drawer Chart' hasBullet={true} />
      </SidebarMenuItemWithSub> */}

      {currentUser?.is_agent ? (
        <>
          <SidebarMenuItem to='/dashboard' icon='/media/icons/duotune/general/gen051.svg' title='Dashboard' fontIcon='bi-layers' />
          <SidebarMenuItem to='/agentHost' state={agent} icon='/media/icons/duotune/general/gen051.svg' title='Host List' fontIcon='bi-layers' />
        </>
      ) : (
        <>
          <SidebarMenuItem to='/dashboard' icon='/media/icons/duotune/general/gen051.svg' title='Dashboard' fontIcon='bi-layers' />
          <SidebarMenuItem to='/reviewImage' icon='/media/icons/duotune/general/gen051.svg' title='Review Images' fontIcon='bi-layers' />
          <SidebarMenuItem to='/reviewVideo' icon='/media/icons/duotune/general/gen051.svg' title='Review Videos' fontIcon='bi-layers' />
          <SidebarMenuItem to='/users' icon='/media/icons/duotune/general/gen051.svg' title='Users' fontIcon='bi-layers' />
          <SidebarMenuItem to='/hosts' icon='/media/icons/duotune/general/gen051.svg' title='Host List' fontIcon='bi-layers' />
          <SidebarMenuItem to='/agents' icon='/media/icons/duotune/general/gen051.svg' title='Agents' fontIcon='bi-layers' />
          <SidebarMenuItem to='/hostapps' icon='/media/icons/duotune/general/gen051.svg' title='Host Applications' fontIcon='bi-layers' />
          <SidebarMenuItem to='/redeemRequest' icon='/media/icons/duotune/general/gen051.svg' title='Redeem Request' fontIcon='bi-layers' />
          <SidebarMenuItem to='/userPurchase' icon='/media/icons/duotune/general/gen051.svg' title='User Purchase' fontIcon='bi-layers' />
          <SidebarMenuItem to='/notification' icon='/media/icons/duotune/general/gen051.svg' title='Notifications' fontIcon='bi-layers' />
          <SidebarMenuItem to='/reports' icon='/media/icons/duotune/general/gen051.svg' title='Reports' fontIcon='bi-layers' />
          <SidebarMenuItem to='/subscription' icon='/media/icons/duotune/general/gen051.svg' title='Coin Plans' fontIcon='bi-layers' />
          <SidebarMenuItem to='/gifts' icon='/media/icons/duotune/general/gen051.svg' title='Gifts' fontIcon='bi-layers' />
          <SidebarMenuItem to='/country' icon='/media/icons/duotune/general/gen051.svg' title='Country List' fontIcon='bi-layers' />
          <SidebarMenuItem to='/paymentgateway' icon='/media/icons/duotune/general/gen051.svg' title='Payment Gateway' fontIcon='bi-layers' />
          <SidebarMenuItem to='/notiCredential' icon='/media/icons/duotune/general/gen051.svg' title='Notification credentials' fontIcon='bi-layers' />
          <SidebarMenuItem to='/notificationContent' icon='/media/icons/duotune/general/gen051.svg' title='Notification Content' fontIcon='bi-layers' />
          <SidebarMenuItem to='/message' icon='/media/icons/duotune/general/gen051.svg' title='Fake Chat Message' fontIcon='bi-layers' />
          <SidebarMenuItem to='/reportReson' icon='/media/icons/duotune/general/gen051.svg' title='Report Reason' fontIcon='bi-layers' />
          <SidebarMenuItem to='/setting' icon='/media/icons/duotune/general/gen051.svg' title='Setting' fontIcon='bi-layers' />
          <SidebarMenuItem to='/privacy' icon='/media/icons/duotune/general/gen051.svg' title='Privacy Policy' fontIcon='bi-layers' />
          <SidebarMenuItem to='/terms' icon='/media/icons/duotune/general/gen051.svg' title='Terms & Conditions' fontIcon='bi-layers' />
        </>
      )}
    </>
  )
}

export {SidebarMenuMain}
