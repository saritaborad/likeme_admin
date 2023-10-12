import React, {useState, useEffect} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {getAgentHosts} from '../ApiService/_requests'
import {ImgUrl} from '../const'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'

const AgentHost = () => {
  const {state}: any = useLocation()
  const [hosts, setHosts] = useState<any>()
  const [agentInfo, setAgentInfo] = useState<any>()

  const [option, set_option] = useState({
    page: 1,
    sort: 'createdAt',
    order: 'ASC',
    checkbox: false,
  })

  const columns = [
    {
      value: 'profileimages',
      label: 'Profile',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <img src={`${ImgUrl + data[i]?.profileimages}`} className='profile-img' alt='' />
        },
      },
    },
    {
      value: 'fullName',
      label: 'Host Name',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.fullName}</div>
        },
      },
    },
    {
      value: 'version',
      label: 'Version',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.version}</div>
        },
      },
    },
    {
      value: 'identity',
      label: 'Identity',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.identity}</div>
        },
      },
    },
    {
      value: 'diamond',
      label: 'Pending',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.diamond}</div>
        },
      },
    },
    {
      value: 'count',
      label: 'Count',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.count}</div>
        },
      },
    },
    {
      value: 'total_time',
      label: 'Time',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return (
            <div>
              {Math.floor(data[i]?.total_time / 60)} : {data[i]?.total_time % 60}
            </div>
          )
        },
      },
    },
    {
      value: 'action',
      label: 'View History',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return (
            <div>
              <Link className='btn-comn-warning me-2' to='/hostSummary' state={{hostInfo: data[i]}}>
                Summary
              </Link>
              <Link className='btn-comn-warning me-2' to='/hostHistory' state={{hostInfo: data[i]}}>
                Diamond
              </Link>
              <Link className='btn-comn-warning me-2' to='/streamHistory' state={{hostInfo: data[i]}}>
                Stream
              </Link>
            </div>
          )
        },
      },
    },
  ]

  useEffect(() => {
    setAgentInfo(state?.agentInfo)
    getAgentHost()
  }, [])

  const getAgentHost = async () => {
    const {data} = await getAgentHosts(state?.agentInfo?._id)
    setHosts(data)
  }

  const tableCallBack = (option: any) => {
    set_option(option)
  }

  return (
    <div className='container-fluid'>
      <div className='col-12 '>
        <div className='white-box-table  card-shadow'>
          <div className='row'>
            <div className='col-12 d-flex align-items-center mt-7 mb-10'>
              <img src={ImgUrl + agentInfo?.images} alt='' className='profile-img me-3' />

              <h3>
                <i> {agentInfo?.name}</i> - Agent host list
              </h3>

              <div className='ms-auto mb-2 me-4'>
                <div className='me-2 px-12 py-1 fw-bold' style={{borderRadius: '25px', backgroundColor: '#ffa426'}}>
                  Total Payout - {hosts?.subtotal}
                </div>
              </div>
            </div>
          </div>
          <button className='btn-comn-submit mb-6 py-3'>Pending Payments</button>
          <RtdDatatableNew data={hosts?.agentHost} columns={columns} option={option} tableCallBack={tableCallBack} />
        </div>
      </div>
    </div>
  )
}

export default AgentHost
