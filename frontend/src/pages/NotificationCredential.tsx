import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {addNotiCredent, deleteNotiCredent, getNotiCredent, updateNotiCredent} from '../ApiService/_requests'
import {Modal} from 'react-bootstrap'
import NotiCredent from '../Modals/NotiCredent'
import moment from 'moment'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'

interface IState {
  fullname?: string
  profileimages?: string
  identity?: string
  is_fake?: number
}

const NotificationCredential: React.FC = () => {
  const [notiCredList, setNotiCredList] = useState<IState[]>([])
  const [modalStates, setModalStates] = useState({update: false, show: false, notiInfo: ''})

  const [option, set_option] = useState({sizePerPage: 10, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'ASC'})

  const columns = [
    {
      value: 'package_name',
      label: 'Package Name',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.package_name}</div>
        },
      },
    },
    {
      value: 'fcm_key',
      label: 'Fcm Key',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          let fcm_key = data[i]?.fcm_key.substring(data[i]?.fcm_key?.length - 20)
          return <div>{fcm_key}</div>
        },
      },
    },
    {
      value: 'device_type',
      label: 'Device Type',
      options: {
        filter: false,
        sort: false,
        // search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.device_type == 1 ? 'android' : 'ios'}</div>
        },
      },
    },
    {
      value: 'createdAt',
      label: 'Date',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{moment(data[i]?.createdAt).format('DD-MM-YYYY hh:mm:ss')}</div>
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
              <button className='btn-comn-submit me-2' onClick={() => setModalStates({show: true, update: true, notiInfo: data[i]})}>
                Edit
              </button>
              <button className='btn-comn-danger me-2' onClick={() => deleteNotiCred(data[i]?._id)}>
                Delete
              </button>
            </div>
          )
        },
      },
    },
  ]

  useEffect(() => {
    getNotificationCred(option)
  }, [])

  const getNotificationCred = async (option?: any) => {
    const {data} = await getNotiCredent({options: option})
    setNotiCredList(data.data)
    setModalStates({update: false, show: false, notiInfo: ''})
    set_option({...option, totalRecord: data.totalRecord})
  }

  const submitFormData = async (formData: any) => {
    const {data} = await addNotiCredent(formData)
    if (data.status === 200) {
      toast.success(data.message)
      getNotificationCred(option)
    }
  }

  const updateNotiCred = async (formData: any) => {
    const {data} = await updateNotiCredent(formData)
    if (data.status === 200) {
      toast.success(data.message)
      getNotificationCred(option)
    }
  }

  const deleteNotiCred = async (_id: any) => {
    const {data} = await deleteNotiCredent(_id)
    data.status === 200 ? toast.success(data.message) : toast.error(data.message)
    getNotificationCred(option)
  }

  const tableCallBack = (option: any) => {
    set_option(option)
    getNotificationCred(option)
  }

  const handleDrop = (updatedData: any) => {
    setNotiCredList(updatedData)
    // Call your API to update data here
  }

  const appModalClose = () => setModalStates({update: false, show: false, notiInfo: ''})

  return (
    <>
      <div className='container-fluid'>
        <div className='col-12   mt-2'>
          {/* <div className='table-custom-info'>
            <div className='row'>
              <div className='col-12 d-flex  my-8'>
                <div className=''>
                  <h1>Notification Credentials</h1>
                </div>
                <div className='ms-auto'>
                  <button className='btn-comn-submit me-2' onClick={() => setModalStates({...modalStates, show: true})}>
                    Add Notification Credentials
                  </button>
                </div>
              </div>
            </div>
            <RtdDatatable data={notiCredList} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
          </div> */}

          <div className='white-box-table  card-shadow'>
            <div className='row'>
              <div className='col-12 d-flex align-items-center my-4'>
                <div className=' '>
                  <h1>Notification Credentials</h1>
                </div>
                <div className='ms-auto'>
                  <button className='btn-comn-submit me-2' onClick={() => setModalStates({...modalStates, show: true})}>
                    Add Notification Credentials
                  </button>
                </div>
              </div>
            </div>
            <RtdDatatableNew data={notiCredList} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
          </div>
        </div>

        <Modal show={modalStates.show} onHide={() => appModalClose()} size='lg' className='cust-comn-modal' centered>
          <NotiCredent update={modalStates.update} notiInfo={modalStates.notiInfo} submitFormData={submitFormData} updateNotiCred={updateNotiCred} appModalClose={appModalClose} />
        </Modal>
      </div>
    </>
  )
}

export default NotificationCredential
