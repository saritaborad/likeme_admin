import React, {useState, useEffect} from 'react'
import {RejectHost, blockUnblockHost, deleteImageById, deleteVideoById, fetchHostImages, fetchHostVideos, hostById, hostUpdate, makeHost} from '../ApiService/_requests'
import {useLocation, useNavigate} from 'react-router-dom'
import {ImgUrl} from '../const'
import {Modal} from 'react-bootstrap'
import AddImage from '../Modals/AddImage'
import {toast} from 'react-toastify'
import ImageView from '../Modals/ImageView'
import {Formik} from 'formik'
import * as Yup from 'yup'
import {errorContainer, formAttr} from '../commonFun'
import {useAllAgent, useAllCountry} from '../hooks/customHook'
import AddVideo from '../Modals/AddVideo'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'

const ViewHost: React.FC = () => {
  const [user, setUser] = useState([])
  const [images, setImages] = useState([])
  const [video, setVideo] = useState([])
  const [videos, setVideos] = useState([])
  const [img, setImg] = useState('')
  const [show, setShow] = useState(false)
  const [showVid, setShowVid] = useState(false)
  const [view, setView] = useState(false)
  const [hostData, setHostData] = useState<any>()
  const {state}: any = useLocation()
  const agents = useAllAgent()
  const country = useAllCountry()
  const navigate = useNavigate()

  const [option, set_option] = useState({sizePerPage: 10, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'desc'})
  const [option2, set_option2] = useState({sizePerPage: 10, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'desc'})

  const columns = [
    {
      value: 'image',
      label: 'Image',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return data[i]?.image ? <img src={ImgUrl + data[i]?.image} className='profile-img' alt='' /> : null
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
                  setView(true)
                  setImg(data[i]?.image)
                  setVideo(data[i]?.video)
                }}
              >
                View
              </button>
              <button className='btn-comn-danger me-2' onClick={() => (data[i]?.image ? deleteImage(data[i]?._id) : deleteVideo(data[i]?._id))}>
                Delete
              </button>
            </div>
          )
        },
      },
    },
  ]

  useEffect(() => {
    if (state) {
      getAllImage(option, state.hostData._id)
      getAllVideo(option, state.hostData._id)
      getHost(state.hostData._id)
    }
  }, [state.hostData._id])

  const getAllImage = async (option?: any, _id?: string) => {
    const {data} = await fetchHostImages({options: option, _id: _id})
    setImages(data.data)
    set_option({...option, totalRecord: data.totalRecord})
  }

  const getAllVideo = async (option?: any, _id?: string) => {
    const {data} = await fetchHostVideos({options: option, _id: _id})
    setVideos(data.data)
    set_option2({...option, totalRecord: data.totalRecord})
  }

  const getHost = async (_id: string) => {
    const {data} = await hostById(_id)
    setHostData(data)
  }

  const deleteImage = async (_id: string) => {
    const {data} = await deleteImageById(_id)
    data.status === 200 ? toast.success(data.message) : toast.error(data.message)
    getAllImage(option, state.hostData._id)
  }

  const deleteVideo = async (_id: string) => {
    const {data} = await deleteVideoById(_id)
    data.status === 200 ? toast.success(data.message) : toast.error(data.message)
    getAllVideo(option, state.hostData._id)
  }

  const makeHostById = async () => {
    const {data} = await makeHost(hostData?._id)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    navigate('/hostapps')
  }

  const RejectHostApp = async () => {
    const {data} = await RejectHost(hostData?._id)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    navigate('/hostapps')
  }

  const handleBlockUnblock = async () => {
    const {data} = await blockUnblockHost(hostData?._id, hostData?.is_block == 1 ? 0 : 1)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    getHost(state.hostData._id)
  }

  const updateFakeHost = async (formData: any) => {
    const {data} = await hostUpdate(formData)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
  }

  const appModalClose = () => setShow(false)
  const videoClose = () => setShowVid(false)

  const tableCallBack = (option: any) => {
    set_option(option)
    getAllImage(option)
  }

  const tableCallBack2 = (option: any) => {
    set_option2(option)
    getAllVideo(option)
  }

  const handleDrop = (updatedData: any) => {
    setUser(updatedData)
    // Call your API to update data here
  }

  return (
    <>
      <div className='container-fluid'>
        <div className='card-shadow mt-8'>
          <div className='card'>
            <div className='card-header d-flex align-items-center'>
              <div className='d-flex align-items-center '>
                <h4 className='mt-2'>{hostData?.fullName}</h4>
                <span className='badge badge-success ms-4'>{hostData?.is_fake == 1 ? 'Fake' : 'Real'}</span>
              </div>
              <div>
                {state?.show && (
                  <>
                    <button className='badge badge-success text-white me-2 p-3' onClick={makeHostById}>
                      Make Host
                    </button>
                    <button className='badge badge-danger text-white me-2 p-3' onClick={RejectHostApp}>
                      Reject
                    </button>
                  </>
                )}
                <button className={`${hostData?.is_block == 1 ? 'badge badge-success' : 'badge badge-danger'} text-white p-3`} onClick={handleBlockUnblock}>
                  {hostData?.is_block == 1 ? 'Unblock' : 'Block'}
                </button>
              </div>
            </div>

            <Formik
              enableReinitialize
              initialValues={{
                _id: hostData && hostData?._id,
                fullName: hostData?.fullName || '',
                agent_id: hostData?.agent_id || '',
                availabiltyHours: hostData?.availabiltyHours || '',
                intrests: hostData?.intrests?.toString() || '',
                age: hostData?.age || '',
                bio: hostData?.bio == 0 ? 0 : 1 || '',
                billingAddress: hostData?.billingAddress || '',
                about: hostData?.about || '',
                country_id: hostData?.country_id || '',
                email: hostData?.email || '',
                diamond_per_min: hostData?.diamond_per_min || 0,
              }}
              validationSchema={Yup.object({
                fullName: Yup.string().required('required.'),
                agent_id: Yup.string().required('required.'),
                availabiltyHours: Yup.number().required('required.'),
                intrests: Yup.string().required('required.'),
                age: Yup.number().required('required.'),
                bio: Yup.string().required('required.'),
                billingAddress: Yup.string().required('required.'),
                about: Yup.string().required('required.'),
                country_id: Yup.string().required('required.'),
                email: Yup.string().required('required.'),
                diamond_per_min: Yup.number().required('required.'),
              })}
              onSubmit={(formData, {resetForm}) => {
                updateFakeHost(formData)
              }}
            >
              {(runform) => (
                <form onSubmit={runform.handleSubmit}>
                  <input type='hidden' name='_token' defaultValue='EjAY5yPivM7ZAH2SisFwbB3rRK2Fj1AFLwH6sPuE' />
                  <input id='hostId' className=' form-control' readOnly name='id' type='text' hidden />
                  <div className='card-body' id='user-detail-form'>
                    <div>
                      <input className='requesCountrytHostId ' type='hidden' />
                    </div>
                    <div className='row'>
                      <div className='form-group col-md-6'>
                        <label htmlFor='fullname'>Fullname</label>
                        <input className='fullname form-control mt-2' name='fullName' type='text' id='host-fullname' {...formAttr(runform, 'fullName')} />
                        {errorContainer(runform, 'fullName')}
                      </div>
                      <div className='form-group col-md-6'>
                        <label>Assign Agent</label>
                        <select className='form-control mt-2' name='agent_id' id='all-agent_id' {...formAttr(runform, 'agent_id')}>
                          <option value='' disabled>
                            Select agent
                          </option>
                          {agents?.length &&
                            agents.map((item: any, i) => (
                              <option value={item._id} key={i}>
                                {item.name}
                              </option>
                            ))}
                        </select>
                        {errorContainer(runform, 'agent_id')}
                      </div>
                    </div>
                    <div className='row mt-6'>
                      <div className='form-group col-md-6'>
                        <label htmlFor='AvailabiltyHours'>Availabilty Hours</label>
                        <input type='number' name='availabiltyHours' className='form-control mt-2' id='availabiltyHours' {...formAttr(runform, 'availabiltyHours')} />
                        {errorContainer(runform, 'availabiltyHours')}
                      </div>
                      <div className='form-group col-md-6'>
                        <div className='row '>
                          <div className='form-group col-md-9'>
                            <label>Intrests</label>
                            <input type='text' name='intrests' className='form-control mt-2' id='host_intrests' {...formAttr(runform, 'intrests')} />
                            {errorContainer(runform, 'intrests')}
                          </div>
                          <div className='form-group col-md-3'>
                            <label>Age</label>
                            <input type='number' name='age' className='form-control mt-2' id='host_age' {...formAttr(runform, 'age')} />
                            {errorContainer(runform, 'age')}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='row mt-6'>
                      <div className='form-group col-md-6'>
                        <label>Bio</label>
                        <textarea className='form-control mt-2' id='host_bio' name='bio' {...formAttr(runform, 'bio')} />
                        {errorContainer(runform, 'bio')}
                      </div>
                      <div className='form-group col-md-6'>
                        <label>Billing Address</label>
                        <textarea className='form-control mt-2' name='billingAddress' id='host_billingAddress' {...formAttr(runform, 'billingAddress')} />
                        {errorContainer(runform, 'billingAddress')}
                      </div>
                    </div>
                    <div>
                      <div className='row mt-6'>
                        <div className='form-group col-md-6 '>
                          <label>About</label>
                          <textarea className='form-control mt-2' name='about' id='host_about' {...formAttr(runform, 'about')} />
                          {errorContainer(runform, 'about')}
                        </div>
                        <div className='form-group col-md-6 '>
                          <label>Country</label>
                          <select className='form-control mt-2' name='country_id' id='all-country' {...formAttr(runform, 'country_id')}>
                            {country &&
                              country?.length > 0 &&
                              country.map((item: any, i) => (
                                <option value={item._id} key={i}>
                                  {item.country_name}
                                </option>
                              ))}
                          </select>
                          {errorContainer(runform, 'country_id')}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className='row mt-6'>
                        <div className='form-group col-md-6 '>
                          <label>Email</label>
                          <input type='text' name='email' className='form-control mt-2' id='host_email' {...formAttr(runform, 'email')} />
                          {errorContainer(runform, 'email')}
                        </div>
                        <div className='form-group col-md-6 '>
                          <label>Diamond / Min</label>
                          <input type='number' name='diamond_per_min' className='form-control mt-2' id='host_diamond_per_min' {...formAttr(runform, 'diamond_per_min')} />
                          {errorContainer(runform, 'diamond_per_min')}
                        </div>
                      </div>
                    </div>

                    <button type='submit' className='btn-comn-submit mt-8'>
                      Submit
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
        <div className='row cutome-g g-5 mt-8 '>
          <div className='col-12 col-md-6'>
            <div className='white-box-table  card-shadow'>
              <div className='row'>
                <div className='col-12 d-flex align-items-center my-4'>
                  <h2>Images</h2>
                  <button className='btn-comn-submit ms-auto me-2' onClick={() => setShow(true)}>
                    Add Image
                  </button>
                </div>
              </div>
              <RtdDatatableNew data={images} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
            </div>
          </div>
          <div className='col-12 col-md-6'>
            <div className='white-box-table  card-shadow'>
              <div className='row'>
                <div className='col-12 d-flex align-items-center my-4'>
                  <h2>Videos</h2>
                  <button className='btn-comn-submit ms-auto me-2' onClick={() => setShowVid(true)}>
                    Add Video
                  </button>
                </div>
              </div>
              <RtdDatatableNew data={videos} columns={columns} option={option2} tableCallBack={tableCallBack2} onDrop={handleDrop} />
            </div>
          </div>
        </div>

        <Modal show={show} onHide={() => appModalClose()} size='lg' className='cust-comn-modal' centered>
          <AddImage HostId={hostData?._id} appModalClose={appModalClose} getAllImage={getAllImage} />
        </Modal>

        <Modal show={showVid} onHide={() => videoClose()} size='lg' className='cust-comn-modal' centered>
          <AddVideo HostId={hostData?._id} appModalClose={videoClose} getAllVideo={getAllVideo} />
        </Modal>

        <Modal show={view} onHide={() => setView(false)} size='lg' className='cust-comn-modal' centered>
          <ImageView image={img} setView={setView} video={video} />
        </Modal>
      </div>
    </>
  )
}

export default ViewHost
