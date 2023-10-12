import React from 'react'
import {errorContainer, formAttr} from '../commonFun'
import {Formik} from 'formik'
import * as Yup from 'yup'

interface IPROPS {
  update?: any
  gatewayInfo?: any
  submitFormData?: any
  updateGateway?: any
  appModalClose?: any
}

const AddPaymentGateway: React.FC<IPROPS> = ({update, gatewayInfo, submitFormData, updateGateway, appModalClose}) => {
  return (
    <div>
      <div className='modal-content'>
        <div className='modal-header'>
          <h4 className='modal-title' id='edit-one'>
            {update ? 'Edit Gateway' : 'Add Gateway'}
          </h4>
          <button type='button' className='btn-close' onClick={appModalClose}></button>
        </div>
        <div className='modal-body'>
          <Formik
            enableReinitialize
            initialValues={{
              _id: gatewayInfo && gatewayInfo?._id,
              payment_getway: gatewayInfo?.payment_getway || '',
            }}
            validationSchema={Yup.object({
              payment_getway: Yup.string().required('required.'),
            })}
            onSubmit={(formData, {resetForm}) => {
              update ? updateGateway(formData) : submitFormData(formData)
            }}
          >
            {(runform) => (
              <form onSubmit={runform.handleSubmit}>
                <input type='hidden' name='_token' defaultValue='7g2ETyfzgFyhJxwuYSAx3519NJ6eTka72A8J3y60' /> <input id='paymentId' name='id' className='form-control' type='hidden' defaultValue={5} />
                <div className='form-group'>
                  <label>Title</label>
                  <input type='text' className='form-control mt-4' name='payment_getway' id='payment-name' {...formAttr(runform, 'payment_getway')} />
                  {errorContainer(runform, 'payment_getway')}
                </div>
                <button type='submit' className='btn-comn-submit mt-5'>
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

export default AddPaymentGateway
