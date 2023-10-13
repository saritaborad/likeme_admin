import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {getHostAgents} from '../ApiService/_requests'
import {ImgUrl} from '../const'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'
import {useAuth} from '../app/modules/auth'

const HostAgent = () => {
  const [hosts, setHosts] = useState<any>()
  const {currentUser} = useAuth()

  const [option, set_option] = useState({sizePerPage: 10, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'ASC'})

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
      label: 'Full Name',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.fullName}</div>
        },
      },
    },

    {
      value: 'identity',
      label: 'Identity',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.identity}</div>
        },
      },
    },
    {
      value: 'is_block',
      label: 'Status',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div className={`${data[i]?.is_block == 1 ? 'badge badge-danger' : 'badge badge-success'}`}>{data[i]?.is_block == 1 ? 'Blocked' : 'Allowed'}</div>
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
            </div>
          )
        },
      },
    },
  ]

  useEffect(() => {
    getHostAgent(option)
  }, [])

  const getHostAgent = async (option?: any) => {
    const {data} = await getHostAgents({options: option, _id: currentUser?.user})
    setHosts(data)
    set_option({...option, totalRecord: data.totalRecord})
  }

  const tableCallBack = (option: any) => {
    set_option(option)
    getHostAgent(option)
  }

  return (
    <div className='container-fluid'>
      <div className='col-12 '>
        <div className='white-box-table  card-shadow'>
          <div className='row'>
            <div className='col-12 d-flex align-items-center mt-7 mb-4'>
              <h1>Hosts</h1>

              <div className='ms-auto mb-2 me-4'>
                <div className='me-2 px-12 py-1 fw-bold' style={{borderRadius: '25px', backgroundColor: '#ffa426'}}>
                  Total Payout - {hosts?.subtotal}
                </div>
              </div>
            </div>
          </div>
          <button className='btn-comn-submit mb-6 py-3'>Real Hosts</button>
          <RtdDatatableNew data={hosts?.agentHost} columns={columns} option={option} tableCallBack={tableCallBack} />
        </div>
      </div>
    </div>
  )
}

export default HostAgent
