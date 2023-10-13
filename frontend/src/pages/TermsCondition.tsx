import {useEffect, useRef, useState} from 'react'
import {CKEditor} from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import {uploadPlugin} from '../plugins/uploadPlugin'
import {errorContainer} from '../commonFun'
import {Formik} from 'formik'
import * as Yup from 'yup'
import {addPageData, getPageData} from '../ApiService/_requests'
import {toast} from 'react-toastify'
import {useAuth} from '../app/modules/auth'

const TermsCondition: React.FC = () => {
  const [description, setDescription] = useState('')
  const termsRef: any = useRef()
  const {currentUser} = useAuth()

  useEffect(() => {
    getPage()
  }, [])

  const getPage = async () => {
    const {data} = await getPageData({type: 0})
    setDescription(data?.terms_of_use || '')
  }

  const inputHandler = (event: any, editor: any) => {
    setDescription(editor.getData())
    termsRef?.current?.setFieldValue('description', editor.getData())
  }

  const submitForm = async (formData: any) => {
    const {data} = await addPageData(formData)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
  }

  return (
    <>
      <div className='col-12 card-shadow'>
        <div className='card '>
          <div className='card-header d-flex align-items-center'>
            <h1>Terms & Condition</h1>
          </div>
          <div className='card-body'>
            <Formik innerRef={termsRef} enableReinitialize initialValues={{description: description || '', type: 0}} validationSchema={Yup.object({description: Yup.string().required('Description is required.')})} onSubmit={(formData, {resetForm}) => submitForm(formData)}>
              {(runform) => (
                <form onSubmit={runform.handleSubmit}>
                  <div className='form-group'>
                    <CKEditor
                      id='inputText'
                      data={description}
                      config={{
                        extraPlugins: [uploadPlugin],
                        link: {
                          defaultProtocol: 'http://',
                        },
                      }}
                      editor={ClassicEditor}
                      onChange={inputHandler}
                    />
                    {errorContainer(runform, 'description')}
                  </div>
                  {!currentUser?.is_tester && (
                    <button type='submit' className='btn-comn-submit mt-5'>
                      Submit
                    </button>
                  )}
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  )
}

export default TermsCondition
