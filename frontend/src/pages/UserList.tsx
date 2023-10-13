import {useEffect, useState} from 'react'
import {getAllUser, userblock, AddUserCoin} from '../ApiService/_requests'
import {toast} from 'react-toastify'
import {ImgUrl} from '../const'
import {Modal} from 'react-bootstrap'
import AddCoin from '../Modals/AddCoin'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'
import {useAuth} from '../app/modules/auth'

interface IState {
  fullname?: string
  profileimages?: string
  identity?: string
  is_fake?: number
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<IState[]>([])
  const [show, setShow] = useState(false)
  const [id, setId] = useState('')
  const [option, set_option] = useState({sizePerPage: 10, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'ASC'})
  const {currentUser} = useAuth()

  const columns = [
    {
      value: 'profileimages',
      label: 'Profile Image',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <img src={data[i]?.profileimages ? `${ImgUrl + data[i]?.profileimages}` : `${ImgUrl + data[i]?.images?.image}`} className='profile-img' alt='' />
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
      value: 'diamond',
      label: 'Coin',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.diamond}</div>
        },
      },
    },
    {
      value: 'is_fake',
      label: 'User Type',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div className={`${data[i]?.is_fake == 1 ? 'badge badge-danger' : 'badge badge-success'}`}>{data[i]?.is_fake == 1 ? 'Fake' : 'Original'}</div>
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
            !currentUser?.is_tester && (
              <div className='d-flex '>
                <button
                  className='btn btn-dark me-2'
                  onClick={() => {
                    setShow(true)
                    setId(data[i]?._id)
                  }}
                >
                  Add Coin
                </button>

                <div style={{marginLeft: '5px'}}>
                  <button className={`${data[i]?.is_block === 1 ? 'btn-comn-danger' : 'btn-comn-submit'}`} onClick={() => handleBlock(data[i]?._id, data[i]?.is_block)}>
                    {data[i]?.is_block === 1 ? 'Unblock' : 'Block'}
                  </button>
                </div>
              </div>
            )
          )
        },
      },
    },
  ]

  useEffect(() => {
    getAllUserData(option)
  }, [])

  const getAllUserData = async (option?: any) => {
    const {data} = await getAllUser({options: option})
    setUsers(data.users)
    set_option({...option, totalRecord: data.totalRecord})
  }

  const handleBlock = async (id: string, is_block: number) => {
    const {data} = await userblock(id, is_block == 1 ? 0 : 1)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    getAllUserData(option)
  }

  const submitFormData = async (formData: any) => {
    const {data} = await AddUserCoin({...formData, _id: id})

    if (data.status === 200) {
      toast.success(data.message)
      setShow(false)
      getAllUserData(option)
    }
  }

  const tableCallBack = (option: any) => {
    set_option(option)
    getAllUserData(option)
  }

  const handleDrop = (updatedData: any) => {
    setUsers(updatedData)
    // Call your API to update data here
  }

  const appModalClose = () => setShow(false)

  return (
    <div className='container-fluid'>
      <div className='col-12 '>
        <div className='white-box-table  card-shadow'>
          <div className='row'>
            <div className='col-12 d-flex align-items-center my-3'>
              <div className='comn-inr-title '>
                <h1>User List</h1>
              </div>
            </div>
          </div>
          <RtdDatatableNew data={users} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
        </div>
      </div>

      <Modal show={show} onHide={() => appModalClose()} size='lg' className='cust-comn-modal' centered>
        <AddCoin submitFormData={submitFormData} appModalClose={appModalClose} />
      </Modal>
    </div>
  )
}

export default UserList
