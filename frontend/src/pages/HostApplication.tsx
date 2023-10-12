import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {toast} from 'react-toastify'
import {RejectHost, fetchHostApplications, makeHost} from '../ApiService/_requests'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'

interface IState {
  fullname?: string
  profileimages?: string
  identity?: string
  is_fake?: number
}

const HostApplication: React.FC = () => {
  const [hostApp, setHostApp] = useState<IState[]>([])

  const [option, set_option] = useState({sizePerPage: 3, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'ASC'})

  const columns = [
    {
      value: 'profileimages',
      label: 'Profile Image',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <img src={`http://localhost:5000/${data[i]?.profileimages}`} className='profile-img' alt='' />
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
      value: 'age',
      label: 'Age',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.age}</div>
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
            <div>
              <Link className='btn-comn-info me-2' to='/viewHost' state={{hostData: data[i], show: true}}>
                View
              </Link>
              <button className='btn-comn-submit me-2' onClick={() => makeHostById(data[i]?._id)}>
                Make Host
              </button>
              <button className='btn-comn-danger me-2' onClick={() => RejectHostApp(data[i]?._id)}>
                Reject
              </button>
            </div>
          )
        },
      },
    },
  ]

  useEffect(() => {
    getAllHostApp(option)
  }, [])

  const makeHostById = async (_id: string) => {
    const {data} = await makeHost(_id)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    getAllHostApp(option)
  }

  const getAllHostApp = async (option?: any) => {
    const {data} = await fetchHostApplications({options: option})
    setHostApp(data.hostApp)
  }

  const RejectHostApp = async (_id: string) => {
    const {data} = await RejectHost(_id)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    getAllHostApp(option)
  }

  const tableCallBack = (option: any) => {
    set_option(option)
    getAllHostApp(option)
  }

  const handleDrop = (updatedData: any) => {
    setHostApp(updatedData)
    // Call your API to update data here
  }

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12 d-flex'>
            <div className='mb-3'>
              <h1>Host Applications</h1>
            </div>
          </div>
        </div>
        <div className='col-12'>
          <div className='white-box-table  card-shadow'>
            <RtdDatatableNew data={hostApp} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
          </div>
        </div>
      </div>
    </>
  )
}

export default HostApplication
