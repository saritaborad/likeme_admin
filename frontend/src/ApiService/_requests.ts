import axios from 'axios'
import {API_PATH} from '../const'
import {AuthModel, UserModel} from '../app/modules/auth'
import {AnyMessageParams} from 'yup/lib/types'

// --------------------- Auth Api Routes ----------------------

export function login(username: string, password: string, user_type: string, rememberme: boolean) {
  return axios.post<AuthModel>(API_PATH.login, {username, password, user_type, rememberme}, {withCredentials: true})
}

export function register(email: string, firstname: string, lastname: string, password: string) {
  return axios.post(API_PATH.register, {email, firstname: firstname, lastname: lastname, password})
}

export function getUserByToken(token: string) {
  return axios.post<UserModel>(API_PATH.getUserByToken, {authtoken: token})
}

// --------------------- Image Review Api Routes ----------------------

export function fetchAllImageReview() {
  return axios.post(API_PATH.fetchAllImageReview).then((res) => res.data)
}

export function acceptImageReview(_id: string) {
  return axios.post(API_PATH.acceptImageReview, {_id}).then((res) => res)
}

export function rejectImageReview(_id: string) {
  return axios.post(API_PATH.rejectImageReview, {_id}).then((res) => res)
}

// --------------------- Video Review Api Routes ----------------------

export function fetchAllVideoReview() {
  return axios.post(API_PATH.fetchAllVideoReview).then((res) => res.data)
}

export function acceptVideoReview(_id: string) {
  return axios.post(API_PATH.acceptVideoReview, {_id}).then((res) => res)
}

export function rejectVideoReview(_id: string) {
  return axios.post(API_PATH.rejectVideoReview, {_id}).then((res) => res)
}

// --------------------- User Api Routes ----------------------

export function getAllUser(option?: any) {
  return axios.post(API_PATH.fetchAllUser, option).then((res) => res.data)
}

export function userblock(_id: string, is_block: number) {
  return axios.post(API_PATH.userblock, {_id, is_block}).then((res) => res)
}

export function AddUserCoin(formData: any) {
  return axios.post(API_PATH.AddCoin, formData).then((res) => res)
}

// --------------------- Host Api Routes ----------------------

export function fetchHosts(option?: any) {
  return axios.post(API_PATH.fetchHosts, option).then((res) => res.data)
}

export function featureUpdate(_id: string, is_feature: number) {
  return axios.post(API_PATH.featureUpdate, {_id, is_feature}).then((res) => res)
}

export function fetchHostVideos(option?: any) {
  return axios.post(API_PATH.fetchHostVideos, option).then((res) => res.data)
}

export function fetchHostImages(option?: any) {
  return axios.post(API_PATH.fetchHostImages, option).then((res) => res.data)
}

export function deleteImageById(_id: string) {
  return axios.post(API_PATH.deleteImageById, {_id}).then((res) => res)
}

export function deleteVideoById(_id: string) {
  return axios.post(API_PATH.deleteVideoById, {_id}).then((res) => res)
}

export function deleteHostById(_id: string) {
  return axios.post(API_PATH.deleteHostById, {_id}).then((res) => res)
}

export function hostById(_id: string) {
  return axios.post(API_PATH.hostById, {_id}).then((res) => res.data)
}

export function hostUpdate(data: any) {
  return axios.post(API_PATH.hostUpdate, data).then((res) => res)
}

export function addHostImages(formData: any) {
  return axios.post(API_PATH.addHostImages, formData).then((res) => res)
}

export function addHostVideo(formData: any) {
  return axios.post(API_PATH.addHostVideos, formData).then((res) => res)
}

export function addfakeUser(formData: any) {
  return axios.post(API_PATH.addfakeUser, formData).then((res) => res)
}

export function blockUnblockHost(user_id: string, is_block: number) {
  return axios.post(API_PATH.blockUnblockHost, {user_id, is_block}).then((res) => res)
}

// export function unblockHost(user_id: string, host_id: string) {
//   return axios.post(API_PATH.unblockHost, {user_id, host_id}).then((res) => res)
// }

export function makeHost(_id: string) {
  return axios.post(API_PATH.makeHost, {_id}).then((res) => res)
}

// --------------------- Host Application Api Routes ----------------------

export function fetchHostApplications(option?: any) {
  return axios.post(API_PATH.fetchHostApplications, option).then((res) => res.data)
}

export function RejectHost(_id: string) {
  return axios.post(API_PATH.RejectHost, {_id}).then((res) => res)
}

// --------------------- Agent Api Routes ----------------------

export function fetchAllagents(option?: any) {
  return axios.post(API_PATH.fetchAllagent, option).then((res) => res.data)
}

export function editAgent(formData: any) {
  return axios.post(API_PATH.editAgent, formData).then((res) => res)
}

export function deleteAgent(_id: string) {
  return axios.post(API_PATH.deleteAgent, {_id}).then((res) => res)
}

export function addAgent(formData: any) {
  return axios.post(API_PATH.addAgent, formData).then((res) => res)
}

export function fetchAllHostHistory(option?: any) {
  return axios.post(API_PATH.fetchAllHostHistory, option).then((res) => res.data)
}

export function getAgentHosts(_id: string) {
  return axios.post(API_PATH.getAgentHosts, {_id}).then((res) => res.data)
}

export function fetchAllStreamHistory(option?: any) {
  return axios.post(API_PATH.fetchAllStreamHistory, option).then((res) => res.data)
}

export function fetchStreamHistoryDayWise(formData?: any) {
  return axios.post(API_PATH.fetchStreamHistoryDayWise, formData).then((res) => res.data)
}

export function fetchHostSummary(formData?: any) {
  return axios.post(API_PATH.fetchHostSummary, formData).then((res) => res.data)
}

// --------------------- Image upload Api Routes ----------------------

export function uploadImg(formData: any) {
  return axios.post(API_PATH.uploadImg, formData).then((res) => res.data)
}

// --------------------- Gift Api Routes ----------------------

export function fetchAllgifts(option?: any) {
  return axios.post(API_PATH.fetchAllgifts, {...option}).then((res) => res.data)
}

export function addGifts(formData: any) {
  return axios.post(API_PATH.addGifts, formData).then((res) => res)
}

export function editGift(formData: any) {
  return axios.post(API_PATH.editGift, formData).then((res) => res)
}

export function deleteGift(_id: string) {
  return axios.post(API_PATH.deleteGift, {_id}).then((res) => res)
}

// --------------------- Country Api Routes ----------------------

export function fetchAllCountry(option?: any) {
  return axios.post(API_PATH.fetchAllCountry, {...option}).then((res) => res.data)
}

export function addCountryData(data: any) {
  return axios.post(API_PATH.addCountry, data).then((res) => res)
}

export function editCountryData(data: any) {
  return axios.post(API_PATH.updateCountry, data).then((res) => res)
}

export function deleteCountryData(_id: string) {
  return axios.post(API_PATH.deleteCountry, {_id}).then((res) => res)
}

// --------------------- Country Api Routes ----------------------

export function fetchNotificationData(option?: any) {
  return axios.post(API_PATH.fetchAllNotification, option).then((res) => res.data)
}

export function updateNotification(formData: any) {
  return axios.post(API_PATH.updateNotification, formData).then((res) => res)
}

export function deleteNotificationyById(_id: string) {
  return axios.post(API_PATH.deleteNotificationyById, {_id}).then((res) => res)
}

export function sendNotification(formData?: any) {
  return axios.post(API_PATH.sendNotification, formData).then((res) => res)
}

// --------------------- Report Api Routes ----------------------

export function fetchReports(option?: any) {
  return axios.post(API_PATH.fetchReports, option).then((res) => res.data)
}

export function deleteReport(_id: string) {
  return axios.post(API_PATH.deleteReport, {_id}).then((res) => res)
}

export function hostblock(_id: string) {
  return axios.post(API_PATH.hostblock, {_id}).then((res) => res)
}

// --------------------- Payment Gateway Api Routes ----------------------

export function fetchAllPayment(option?: any) {
  return axios.post(API_PATH.fetchAllPayment, option).then((res) => res.data)
}

export function addPayment(formData: any) {
  return axios.post(API_PATH.addPayment, formData).then((res) => res)
}

export function updatePayment(formData: any) {
  return axios.post(API_PATH.updatePayment, formData).then((res) => res)
}

export function deletePaymentById(_id: string) {
  return axios.post(API_PATH.deletePaymentById, {_id}).then((res) => res)
}

// --------------------- Coin plan Api Routes ----------------------

export function fetchAllCoinPlans(option?: any) {
  return axios.post(API_PATH.fetchAllCoinPlans, option).then((res) => res.data)
}

export function deleteSubcriptionById(_id: string) {
  return axios.post(API_PATH.deleteSubcriptionById, {_id}).then((res) => res)
}

export function addSubcription(formData: any) {
  return axios.post(API_PATH.addSubcription, formData).then((res) => res)
}

export function updateSubcription(formData: any) {
  return axios.post(API_PATH.updateSubcription, formData).then((res) => res)
}

export function default_flag(_id: string) {
  return axios.post(API_PATH.default_flag, {_id}).then((res) => res)
}

// --------------------- User Purchase Api Routes ----------------------

export function fetchAllPurchaseHistory(option?: any) {
  return axios.post(API_PATH.fetchAllPurchaseHistory, option).then((res) => res.data)
}

export function fetchAllSpendHistory(option?: any) {
  return axios.post(API_PATH.fetchAllSpendHistory, option).then((res) => res.data)
}

export function getPackageName() {
  return axios.post(API_PATH.getPackageName).then((res) => res.data)
}

export function fetchAllSortPurchased() {
  return axios.post(API_PATH.fetchAllSortPurchased).then((res) => res.data)
}

export function notiSortPurchased(formData?: any) {
  return axios.post(API_PATH.notiSortPurchased, formData).then((res) => res.data)
}

// ------------------- notification credential -------------------------

export function getNotiCredent(option?: any) {
  return axios.post(API_PATH.getNotificationCredential, option).then((res) => res.data)
}

export function updateNotiCredent(formData: any) {
  return axios.post(API_PATH.updateNotificationCredential, formData).then((res) => res)
}

export function deleteNotiCredent(_id: string) {
  return axios.post(API_PATH.deleteNotificationCredential, {_id}).then((res) => res)
}

export function addNotiCredent(formData: any) {
  return axios.post(API_PATH.addNotificationCredential, formData).then((res) => res)
}

// ------------------------ notification content ----------------------------

export function addNotiContent(formData: any) {
  return axios.post(API_PATH.addNotificationAdmin, formData).then((res) => res)
}

export function updateNotiContent(formData: any) {
  return axios.post(API_PATH.updateNotificationAdmin, formData).then((res) => res)
}

export function deleteNotiContent(_id: string) {
  return axios.post(API_PATH.deleteNotificationAdmin, {_id}).then((res) => res)
}

export function getNotiContent(formData: any) {
  return axios.post(API_PATH.fetchNotificationAdmin, formData).then((res) => res.data)
}

// ----------------------- Message Api Route ---------------------------------

export function fetchAllMessages(formData: any) {
  return axios.post(API_PATH.fetchAllMessages, formData).then((res) => res.data)
}

export function addMessage(formData: any) {
  return axios.post(API_PATH.addMessage, formData).then((res) => res)
}

export function deleteMessageById(_id: string) {
  return axios.post(API_PATH.deleteMessageById, {_id}).then((res) => res)
}

// ------------------------- Report Reason ---------------------------------

export function fetchAllReportReson(formData: any) {
  return axios.post(API_PATH.fetchAllReportReson, formData).then((res) => res.data)
}

export function addReportReson(formData: any) {
  return axios.post(API_PATH.addReportReson, formData).then((res) => res)
}

export function updateReportReson(formData: any) {
  return axios.post(API_PATH.updateReportReson, formData).then((res) => res)
}

export function deleteReportReson(_id: any) {
  return axios.post(API_PATH.deleteReportReson, {_id}).then((res) => res)
}

// -------------------------- Setting --------------------------------------

export function getSettingData() {
  return axios.post(API_PATH.getSettingData).then((res) => res.data)
}

export function updateSettingApp(formData: any) {
  return axios.post(API_PATH.updateSettingApp, formData).then((res) => res)
}

export function updateAdmob(formData: any) {
  return axios.post(API_PATH.updateAdmob, formData).then((res) => res)
}

export function getAdmob(formData: any) {
  return axios.post(API_PATH.getAdmob, formData).then((res) => res.data)
}

// ---------------------- Redeem Request -------------------------------

export function fetchAllRedeems(formData: any) {
  return axios.post(API_PATH.fetchAllRedeems, formData).then((res) => res.data)
}

export function completeRedeem(formData: any) {
  return axios.post(API_PATH.completeRedeem, formData).then((res) => res)
}

export function rejectRedeem(_id: string) {
  return axios.post(API_PATH.rejectRedeem, {_id}).then((res) => res)
}

// ------------------------ Privacy Policy ------------------------------

export function addPageData(formData: any) {
  return axios.post(API_PATH.addPageData, formData).then((res) => res)
}

export function getPageData(formData: any) {
  return axios.post(API_PATH.getPageData, formData).then((res) => res.data)
}

// ------------------------ Dashboard -----------------------------------

export function fetchDashboardCount() {
  return axios.post(API_PATH.fetchDashboardCount).then((res) => res.data)
}
