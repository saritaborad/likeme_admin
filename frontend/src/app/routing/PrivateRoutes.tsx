import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'
import UserList from '../../pages/UserList'
import HostList from '../../pages/HostList'
import AgentList from '../../pages/AgentList'
import HostApplication from '../../pages/HostApplication'
import PrivacyPolicy from '../../pages/PrivacyPolicy'
import Setting from '../../pages/Setting'
import ReportReason from '../../pages/ReportReason'
import FakeMessage from '../../pages/FakeMessage'
import NotificationContent from '../../pages/NotificationContent'
import NotificationCredential from '../../pages/NotificationCredential'
import PaymentGateway from '../../pages/PaymentGateway'
import Country from '../../pages/Country'
import Gift from '../../pages/Gift'
import CoinPlan from '../../pages/CoinPlan'
import Notification from '../../pages/Notification'
import Report from '../../pages/Report'
import UserPurchase from '../../pages/UserPurchase'
import RedeemRequest from '../../pages/RedeemRequest'
import AddFakeUser from '../../pages/AddFakeUser'
import ViewHost from '../../pages/ViewHost'
import AgentHost from '../../pages/AgentHost'
import TermsCondition from '../../pages/TermsCondition'
import ReviewImage from '../../pages/ReviewImage'
import ReviewVideo from '../../pages/ReviewVideo'
import HostSummary from '../../pages/HostSummary'
import StreamHistory from '../../pages/StreamHistory'
import HostHistory from '../../pages/HostHistory'
import SpendHistory from '../../pages/SpendHistory'
import TopPurchase from '../../pages/TopPurchase'
import Dashboard from '../../pages/Dashboard'
import HostAgent from '../../pages/HostAgent'

const PrivateRoutes = () => {
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'))

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='users' element={<UserList />} />
        <Route path='hosts' element={<HostList />} />
        <Route path='agents' element={<AgentList />} />
        <Route path='hostapps' element={<HostApplication />} />
        <Route path='redeemRequest' element={<RedeemRequest />} />
        <Route path='userPurchase' element={<UserPurchase />} />
        <Route path='notification' element={<Notification />} />
        <Route path='reports' element={<Report />} />
        <Route path='subscription' element={<CoinPlan />} />
        <Route path='gifts' element={<Gift />} />
        <Route path='country' element={<Country />} />
        <Route path='paymentgateway' element={<PaymentGateway />} />
        <Route path='notiCredential' element={<NotificationCredential />} />
        <Route path='notificationContent' element={<NotificationContent />} />
        <Route path='message' element={<FakeMessage />} />
        <Route path='reportReson' element={<ReportReason />} />
        <Route path='setting' element={<Setting />} />
        <Route path='privacy' element={<PrivacyPolicy />} />
        <Route path='terms' element={<TermsCondition />} />
        <Route path='addFakeUser' element={<AddFakeUser />} />
        <Route path='viewHost' element={<ViewHost />} />
        <Route path='agentHost' element={<AgentHost />} />
        <Route path='hostSummary' element={<HostSummary />} />
        <Route path='streamHistory' element={<StreamHistory />} />
        <Route path='hostHistory' element={<HostHistory />} />
        <Route path='spendHistory' element={<SpendHistory />} />
        <Route path='reviewImage' element={<ReviewImage />} />
        <Route path='reviewVideo' element={<ReviewVideo />} />
        <Route path='topPurchaser' element={<TopPurchase />} />
        <Route path='hostAgent' element={<HostAgent />} />

        <Route path='builder' element={<BuilderPageWrapper />} />
        <Route path='menu-test' element={<MenuTestPage />} />
        {/* Lazy Modules */}
        <Route
          path='crafted/pages/profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/chat/*'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/user-management/*'
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--kt-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
