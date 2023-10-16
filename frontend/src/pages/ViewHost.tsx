import React, {useState, useEffect} from 'react'
import {RejectHost, addHostImages, addHostVideo, blockUnblockHost, deleteImageById, deleteVideoById, fetchHostImages, fetchHostVideos, hostById, hostUpdate, makeHost} from '../ApiService/_requests'
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
import {useAuth} from '../app/modules/auth'
import Loader from '../Images/loader.gif'
import {DeleteConfirmModal} from '../Modals/DeleteConfirmModal'

const ViewHost: React.FC = () => {
  const [images, setImages] = useState([])
  const [video, setVideo] = useState([])
  const [videos, setVideos] = useState([])
  const [img, setImg] = useState('')
  const [show, setShow] = useState(false)
  const [showVid, setShowVid] = useState(false)
  const [view, setView] = useState(false)
  const [hostData, setHostData] = useState<any>()
  const [loader, setLoader] = useState(true)
  const [modalStates, setModalStates] = useState<any>({rowVal: '', deleteConfirm: false})

  const {state}: any = useLocation()
  const agents = useAllAgent()
  const country = useAllCountry()
  const navigate = useNavigate()
  const {currentUser} = useAuth()

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
              {!currentUser?.is_tester && (
                <button className='btn-comn-danger me-2' onClick={() => setModalStates({rowVal: data[i], deleteConfirm: true})}>
                  Delete
                </button>
              )}
            </div>
          )
        },
      },
    },
  ]

  useEffect(() => {
    if (state) {
      getAllImage(option)
      getAllVideo(option)
      getHost(state.hostData._id)
    }
  }, [state.hostData._id])

  const getAllImage = async (option?: any) => {
    const {data} = await fetchHostImages({options: option, _id: state.hostData._id})
    setImages(data.data)
    set_option({...option, totalRecord: data.totalRecord})
    setModalStates({rowVal: '', deleteConfirm: false})
    setLoader(false)
  }

  const getAllVideo = async (option?: any) => {
    const {data} = await fetchHostVideos({options: option, _id: state.hostData._id})
    setVideos(data.data)
    set_option2({...option, totalRecord: data.totalRecord})
    setModalStates({rowVal: '', deleteConfirm: false})
    setLoader(false)
  }

  const getHost = async (_id: string) => {
    const {data} = await hostById(_id)
    setHostData(data)
  }

  const deleteImage = async () => {
    const {data} = await deleteImageById(modalStates.rowVal?._id)
    data.status === 200 ? toast.success(data.message) : toast.error(data.message)
    getAllImage(option)
  }

  const deleteVideo = async () => {
    const {data} = await deleteVideoById(modalStates.rowVal?._id)
    data.status === 200 ? toast.success(data.message) : toast.error(data.message)
    getAllVideo(option)
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

  const submitImageData = async (e: any, imgFile: any) => {
    e.preventDefault()
    if (!imgFile || imgFile.length === 0) {
      toast.error('No image selected')
      return
    }

    const formData = new FormData()

    for (let i = 0; i < imgFile.length; i++) {
      formData.append(`images`, imgFile[i])
    }
    formData.append('_id', hostData._id)

    const {data} = await addHostImages(formData)
    data.status === 200 ? toast.success(data.message) : toast.error(data.message)
    getAllImage(option)
    appModalClose()
  }

  const submitVideoData = async (e: any, formData: any, vidFile: any) => {
    e.preventDefault()
    if (!vidFile || vidFile.length === 0) {
      toast.error('No video selected')
      return
    }

    const form = new FormData()

    for (let i = 0; i < vidFile.length; i++) {
      form.append(`video`, vidFile[i])
    }
    // form.append(`thumbnail_image`, video[i]?.thumbnail)
    form.append('is_one_to_one', formData.is_one_to_one)
    form.append('video_link', formData.video_link)
    form.append('_id', hostData._id)

    const {data} = await addHostVideo(form)
    data.status === 200 ? toast.success(data.message) : toast.error(data.message)
    getAllVideo(option2)
    videoClose()
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
                {!currentUser?.is_tester && state?.show && (
                  <>
                    <button className='badge badge-success text-white me-2 p-3' onClick={makeHostById}>
                      Make Host
                    </button>
                    <button className='badge badge-danger text-white me-2 p-3' onClick={RejectHostApp}>
                      Reject
                    </button>
                  </>
                )}
                {!currentUser?.is_tester && (
                  <button className={`${hostData?.is_block == 1 ? 'badge badge-success' : 'badge badge-danger'} text-white p-3`} onClick={handleBlockUnblock}>
                    {hostData?.is_block == 1 ? 'Unblock' : 'Block'}
                  </button>
                )}
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

                    {!currentUser?.is_tester && (
                      <button type='submit' className='btn-comn-submit mt-8'>
                        Submit
                      </button>
                    )}
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
                  {!currentUser?.is_tester && (
                    <button className='btn-comn-submit ms-auto me-2' onClick={() => setShow(true)}>
                      Add Image
                    </button>
                  )}
                </div>
              </div>
              {loader ? (
                <div className='loader-info-main'>
                  <img src={Loader} alt='loader' />
                </div>
              ) : (
                <RtdDatatableNew data={images} columns={columns} option={option} tableCallBack={tableCallBack} />
              )}
            </div>
          </div>
          <div className='col-12 col-md-6'>
            <div className='white-box-table  card-shadow'>
              <div className='row'>
                <div className='col-12 d-flex align-items-center my-4'>
                  <h2>Videos</h2>
                  {!currentUser?.is_tester && (
                    <button className='btn-comn-submit ms-auto me-2' onClick={() => setShowVid(true)}>
                      Add Video
                    </button>
                  )}
                </div>
              </div>
              {loader ? (
                <div className='loader-info-main'>
                  <img src={Loader} alt='loader' />
                </div>
              ) : (
                <RtdDatatableNew data={videos} columns={columns} option={option2} tableCallBack={tableCallBack2} />
              )}
            </div>
          </div>
        </div>

        <Modal show={show} onHide={() => appModalClose()} size='lg' className='cust-comn-modal' centered>
          <AddImage submitImageData={submitImageData} appModalClose={appModalClose} />
        </Modal>

        <Modal show={showVid} onHide={() => videoClose()} size='lg' className='cust-comn-modal' centered>
          <AddVideo submitVideoData={submitVideoData} appModalClose={videoClose} />
        </Modal>

        <Modal show={view} onHide={() => setView(false)} size='lg' className='cust-comn-modal' centered>
          <ImageView image={img} setView={setView} video={video} />
        </Modal>

        <Modal show={modalStates.deleteConfirm} onHide={() => setModalStates({...modalStates, deleteConfirm: false})} size='lg' className='cust-comn-modal' centered>
          <DeleteConfirmModal setDelete={setModalStates} setConfirmDel={modalStates.rowVal?.image ? deleteImage : deleteVideo} />
        </Modal>
      </div>
    </>
  )
}

export default ViewHost
