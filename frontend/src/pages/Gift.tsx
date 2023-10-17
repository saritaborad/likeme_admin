import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {addGifts, deleteGift, editGift, fetchAllgifts} from '../ApiService/_requests'
import {Modal} from 'react-bootstrap'
import AddGift from '../Modals/AddGift'
import {ImgUrl} from '../const'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'
import {useAuth} from '../app/modules/auth'
import Loader from '../Images/loader.gif'
import {DeleteConfirmModal} from '../Modals/DeleteConfirmModal'

const Gift: React.FC = () => {
  const [gifts, setGifts] = useState<any>([])
  const [modalStates, setModalStates] = useState({update: false, show: false, rowVal: '', deleteConfirm: false})
  const [loader, setLoader] = useState(true)
  const [option, set_option] = useState({sizePerPage: 10, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'ASC'})
  const {currentUser} = useAuth()

  const columns = [
    {
      value: 'images',
      label: 'Image',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <img src={`${ImgUrl + data[i]?.images}`} className='profile-img' alt='' />
        },
      },
    },
    {
      value: 'diamond',
      label: 'Diamond',
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
    getAllGifts(option)
  }, [])

  const getAllGifts = async (option?: any) => {
    const {data} = await fetchAllgifts({options: option})
    setGifts(data.gifts)
    set_option({...option, totalRecord: data.totalRecord})
    setModalStates({show: false, update: false, rowVal: '', deleteConfirm: false})
    setLoader(false)
  }

  const deleteGiftData = async () => {
    const {data} = await deleteGift(modalStates.rowVal)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    getAllGifts(option)
  }

  const submitFormData = async (formData: any) => {
    const formdata = new FormData()
    formdata.append('images', formData.images)
    formdata.append('diamond', formData.diamond)
    const {data} = await addGifts(formdata)
    if (data.status === 200) {
      toast.success(data.message)
      getAllGifts(option)
    }
  }

  const updateGift = async (formData: any) => {
    const formdata = new FormData()
    formdata.append('images', formData.images)
    formdata.append('diamond', formData.diamond)
    formdata.append('_id', formData._id)
    const {data} = await editGift(formdata)
    if (data.status === 200) {
      toast.success(data.message)
      getAllGifts(option)
    }
  }

  const appModalClose = () => setModalStates({...modalStates, update: false, show: false, rowVal: ''})

  const tableCallBack = (option: any) => {
    set_option(option)
    getAllGifts(option)
  }

  const handleDrop = (updatedData: any) => {
    setGifts(updatedData)
    // Call your API to update data here
  }

  return (
    <>
      <div className='container-fluid'>
        <div className='col-12  mt-2'>
          <div className='white-box-table  card-shadow'>
            <div className='row'>
              <div className='col-12 d-flex align-items-center my-4'>
                <div className=' '>
                  <h1>Gifts</h1>
                </div>
                <div className='ms-auto'>
                  {!currentUser?.is_tester && (
                    <button className='btn-comn-submit me-2' onClick={() => setModalStates({...modalStates, show: true})}>
                      Add Gift
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
              <RtdDatatableNew data={gifts} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
            )}
          </div>
        </div>

        <Modal show={modalStates.show} onHide={() => appModalClose()} size='lg' className='cust-comn-modal' centered>
          <AddGift update={modalStates.update} giftInfo={modalStates.rowVal} submitFormData={submitFormData} updateGift={updateGift} appModalClose={appModalClose} />
        </Modal>

        <Modal show={modalStates.deleteConfirm} onHide={() => setModalStates({...modalStates, deleteConfirm: false})} size='lg' className='cust-comn-modal' centered>
          <DeleteConfirmModal setDelete={setModalStates} setConfirmDel={deleteGiftData} />
        </Modal>
      </div>
    </>
  )
}

export default Gift
