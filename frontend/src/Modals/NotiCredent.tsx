import {Formik} from 'formik'
import React from 'react'
import * as Yup from 'yup'
import {errorContainer, formAttr} from '../commonFun'

interface IPROPS {
  updateNotiCred?: any
  submitFormData?: any
  notiInfo?: any
  update?: any
  appModalClose?: any
}

const NotiCredent: React.FC<IPROPS> = ({update, notiInfo, submitFormData, updateNotiCred, appModalClose}) => {
  return (
    <div>
      <div className='modal-content'>
        <div className='modal-header'>
          <h1 className='modal-title' id='add-notification-admin'>
            {update ? 'Edit Notification Credencial' : 'Add Notification Credencial'}
          </h1>
          <button type='button' className='btn-close' onClick={appModalClose}></button>
        </div>
        <div className='modal-body'>
          <Formik
            enableReinitialize
            initialValues={{
              _id: notiInfo && notiInfo?._id,
              package_name: notiInfo?.package_name || '',
              fcm_key: notiInfo?.fcm_key || '',
              device_type: notiInfo?.device_type || 1,
            }}
            validationSchema={Yup.object({
              package_name: Yup.string().required('required.'),
              fcm_key: Yup.string().required('required.'),
              device_type: Yup.string().required('required.'),
            })}
            onSubmit={(formData, {resetForm}) => {
              update ? updateNotiCred({...formData, device_type: formData.device_type == 1 ? 1 : 2}) : submitFormData({...formData, device_type: formData.device_type == 1 ? 1 : 2})
            }}
          >
            {(runform) => (
              <form onSubmit={runform.handleSubmit}>
                <input type='hidden' name='_token' defaultValue='JwU9eKRdqtoqkafmT0CeAoDcs30tKLYqRRurPzoz' />
                <div className='row'>
                  <div className='form-group col-md-8'>
                    <label>Package Name</label>
                    <input type='text' name='package_name' id='package_name' className='form-control mt-2' required {...formAttr(runform, 'package_name')} />
                    {errorContainer(runform, 'package_name')}
                  </div>
                  <div className='form-group col-md-4'>
                    <label htmlFor='device_type'> Device Type</label>
                    <select className='form-control mt-2' name='device_type' required {...formAttr(runform, 'device_type')}>
                      <option disabled selected hidden>
                        Choose Device Type
                      </option>
                      <option value={1}>Android</option>
                      <option value={2}>IOS</option>
                    </select>
                    {errorContainer(runform, 'device_type')}
                  </div>
                </div>
                <div className='form-group mt-6'>
                  <label htmlFor='fcm_key'>Fcm Key</label>
                  <textarea className='form-control mt-2' name='fcm_key' id='fcm_key' defaultValue={''} {...formAttr(runform, 'fcm_key')} />
                  {errorContainer(runform, 'fcm_key')}
                </div>
                <button type='submit' className='btn-comn-submit mt-8'>
                  Submit
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default NotiCredent
