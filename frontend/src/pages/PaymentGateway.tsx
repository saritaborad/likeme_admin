import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {Modal} from 'react-bootstrap'
import {addPayment, deletePaymentById, fetchAllPayment, updatePayment} from '../ApiService/_requests'
import AddPaymentGateway from '../Modals/AddPaymentGateway'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'
import {useAuth} from '../app/modules/auth'
import Loader from '../Images/loader.gif'
import {DeleteConfirmModal} from '../Modals/DeleteConfirmModal'

const PaymentGateway: React.FC = () => {
  const [gatewayList, setGatewayList] = useState([])
  const [modalStates, setModalStates] = useState({update: false, show: false, rowVal: '', deleteConfirm: false})
  const [loader, setLoader] = useState(true)
  const [option, set_option] = useState({sizePerPage: 10, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'ASC'})
  const {currentUser} = useAuth()

  const columns = [
    {
      value: 'payment_getway',
      label: 'Payment Gateway',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.payment_getway}</div>
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
              {!currentUser?.is_tester && (
                <>
                  <button className='btn-comn-submit me-2' onClick={() => setModalStates({...modalStates, update: true, show: true, rowVal: data[i]})}>
                    Edit
                  </button>
                  <button className='btn-comn-danger me-2' onClick={() => setModalStates({...modalStates, rowVal: data[i]?._id, deleteConfirm: true})}>
                    Delete
                  </button>
                </>
              )}
            </div>
          )
        },
      },
    },
  ]

  useEffect(() => {
    getPaymentGateway(option)
  }, [])

  const getPaymentGateway = async (option?: any) => {
    const {data} = await fetchAllPayment({options: option})
    setGatewayList(data.data)
    setModalStates({show: false, update: false, rowVal: '', deleteConfirm: false})
    set_option({...option, totalRecord: data.totalRecord})
    setLoader(false)
  }

  const submitFormData = async (formData: any) => {
    const {data} = await addPayment(formData)

    if (data.status === 200) {
      toast.success(data.message)
      getPaymentGateway(option)
    }
  }

  const updateGateway = async (formData: any) => {
    const {data} = await updatePayment(formData)

    if (data.status === 200) {
      toast.success(data.message)
      getPaymentGateway(option)
    }
  }

  const deleteGateway = async () => {
    const {data} = await deletePaymentById(modalStates.rowVal)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    getPaymentGateway(option)
  }

  const tableCallBack = (option: any) => {
    set_option(option)
    getPaymentGateway(option)
  }

  const handleDrop = (updatedData: any) => {
    setGatewayList(updatedData)
    // Call your API to update data here
  }

  const appModalClose = () => setModalStates({...modalStates, update: false, show: false, rowVal: ''})

  return (
    <>
      <div className='container-fluid'>
        <div className='col-12 '>
          <div className='white-box-table  card-shadow'>
            <div className='row'>
              <div className='col-12 d-flex align-items-center my-4'>
                <div className=' '>
                  <h1>Payment Gateways</h1>
                </div>
                <div className='ms-auto'>
                  {!currentUser?.is_tester && (
                    <button className='btn-comn-submit me-2' onClick={() => setModalStates({...modalStates, show: true})}>
                      Add Gateway
                    </button>
                  )}
                </div>
              </div>
            </div>
            {loader ? (
              <div className='loader-info-main'>
                <img src={Loader} alt='loader' />
              </div>
            ) : (
              <RtdDatatableNew data={gatewayList} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
            )}
          </div>
        </div>

        <Modal show={modalStates.show} onHide={() => appModalClose()} size='lg' className='cust-comn-modal' centered>
          <AddPaymentGateway update={modalStates.update} gatewayInfo={modalStates.rowVal} submitFormData={submitFormData} updateGateway={updateGateway} appModalClose={appModalClose} />
        </Modal>

        <Modal show={modalStates.deleteConfirm} onHide={() => setModalStates({...modalStates, deleteConfirm: false})} size='lg' className='cust-comn-modal' centered>
          <DeleteConfirmModal setDelete={setModalStates} setConfirmDel={deleteGateway} />
        </Modal>
      </div>
    </>
  )
}

export default PaymentGateway
