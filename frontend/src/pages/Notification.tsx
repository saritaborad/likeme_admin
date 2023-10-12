import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {deleteNotificationyById, fetchNotificationData, sendNotification, updateNotification} from '../ApiService/_requests'
import {Modal} from 'react-bootstrap'
import EditNotification from '../Modals/EditNotification'
import {Formik} from 'formik'
import * as Yup from 'yup'
import {errorContainer, formAttr} from '../commonFun'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'

const Notification: React.FC = () => {
  const [notification, setNotification] = useState<any>([])
  const [notificationData, setNotificationData] = useState()
  const [show, setShow] = useState(false)
  const [update, setUpdate] = useState(false)

  const [option, set_option] = useState({sizePerPage: 10, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'ASC'})

  const columns = [
    {
      value: 'title',
      label: 'Title',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.title}</div>
        },
      },
    },
    {
      value: 'description',
      label: 'Description',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.description}</div>
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
              <button
                className='btn-comn-submit me-2'
                onClick={() => {
                  setNotificationData(data[i])
                  setShow(true)
                }}
              >
                Edit
              </button>
              <button className='btn-comn-danger me-2' onClick={() => deleteNotification(data[i]?._id)}>
                Delete
              </button>
            </div>
          )
        },
      },
    },
  ]

  useEffect(() => {
    fetchNotification(option)
  }, [])

  const deleteNotification = async (_id: string) => {
    const {data} = await deleteNotificationyById(_id)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    fetchNotification(option)
  }

  const fetchNotification = async (option?: any) => {
    const {data} = await fetchNotificationData({options: option})
    setNotification(data.data)
    set_option({...option, totalRecord: data.totalRecord})
  }

  const submitFormData = async (formData: any) => {
    const {data} = await updateNotification(formData)
    if (data.status === 200) {
      toast.success(data.message)
      setShow(false)
      fetchNotification(option)
    }
  }

  const submitNotiData = async (formData: any, resetForm: any) => {
    const {data} = await sendNotification(formData)
    if (data.status === 200) {
      resetForm(formData)
      toast.success(data.message)
      setShow(false)
      fetchNotification(option)
    }
  }

  const appModalClose = () => {
    setShow(false)
    setUpdate(false)
  }

  const tableCallBack = (option: any) => {
    set_option(option)
    fetchNotification(option)
  }

  const handleDrop = (updatedData: any) => {
    setNotification(updatedData)
    // Call your API to update data here
  }

  return (
    <>
      <div className='container-fluid'>
        <div className='card-shadow'>
          <div className='card'>
            <div className='card-header d-flex align-items-center'>
              <h2>Send Notification</h2>
            </div>
            <div className='card-body'>
              <Formik
                enableReinitialize
                initialValues={{
                  title: '',
                  description: '',
                }}
                validationSchema={Yup.object({
                  title: Yup.string().required('required.'),
                  description: Yup.string().required('required.'),
                })}
                onSubmit={(formData, {resetForm}) => submitNotiData(formData, resetForm)}
              >
                {(runform) => (
                  <form onSubmit={runform.handleSubmit}>
                    <input type='hidden' name='_token' defaultValue='jG8ytNKkuJvpWiVCDSY8D8w9eTCfEyOqjVBeBddk' />
                    <div className='form-group'>
                      <label>Title</label>
                      <input type='text' name='title' id='title' className='form-control mt-2' {...formAttr(runform, 'title')} />
                      {errorContainer(runform, 'title')}
                    </div>
                    <div className='form-group mt-3'>
                      <label htmlFor='Description'>Description</label>
                      <textarea className='form-control mt-2' name='description' id='Description' {...formAttr(runform, 'description')} />
                      {errorContainer(runform, 'description')}
                    </div>
                    <button type='submit' className='btn-comn-submit mt-4'>
                      Send Notification
                    </button>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>

        <div className='col-12 mt-8 '>
          <div className='white-box-table  card-shadow'>
            <div className='row'>
              <div className='col-12 d-flex align-items-center my-4'>
                <div className=' '>
                  <h3>Notifications</h3>
                </div>
              </div>
            </div>
            <RtdDatatableNew data={notification} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
          </div>
        </div>

        <Modal show={show} onHide={() => appModalClose()} size='lg' className='cust-comn-modal' centered>
          <EditNotification notificationData={notificationData} submitFormData={submitFormData} appModalClose={appModalClose} />
        </Modal>
      </div>
    </>
  )
}

export default Notification
