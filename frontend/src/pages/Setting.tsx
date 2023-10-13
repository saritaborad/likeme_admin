import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {getAdmob, getSettingData, updateAdmob, updateSettingApp} from '../ApiService/_requests'
import {Formik} from 'formik'
import {errorContainer, formAttr} from '../commonFun'
import * as Yup from 'yup'
import {useAuth} from '../app/modules/auth'

const Setting: React.FC = () => {
  const [settingInfo, setSettingInfo] = useState<any>()
  const [liveStream, setLiveStream] = useState(false)
  const [rewarded, setRewarded] = useState({type: 1, rewarded_id: ''})
  const {currentUser} = useAuth()

  useEffect(() => {
    settingData()
    getAdmobData(rewarded.type)
  }, [])

  const settingData = async () => {
    const {data} = await getSettingData()
    setSettingInfo(data)
    setLiveStream(data?.liveSwitch)
  }

  const getAdmobData = async (type?: any) => {
    const {data} = await getAdmob({type: type})
    setRewarded({type: type, rewarded_id: data.rewarded_id})
  }

  const updateSetting = async (formData: any) => {
    const {data} = await updateSettingApp(formData)
    if (data.status === 200) {
      toast.success(data.message)
      settingData()
    }
  }

  const handleChange = (e: any) => setRewarded({...rewarded, rewarded_id: e.target.value})

  const updateAdmobData = async (e: any) => {
    e.preventDefault()
    const {data} = await updateAdmob(rewarded)
    setRewarded({...rewarded, rewarded_id: data?.rewarded_id})
    data.status === 200 ? toast.success(data.message) : toast.error(data.message)
  }

  return (
    <>
      <div className='container-fluid'>
        <div className='card-shadow'>
          <div className='card'>
            <Formik
              enableReinitialize
              initialValues={{
                _id: settingInfo && settingInfo?._id,
                app_name: settingInfo?.app_name || '',
                default_diamond: settingInfo?.default_diamond || '',
                min_thershold: settingInfo?.min_thershold || '',
                currency: settingInfo?.currency || '',
                amount_per_diamond: settingInfo?.amount_per_diamond || '',
                min_diamonds_charge_for_going_live: settingInfo?.min_diamonds_charge_for_going_live || 0,
                watch_ad_diamond: settingInfo?.watch_ad_diamond || '',
                user_message_charge: settingInfo?.user_message_charge || '',
              }}
              validationSchema={Yup.object({
                app_name: Yup.string().required('required.'),
                default_diamond: Yup.number().required('required.'),
                min_thershold: Yup.number().required('required.'),
                currency: Yup.string().required('required.'),
                amount_per_diamond: Yup.number().required('required.'),
                min_diamonds_charge_for_going_live: Yup.number().required('required.'),
                watch_ad_diamond: Yup.number().required('required.'),
                user_message_charge: Yup.number().required('required.'),
              })}
              onSubmit={(formData, {resetForm}) => {
                updateSetting(formData)
              }}
            >
              {(runform) => (
                <form onSubmit={runform.handleSubmit}>
                  <div className='card-header d-flex align-items-center'>
                    <h2 className='text-secondery'>App Setting</h2>
                  </div>
                  <div className='card-body'>
                    <div className='row'>
                      <div className='form-group col-md-6 '>
                        <label htmlFor='app-name'>App Name</label>
                        <input type='text' name='app_name' required className='form-control mt-2' id='app-name-val' {...formAttr(runform, 'app_name')} />
                        {errorContainer(runform, 'app_name')}
                      </div>
                      <div className='form-group col-md-6'>
                        <label htmlFor='diamond'>Registration Bonus Amount (Diamonds)</label>
                        <input type='text' name='default_diamond' required className='form-control mt-2' id='diamond' {...formAttr(runform, 'default_diamond')} />
                        {errorContainer(runform, 'default_diamond')}
                      </div>
                      <div className='form-group col-md-6 mt-7'>
                        <label htmlFor='min_thershold'>Minimum Redeem</label>
                        <input type='text' name='min_thershold' className='form-control mt-2' id='minumum-blance' {...formAttr(runform, 'min_thershold')} />
                        {errorContainer(runform, 'min_thershold')}
                      </div>
                      <div className='form-group col-md-6 mt-7'>
                        <label htmlFor='currency'>Currency</label>
                        <input type='text' name='currency' required className='form-control mt-2' id='currency' {...formAttr(runform, 'currency')} />
                        {errorContainer(runform, 'currency')}
                      </div>
                      <div className='form-group col-md-6 mt-7'>
                        <label htmlFor='amount_per_diamond'>Diamond Value</label>
                        <input type='text' name='amount_per_diamond' required className='form-control mt-2' id='amount-per-diamond' {...formAttr(runform, 'amount_per_diamond')} />
                        {errorContainer(runform, 'amount_per_diamond')}
                      </div>
                      <div className='form-group col-md-6 mt-7'>
                        <label htmlFor='min_diamonds_charge_for_going_live'>Minimum Price of Live : Calls / Min for host (Diamonds)</label>
                        <input type='text' name='min_diamonds_charge_for_going_live' className='form-control mt-2' id='min-diamonds-charge-for-going-live' {...formAttr(runform, 'min_diamonds_charge_for_going_live')} />
                        {errorContainer(runform, 'min_diamonds_charge_for_going_live')}
                      </div>
                      <div className='form-group col-md-6 mt-7'>
                        <label htmlFor='watch_ad_diamond'>Video Ad Reward (Diamonds)</label>
                        <input type='text' name='watch_ad_diamond' className='form-control mt-2' id='watch-ad-diamond' {...formAttr(runform, 'watch_ad_diamond')} />
                        {errorContainer(runform, 'watch_ad_diamond')}
                      </div>
                      <div className='form-group col-md-6 mt-7'>
                        <label htmlFor='app-name'>Price / Chat Message for Users (Diamonds)</label>
                        <input type='text' name='user_message_charge' required className='form-control mt-2' id='app-user-message' {...formAttr(runform, 'user_message_charge')} />
                        {errorContainer(runform, 'user_message_charge')}
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
        <div className='card-shadow'>
          <div className='card mt-10'>
            <Formik
              enableReinitialize
              initialValues={{
                _id: settingInfo && settingInfo?._id,
                agora_app_id: settingInfo?.agora_app_id || '',
                agora_app_cert: settingInfo?.agora_app_cert || '',
              }}
              validationSchema={Yup.object({
                agora_app_id: Yup.string().required('required.'),
                agora_app_cert: Yup.string().required('required.'),
              })}
              onSubmit={(formData, {resetForm}) => {
                updateSetting(formData)
              }}
            >
              {(runform) => (
                <form onSubmit={runform.handleSubmit}>
                  <div className='card-header d-flex align-items-center'>
                    <h2 className='text-secondery'>Agora Settings</h2>
                  </div>
                  <div className='card-body'>
                    <div className='row'>
                      <div className='form-group col-md-6 '>
                        <label htmlFor='app-name'>Agora App Id</label>
                        <input type='text' name='agora_app_id' required className='form-control mt-2' {...formAttr(runform, 'agora_app_id')} />
                        {errorContainer(runform, 'agora_app_id')}
                      </div>
                      <div className='form-group col-md-6 '>
                        <label htmlFor='diamond'>Agora App Certificate</label>
                        <input type='text' name='agora_app_cert' required className='form-control mt-2' {...formAttr(runform, 'agora_app_cert')} />
                        {errorContainer(runform, 'agora_app_cert')}
                      </div>
                    </div>
                    <input type='hidden' name='id' className='form-control' id='id-app-agora-app' />
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
        <div className='card-shadow'>
          <div className='card mt-10'>
            <div className='card-header d-flex align-items-center'>
              <h2 className='text-secondery'>Ads</h2>
            </div>
            <div className='card-body'>
              <ul className='nav nav-pills' id='myTab3' role='tablist'>
                <li className='nav-item'>
                  <button
                    className={`${rewarded.type == 1 ? 'btn-comn-submit active' : 'btn-transparent'}`}
                    onClick={() => {
                      setRewarded({...rewarded, type: 1})
                      getAdmobData(1)
                    }}
                  >
                    Android
                  </button>
                </li>
                <li className='nav-item'>
                  <button
                    className={`${rewarded.type == 0 ? 'btn-comn-submit active' : 'btn-transparent'}`}
                    onClick={() => {
                      setRewarded({...rewarded, type: 0})
                      getAdmobData(0)
                    }}
                  >
                    IOS
                  </button>
                </li>
              </ul>
              <div className='tab-content my-4' id='myTabContent2'>
                <div className='tab-pane fade show active' id='home3' role='tabpanel' aria-labelledby='home-tab3'>
                  <form onSubmit={updateAdmobData}>
                    <div className='form-row'>
                      <div className='form-group col-md-6 mt-7'>
                        <label htmlFor='ReWarded'>Admob Rewarded Ad Unit</label>
                        <input type='text' name='rewarded_id' onChange={handleChange} value={rewarded.rewarded_id} className='form-control mt-2' id='ReWarded-android' />
                      </div>
                    </div>
                    {!currentUser?.is_tester && (
                      <button type='submit' className='btn-comn-submit mt-8'>
                        Submit
                      </button>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='card-shadow mt-10'>
          <div className='row'>
            <div className='col-12'>
              <div className='card'>
                <Formik
                  enableReinitialize
                  initialValues={{
                    _id: settingInfo && settingInfo?._id,
                    host_message_charge: settingInfo?.host_message_charge || 0,
                    host_call_charge: settingInfo?.host_call_charge || 0,
                    host_live_Percentage: settingInfo?.host_live_Percentage || 0,
                    chargeForLive: settingInfo?.chargeForLive || 0,
                    minimumMinuts: settingInfo?.minimumMinuts || 0,
                    max_live_time: settingInfo?.max_live_time || 0,
                    max_live_private_time: settingInfo?.max_live_private_time || 0,
                    max_fake_live_hosts: settingInfo?.max_fake_live_hosts || 0,
                    match_call_second: settingInfo?.match_call_second || 0,
                    match_call_coin: settingInfo?.match_call_coin || 0,
                    fake_host_vidoe_from: settingInfo?.fake_host_vidoe_from || 0,
                    liveSwitch: settingInfo?.liveSwitch || 0,
                  }}
                  validationSchema={Yup.object({
                    host_message_charge: Yup.number().required('required.'),
                    host_call_charge: Yup.number().required('required.'),
                    host_live_Percentage: Yup.number().required('required.'),
                    chargeForLive: Yup.number().required('required.'),
                    minimumMinuts: Yup.number().required('required.'),
                    max_live_time: Yup.number().required('required.'),
                    max_live_private_time: Yup.number().required('required.'),
                    max_fake_live_hosts: Yup.number().required('required.'),
                    match_call_second: Yup.number().required('required.'),
                    match_call_coin: Yup.number().required('required.'),
                  })}
                  onSubmit={(formData, {resetForm}) => {
                    updateSetting(formData)
                  }}
                >
                  {(runform) => (
                    <form onSubmit={runform.handleSubmit}>
                      <div className='card-header d-flex align-items-center'>
                        <h2 className='text-secondery'>Host Settings</h2>
                      </div>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='form-group col-md-6'>
                            <label htmlFor='app-name'>Comission per Message from host (Diamonds)</label>
                            <input type='number' name='host_message_charge' required className='form-control mt-2' id='app-host-message' {...formAttr(runform, 'host_message_charge')} />
                            {errorContainer(runform, 'host_message_charge')}
                          </div>
                          <div className='form-group col-md-6'>
                            <label htmlFor='diamond'>Comission of calls from host (%)</label>
                            <input type='number' name='host_call_charge' required className='form-control mt-2' id='app-host-call' {...formAttr(runform, 'host_call_charge')} />
                            {errorContainer(runform, 'host_call_charge')}
                          </div>
                          <div className='form-group col-md-6 mt-7'>
                            <label htmlFor='diamond'>Comission of livestream from host (%)</label>
                            <input type='number' name='host_live_Percentage' required className='form-control mt-2' id='app-host-live-per' {...formAttr(runform, 'host_live_Percentage')} />
                            {errorContainer(runform, 'host_live_Percentage')}
                          </div>
                          <div className='form-group col-md-6 mt-7'>
                            <label htmlFor='chargeForLive'>Charge to go live for host (Diamonds)</label>
                            <input type='number' name='chargeForLive' required className='form-control mt-2' id='charge-host-live' {...formAttr(runform, 'chargeForLive')} />
                            {errorContainer(runform, 'chargeForLive')}
                          </div>
                          <div className='form-group col-md-6 mt-7'>
                            <label htmlFor='minimumMinuts' className='min-minuts-host-label mt-2' style={{color: 'rgb(190, 190, 190)'}}>
                              Livestream timeout minutes of host (Minutes). Livestream will be stopped once limit is over and fails to gain minimum viewers required to continue livestream.
                            </label>
                            <input type='number' name='minimumMinuts' disabled={!liveStream} required className='form-control' id='min-host-minuts' {...formAttr(runform, 'minimumMinuts')} />
                            {errorContainer(runform, 'minimumMinuts')}
                          </div>
                          <div className='form-group form-check form-switch col-md-6 ps-2 mt-7'>
                            <label htmlFor='Switch' className='mt-2 d-block'>
                              On/Off Livestream Timeout
                            </label>
                            <br />
                            <input
                              className='form-check-input ms-0'
                              type='checkbox'
                              name='liveSwitch'
                              // id={`mode${i}`}
                              onChangeCapture={(e: any) => {
                                runform?.setFieldValue('liveSwitch', e.target.checked ? 1 : 0)
                                setLiveStream(!liveStream)
                              }}
                              checked={runform?.values?.liveSwitch == 1 ? true : false}
                            />
                          </div>
                          <div className='form-group col-md-6 mt-7'>
                            <label htmlFor='max_live_time'>Maximum Time of Livestream (Minutes)</label>
                            <input type='number' name='max_live_time' required className='form-control mt-2' id='max_live_time' {...formAttr(runform, 'max_live_time')} />
                            {errorContainer(runform, 'max_live_time')}
                          </div>
                          <div className='form-group col-md-6 mt-7'>
                            <label htmlFor='max_live_private_time'>Maximum Time of Private-stream (Minutes)</label>
                            <input type='number' name='max_live_private_time' required className='form-control mt-2' id='max_live_private_time' {...formAttr(runform, 'max_live_private_time')} />
                            {errorContainer(runform, 'max_live_private_time')}
                          </div>
                          <div className='form-group form-check form-switch col-md-6 ps-2 mt-7'>
                            <label htmlFor='fake_host_vidoe_from' className='mt-2 d-block'>
                              Fake Host Video (on=link/off=url)
                            </label>
                            <br />
                            <input
                              className='form-check-input ms-0'
                              type='checkbox'
                              name='fake_host_vidoe_from'
                              onChangeCapture={(e: any) => runform?.setFieldValue('fake_host_vidoe_from', e.target.checked ? 1 : 0)}
                              checked={runform?.values?.fake_host_vidoe_from == 1 ? true : false}
                              // id={`mode${i}`}
                              // defaultChecked={data[i]?.enable === 1 ? true : false}
                            />
                          </div>
                          <div className='form-group col-md-6 mt-7'>
                            <label htmlFor='max_fake_live_hosts'>Maximum Fake Live Host (Number)</label>
                            <input type='number' name='max_fake_live_hosts' required className='form-control mt-2' id='max_fake_live_hosts' {...formAttr(runform, 'max_fake_live_hosts')} />
                            {errorContainer(runform, 'max_fake_live_hosts')}
                          </div>
                          <div className='form-group col-md-6 mt-7'>
                            <label htmlFor='match_call_second'>Match Call Duration (second)</label>
                            <input type='number' name='match_call_second' required className='form-control mt-2' id='match_call_second' {...formAttr(runform, 'match_call_second')} />
                            {errorContainer(runform, 'match_call_second')}
                          </div>
                          <div className='form-group col-md-6 mt-7'>
                            <label htmlFor='match_call_coin'>Match Call Coin</label>
                            <input type='number' name='match_call_coin' required className='form-control mt-2' id='match_call_coin' {...formAttr(runform, 'match_call_coin')} />
                            {errorContainer(runform, 'match_call_coin')}
                          </div>
                        </div>

                        <input type='hidden' name='id' className='form-control id-get-charg-app' />
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
          </div>
        </div>
      </div>
    </>
  )
}

export default Setting
