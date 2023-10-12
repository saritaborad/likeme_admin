import {Formik} from 'formik'
import React from 'react'
import * as Yup from 'yup'
import {errorContainer, formAttr} from '../commonFun'

interface IPROPS {
  submitFormData?: any
  appModalClose?: any
}

const SendMessage: React.FC<IPROPS> = ({submitFormData, appModalClose}) => {
  return (
    <div>
      <div className='modal-content'>
        <div className='modal-header'>
          <h2 className='modal-title' id='gifts-one'>
            Send Message
          </h2>
          <button type='button' className='btn-close' onClick={appModalClose}></button>
        </div>
        <div className='modal-body'>
          <Formik
            enableReinitialize
            initialValues={{
              message: '',
              description: '',
            }}
            validationSchema={Yup.object({
              message: Yup.string().required('required.'),
              description: Yup.string().required('required.'),
            })}
            onSubmit={(formData, {resetForm}) => submitFormData(formData)}
          >
            {(runform) => (
              <form onSubmit={runform.handleSubmit}>
                <div>
                  <div className='form-group mt-4'>
                    <label>Message</label>
                    <input type='text' className='form-control mt-3' required name='message' {...formAttr(runform, 'message')} />
                    {errorContainer(runform, 'message')}
                  </div>
                  <div className='form-group mt-4'>
                    <label>Description</label>
                    <input type='text' className='form-control mt-3' required name='description' {...formAttr(runform, 'description')} />
                    {errorContainer(runform, 'description')}
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
    </div>
  )
}

export default SendMessage
