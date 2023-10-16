import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {addCountryData, deleteCountryData, editCountryData, fetchAllCountry} from '../ApiService/_requests'
import {Modal} from 'react-bootstrap'
import AddCountry from '../Modals/AddCountry'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'
import {useAuth} from '../app/modules/auth'
import Loader from '../Images/loader.gif'
import {DeleteConfirmModal} from '../Modals/DeleteConfirmModal'

const Country: React.FC = () => {
  const [user, setUser] = useState<any>([])
  const [modalStates, setModalStates] = useState({update: false, show: false, rowVal: '', deleteConfirm: false})
  const [loader, setLoader] = useState(true)
  const [option, set_option] = useState({sizePerPage: 10, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'ASC'})
  const {currentUser} = useAuth()

  const columns = [
    {
      value: 'country_name',
      label: 'Country Name',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.country_name}</div>
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
    getCountryList(option)
  }, [])

  const getCountryList = async (option?: any) => {
    const {data} = await fetchAllCountry({options: option})
    setUser(data.countries)
    setModalStates({show: false, update: false, rowVal: '', deleteConfirm: false})
    set_option({...option, totalRecord: data.totalRecord})
    setLoader(false)
  }

  const deleteCountry = async () => {
    const {data} = await deleteCountryData(modalStates.rowVal)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    getCountryList(option)
  }

  const tableCallBack = (option: any) => {
    set_option(option)
    getCountryList(option)
  }

  const handleDrop = (updatedData: any) => {
    setUser(updatedData)
    // Call your API to update data here
  }

  const submitFormData = async (formData: any) => {
    const {data} = await addCountryData(formData)
    if (data.status === 200) {
      toast.success(data.message)
      getCountryList(option)
    }
  }

  const updateCountry = async (formData: any) => {
    const {data} = await editCountryData(formData)
    if (data.status === 200) {
      toast.success(data.message)
      getCountryList(option)
    }
  }

  const appModalClose = () => setModalStates({...modalStates, update: false, show: false, rowVal: ''})

  return (
    <>
      <div className='container-fluid'>
        <div className='col-12'>
          <div className='white-box-table  card-shadow'>
            <div className='row'>
              <div className='col-12 d-flex align-items-center my-4'>
                <div className=' '>
                  <h1>Country List</h1>
                </div>
                <div className='ms-auto'>
                  {!currentUser?.is_tester && (
                    <button className='btn-comn-submit me-2' onClick={() => setModalStates({...modalStates, show: true})}>
                      Add Country
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
              <RtdDatatableNew data={user} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
            )}
          </div>
        </div>
        <Modal show={modalStates.show} onHide={() => appModalClose()} size='lg' className='cust-comn-modal' centered>
          <AddCountry update={modalStates.update} countryDetail={modalStates.rowVal} submitFormData={submitFormData} updateCountry={updateCountry} appModalClose={appModalClose} />
        </Modal>
        <Modal show={modalStates.deleteConfirm} onHide={() => setModalStates({...modalStates, deleteConfirm: false})} size='lg' className='cust-comn-modal' centered>
          <DeleteConfirmModal setDelete={setModalStates} setConfirmDel={deleteCountry} />
        </Modal>
      </div>
    </>
  )
}

export default Country
