import {useEffect, useState} from 'react'
import {completeRedeem, fetchAllRedeems, rejectRedeem} from '../ApiService/_requests'
import {useAllAgent} from '../hooks/customHook'
import moment from 'moment'
import {toast} from 'react-toastify'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'
import {useAuth} from '../app/modules/auth'
import Loader from '../Images/loader.gif'

const RedeemRequest: React.FC = () => {
  const [redeems, setRedeems] = useState([])
  const [selectedItem, setSelectedItem] = useState<any>({request_status: 0, agent_id: ''})
  const [option, set_option] = useState({sizePerPage: 10, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'ASC'})
  const [loader, setLoader] = useState(true)
  const agents: any = useAllAgent()
  const {currentUser} = useAuth()

  const columns = [
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
      value: 'package_name',
      label: 'Package Name',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.package_name}</div>
        },
      },
    },
    {
      value: 'stream_days',
      label: 'Stream Days',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.stream_days || 0}</div>
        },
      },
    },
    {
      value: 'stream_payable',
      label: 'Stream Payable',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.stream_payable || 0}</div>
        },
      },
    },
    {
      value: 'coin',
      label: 'Coin',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div className=''>{data[i]?.coin || 0}</div>
        },
      },
    },
    {
      value: 'coin_payable',
      label: 'Coin Payable',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div className=''>{data[i]?.coin_payable || 0}</div>
        },
      },
    },
    {
      value: 'final_amount',
      label: 'Final Amount',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div className=''>{data[i]?.final_amount || 0}</div>
        },
      },
    },

    {
      value: 'action',
      label: 'Action',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return (
            <div className=' '>
              {!currentUser?.is_tester && (
                <>
                  <button className='btn-comn-danger me-3' onClick={() => RejectRedeem(data[i]?._id)}>
                    Reject
                  </button>
                  <button className='btn-comn-submit' onClick={() => ApproveRedeem(data[i]?.amount_paid, data[i]?.request_status, data[i]?.completed_at)}>
                    Done
                  </button>
                </>
              )}
            </div>
          )
        },
      },
    },
  ]

  const columns1 = [
    {
      value: 'fullName',
      label: 'Host Name',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.user?.fullName}</div>
        },
      },
    },
    {
      value: 'stream_minits',
      label: 'Stream Minutes',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.stream_minits}</div>
        },
      },
    },

    {
      value: 'stream_payable',
      label: 'Stream Payable',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.stream_payable || 0}</div>
        },
      },
    },
    {
      value: 'diamond',
      label: 'Diamonds',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div className=''>{data[i]?.diamond || 0}</div>
        },
      },
    },
    {
      value: 'amount_paid',
      label: 'Diamonds Payable',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div className=''>{data[i]?.amount_paid || 0}</div>
        },
      },
    },
    {
      value: 'amount_paid',
      label: 'Payable Amount',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div className=''>{data[i]?.amount_paid || 0}</div>
        },
      },
    },
    {
      value: 'completed_at',
      label: 'Date',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div className=''>{moment(data[i]?.completed_at).format('DD-MMM-YYYY hh:mm:ss')}</div>
        },
      },
    },
  ]

  useEffect(() => {
    getAllRedeems(option, selectedItem)
  }, [])

  // 0 - pending 1 -completed 2 - rejected
  const getAllRedeems = async (option?: any, formData?: any) => {
    const {data} = await fetchAllRedeems({options: option, ...formData})
    setRedeems(data.data)
    set_option({...option, totalRecord: data.totalRecord})
    setLoader(false)
  }

  const ApproveRedeem = async (amount_paid: any, request_status: any, completed_at: any) => {
    const {data} = await completeRedeem({amount_paid, request_status, completed_at})
    data.status === 200 ? toast.success(data.message) : toast.error(data.message)
  }

  const RejectRedeem = async (_id: string) => {
    const {data} = await rejectRedeem(_id)
    data.status === 200 ? toast.success(data.message) : toast.error(data.message)
  }

  const handleFilter = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedItem({...selectedItem, [e.target.name]: e.target.value})
    getAllRedeems(option, {...selectedItem, [e.target.name]: e.target.value})
  }

  const tableCallBack = (option: any) => {
    set_option(option)
    getAllRedeems(option)
  }

  const handleDrop = (updatedData: any) => {
    setRedeems(updatedData)
    // Call your API to update data here
  }

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12 d-flex'>
            <div className='mb-3'>
              <h1>Redeem Request</h1>
            </div>
          </div>
        </div>
        <div className='col-12'>
          <div className='white-box-table'>
            <div className='row'>
              <div className='col-7 d-flex m-4'>
                <div className='col-2 d-flex p-2'>
                  <select className='form-control' name='request_status' onChange={handleFilter}>
                    <option value='0'>Pending Request</option>
                    <option value='1'>Completed Request</option>
                    <option value='2'>Rejected Request</option>
                  </select>
                </div>
                <div className='col-3 d-flex p-2'>
                  <select className='form-control' name='agent_id' onChange={handleFilter}>
                    {agents?.length > 0 &&
                      agents.map((item: any, i: number) => (
                        <option value={item._id} key={i}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            {loader ? (
              <div className='loader-info-main'>
                <img src={Loader} alt='loader' />
              </div>
            ) : (
              <RtdDatatableNew data={redeems} columns={selectedItem.request_status == 0 ? columns : columns1} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default RedeemRequest
