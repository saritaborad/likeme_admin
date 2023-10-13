import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {fetchAgentDashboard, fetchDashboardCount} from '../ApiService/_requests'
import {useAuth} from '../app/modules/auth'

const Dashboard = () => {
  const [allCount, setCount] = useState<any>()
  const {currentUser} = useAuth()

  useEffect(() => {
    getDashboardCount()
  }, [])

  const getDashboardCount = async () => {
    const {data} = currentUser?.is_agent ? await fetchAgentDashboard(currentUser?.user) : await fetchDashboardCount()
    setCount(data)
  }

  const arr = [
    {name: 'Users', count: allCount?.users, logo: 'fas fa-users', link: '/users', state: {}},
    {name: 'Host', count: allCount?.hosts, logo: 'fas fa-shield-alt', link: '/hosts', state: {}},
    {name: 'Blocked Host', count: allCount?.blockHost, logo: 'fas fa-user-lock', link: '/hosts', state: {is_block: 1}},
    {name: 'Host Applications', count: allCount?.hostApps, logo: 'fas fa-user-shield', link: '/hostapps', state: {}},
    {name: 'Reports', count: allCount?.reports, logo: 'fas fa-clipboard-list', link: '/reports', state: {}},
    {name: 'Countries', count: allCount?.countries, logo: 'fas fa-globe-asia', link: '/country', state: {}},
    {name: 'Payment Gateway', count: allCount?.gatway, logo: 'fas fa-credit-card', link: '/paymentgateway', state: {}},
    {name: 'Gifts', count: allCount?.gifts, logo: 'fas fa-gifts', link: '/gifts', state: {}},
    {name: 'Coin Plans', count: allCount?.coinPlans, logo: 'fas fa-box', link: '/subscription', state: {}},
    {name: 'Redeem Requests', count: allCount?.redeem, logo: 'fas fa-shield-alt', link: '/redeemRequest', state: {}},
    {name: 'Fake Messages', count: allCount?.fakeMsg, logo: 'fa-solid fa-message', link: '/message', state: {}},
  ]

  return (
    <div className='container-fluid'>
      <div className='row '>
        <div className='col-12'>
          <ul className='row  dash-box-main gap-6'>
            {arr.map((item, i) => (
              <>
                {currentUser?.is_agent ? (
                  (item?.name == 'Host' || item?.name == 'Host Applications') && (
                    <li className='fix-col mb-3 mb-xxl-0' key={i}>
                      <div className='white-bx-info'>
                        <div className='align-items-center justify-content-between'>
                          <div className='row align-items-center'>
                            <div className='col-lg-7 col-md-7 col-sm-7 col-xs-7'>
                              <div className='card-content'>
                                <h3 className='fs-3'>{item?.name}</h3>
                                <h3 className='mb-3'>{item?.count}</h3>
                                {/* <Link to={item?.link} state={item.state} className='badge badge-dark text-light text-capitalize bg-dark'>
                                  View
                                </Link> */}
                              </div>
                            </div>
                            <div className='col-lg-5 col-md-5 col-sm-5 col-xs-5'>
                              <div className='d-flex justify-content-center'>
                                <div className='way_icon'>
                                  <div className='card-icon2 mainbg d-flex align-items-center justify-content-center'>
                                    <i className={item?.logo} style={{color: 'black'}} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                ) : (
                  <li className='fix-col mb-3 mb-xxl-0' key={i}>
                    <div className='white-bx-info'>
                      <div className='align-items-center justify-content-between'>
                        <div className='row align-items-center'>
                          <div className='col-lg-7 col-md-7 col-sm-7 col-xs-7'>
                            <div className='card-content'>
                              <h3 className='fs-3'>{item?.name}</h3>
                              <h3 className='mb-3'>{item?.count}</h3>
                              <Link to={item?.link} state={item.state} className='badge badge-dark text-light text-capitalize bg-dark'>
                                View
                              </Link>
                            </div>
                          </div>
                          <div className='col-lg-5 col-md-5 col-sm-5 col-xs-5'>
                            <div className='d-flex justify-content-center'>
                              <div className='way_icon'>
                                <div className='card-icon2 mainbg d-flex align-items-center justify-content-center'>
                                  <i className={item?.logo} style={{color: 'black'}} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )}
              </>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
