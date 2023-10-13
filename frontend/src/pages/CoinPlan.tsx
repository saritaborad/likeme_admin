import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {addSubcription, default_flag, deleteSubcriptionById, fetchAllCoinPlans, updateSubcription} from '../ApiService/_requests'
import {Modal} from 'react-bootstrap'
import CoinPlanModal from '../Modals/CoinPlanModal'
import {usePackageName} from '../hooks/customHook'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'
import {useAuth} from '../app/modules/auth'

interface IState {
  fullname?: string
  profileimages?: string
  identity?: string
  is_fake?: number
}

const CoinPlan: React.FC = () => {
  const [coinPlanList, setCoinPlanList] = useState<IState[]>([])
  const [modalStates, setModalStates] = useState({update: false, show: false, coinPlan: ''})
  const [selectedItem, setSelectedItem] = useState<any>({package_name: 'com.videocall.randomcallapps'})
  const {currentUser} = useAuth()

  const packageName = usePackageName()

  const [option, set_option] = useState({sizePerPage: 10, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'ASC'})

  const columns = [
    {
      value: 'price',
      label: 'Price',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.price}</div>
        },
      },
    },
    {
      value: 'discount_price',
      label: 'Discount Price',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.discount_price}</div>
        },
      },
    },
    {
      value: 'discount',
      label: 'Discount',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.discount}</div>
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
      value: 'app_store_id',
      label: 'App store id',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.app_store_id}</div>
        },
      },
    },
    {
      value: 'play_store_id',
      label: 'Play store id',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.play_store_id}</div>
        },
      },
    },
    {
      value: 'orignal_sku',
      label: 'Orignal SKU',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.orignal_sku}</div>
        },
      },
    },
    {
      value: 'highlight_text',
      label: 'Highlight',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.highlight_text}</div>
        },
      },
    },
    {
      value: 'default_flag',
      label: 'Default',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return (
            <button className={`${data[i]?.default_flag == 1 ? 'btn-comn-success' : 'btn-comn-black'}`} onClick={() => changeSelect(data[i]?._id)}>
              {data[i]?.default_flag == 1 ? 'Selected' : 'Select'}
            </button>
          )
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
                  <button
                    className='btn-comn-submit me-2'
                    onClick={() => {
                      setModalStates({show: true, update: true, coinPlan: data[i]})
                    }}
                  >
                    Edit
                  </button>
                  <button className='btn-comn-danger me-2' onClick={() => deleteCoinPlan(data[i]?._id)}>
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
    getAllCoinPlan(option, selectedItem)
  }, [])

  const changeSelect = async (id: string) => {
    const {data} = await default_flag(id)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    getAllCoinPlan(option, selectedItem)
  }

  const getAllCoinPlan = async (option?: any, filter?: any) => {
    const {data} = await fetchAllCoinPlans({options: option, ...filter})
    setCoinPlanList(data.data)
    setModalStates({show: false, update: false, coinPlan: ''})
    set_option({...option, totalRecord: data.totalRecord})
  }

  const deleteCoinPlan = async (id: string) => {
    const {data} = await deleteSubcriptionById(id)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    getAllCoinPlan(option, selectedItem)
  }

  const submitFormData = async (formData: any) => {
    const {data} = await addSubcription(formData)

    if (data.status === 200) {
      toast.success(data.message)
      getAllCoinPlan(option, selectedItem)
    }
  }

  const updateCoinPlan = async (formData: any) => {
    const {data} = await updateSubcription(formData)

    if (data.status === 200) {
      toast.success(data.message)
      getAllCoinPlan(option, selectedItem)
    }
  }

  const tableCallBack = (option: any) => {
    set_option(option)
    getAllCoinPlan(option, selectedItem)
  }

  const handleDrop = (updatedData: any) => {
    setCoinPlanList(updatedData)
    // Call your API to update data here
  }

  const handleFilter = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedItem({...selectedItem, [e.target.name]: e.target.value})
    getAllCoinPlan(option, {...selectedItem, [e.target.name]: e.target.value})
  }

  const appModalClose = () => setModalStates({show: false, update: false, coinPlan: ''})

  return (
    <>
      <div className='container-fluid'>
        <div className='col-12'>
          <div className='white-box-table  card-shadow'>
            <div className='row'>
              <div className='col-12 d-flex align-items-center my-4'>
                <div className=' '>
                  <h1>Coin Plans</h1>
                </div>

                <div className='ms-auto me-2'>
                  {!currentUser?.is_tester && (
                    <button className='btn-comn-submit' onClick={() => setModalStates({...modalStates, show: true})}>
                      Add Coin Plan
                    </button>
                  )}
                </div>
              </div>
              <div className='col-3'>
                <select className='form-control px-4 my-3' name='package_name' value={selectedItem.package_name} onChange={(e) => handleFilter(e)}>
                  {packageName?.length > 0 &&
                    packageName?.map((item: any, i: number) => (
                      <option value={item.package_name} key={i}>
                        {item.device_type == 1 ? 'Android' : 'IOS'} - {item.app_name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <RtdDatatableNew data={coinPlanList} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
          </div>
        </div>

        <Modal show={modalStates.show} onHide={() => appModalClose()} size='lg' className='cust-comn-modal' centered>
          <CoinPlanModal update={modalStates.update} coinPlan={modalStates.coinPlan} submitFormData={submitFormData} updateCoinPlan={updateCoinPlan} appModalClose={appModalClose} />
        </Modal>
      </div>
    </>
  )
}

export default CoinPlan
