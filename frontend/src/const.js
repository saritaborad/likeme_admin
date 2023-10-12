export const ApiBaseUrl = process.env.REACT_APP_API_URL
export const ImgUrl = process.env.REACT_APP_BACKEND_URL
export const API_PATH = {
  login: ApiBaseUrl + '/login',
  register: ApiBaseUrl + '/register',
  getUserByToken: ApiBaseUrl + '/verify_token',

  fetchAllImageReview: ApiBaseUrl + '/fetchAllImageReview',
  acceptImageReview: ApiBaseUrl + '/acceptImageReview',
  rejectImageReview: ApiBaseUrl + '/rejectImageReview',

  fetchAllVideoReview: ApiBaseUrl + '/fetchAllVideoReview',
  acceptVideoReview: ApiBaseUrl + '/acceptVideoReview',
  rejectVideoReview: ApiBaseUrl + '/rejectVideoReview',

  fetchAllUser: ApiBaseUrl + '/fetchAllUser',
  userblock: ApiBaseUrl + '/userblock',
  AddCoin: ApiBaseUrl + '/AddCoin',

  fetchHosts: ApiBaseUrl + '/fetchHosts',
  featureUpdate: ApiBaseUrl + '/featureUpdate',
  blockUnblockHost: ApiBaseUrl + '/blockUnblockHost',
  // unblockHost: ApiBaseUrl + '/unblockHost',
  makeHost: ApiBaseUrl + '/makeHost',
  RejectHost: ApiBaseUrl + '/RejectHost',
  ImageById: ApiBaseUrl + '/ImageById',
  deleteHostById: ApiBaseUrl + '/deleteHostById',
  hostById: ApiBaseUrl + '/hostById',
  hostUpdate: ApiBaseUrl + '/hostUpdate',

  fetchHostVideos: ApiBaseUrl + '/fetchHostVideos',
  fetchHostImages: ApiBaseUrl + '/fetchHostImages',
  deleteImageById: ApiBaseUrl + '/deleteImageById',
  deleteVideoById: ApiBaseUrl + '/deleteVideoById',
  addHostImages: ApiBaseUrl + '/addHostImages',
  addHostVideos: ApiBaseUrl + '/addHostVideos',
  addfakeUser: ApiBaseUrl + '/addfakeUser',

  fetchAllagent: ApiBaseUrl + '/fetchAllagent',
  deleteAgent: ApiBaseUrl + '/deleteAgent',
  addAgent: ApiBaseUrl + '/addAgent',
  editAgent: ApiBaseUrl + '/editAgent',
  fetchAllHostHistory: ApiBaseUrl + '/fetchAllHostHistory',
  getAgentHosts: ApiBaseUrl + '/getAgentHosts',
  fetchAllStreamHistory: ApiBaseUrl + '/fetchAllStreamHistory',
  fetchStreamHistoryDayWise: ApiBaseUrl + '/fetchStreamHistoryDayWise',
  fetchHostSummary: ApiBaseUrl + '/fetchHostSummary',

  fetchHostApplications: ApiBaseUrl + '/fetchHostApplications',
  uploadImg: ImgUrl + 'upload/img',
  uploadVideo: ImgUrl + 'upload/video',

  fetchAllgifts: ApiBaseUrl + '/fetchAllgifts',
  addGifts: ApiBaseUrl + '/addGifts',
  editGift: ApiBaseUrl + '/editGift',
  deleteGift: ApiBaseUrl + '/deleteGift',

  fetchAllCountry: ApiBaseUrl + '/fetchAllCountry',
  addCountry: ApiBaseUrl + '/addCountry',
  updateCountry: ApiBaseUrl + '/updateCountry',
  deleteCountry: ApiBaseUrl + '/deleteCountry',

  fetchAllNotification: ApiBaseUrl + '/fetchAllNotification',
  updateNotification: ApiBaseUrl + '/updateNotification',
  deleteNotificationyById: ApiBaseUrl + '/deleteNotificationyById',
  sendNotification: ApiBaseUrl + '/sendNotification',
  notiSortPurchased: ApiBaseUrl + '/notiSortPurchased',

  fetchReports: ApiBaseUrl + '/fetchReports',
  deleteReport: ApiBaseUrl + '/deleteReport',
  hostblock: ApiBaseUrl + '/hostblock',

  fetchAllPayment: ApiBaseUrl + '/fetchAllPayment',
  addPayment: ApiBaseUrl + '/addPayment',
  updatePayment: ApiBaseUrl + '/updatePayment',
  deletePaymentById: ApiBaseUrl + '/deletePaymentById',

  fetchAllCoinPlans: ApiBaseUrl + '/fetchAllCoinPlans',
  addSubcription: ApiBaseUrl + '/addSubcription',
  deleteSubcriptionById: ApiBaseUrl + '/deleteSubcriptionById',
  updateSubcription: ApiBaseUrl + '/updateSubcription',
  default_flag: ApiBaseUrl + '/default_flag',

  fetchAllPurchaseHistory: ApiBaseUrl + '/fetchAllPurchaseHistory',
  fetchAllSpendHistory: ApiBaseUrl + '/fetchAllSpendHistory',
  getPackageName: ApiBaseUrl + '/getPackageName',
  fetchAllSortPurchased: ApiBaseUrl + '/fetchAllSortPurchased',

  getNotificationCredential: ApiBaseUrl + '/getNotificationCredential',
  updateNotificationCredential: ApiBaseUrl + '/updateNotificationCredential',
  deleteNotificationCredential: ApiBaseUrl + '/deleteNotificationCredential',
  addNotificationCredential: ApiBaseUrl + '/addNotificationCredential',

  addNotificationAdmin: ApiBaseUrl + '/addNotificationAdmin',
  fetchNotificationAdmin: ApiBaseUrl + '/fetchNotificationAdmin',
  updateNotificationAdmin: ApiBaseUrl + '/updateNotificationAdmin',
  deleteNotificationAdmin: ApiBaseUrl + '/deleteNotificationAdmin',

  fetchAllMessages: ApiBaseUrl + '/fetchAllMessages',
  addMessage: ApiBaseUrl + '/addMessage',
  deleteMessageById: ApiBaseUrl + '/deleteMessageById',

  fetchAllReportReson: ApiBaseUrl + '/fetchAllReportReson',
  addReportReson: ApiBaseUrl + '/addReportReson',
  updateReportReson: ApiBaseUrl + '/updateReportReson',
  deleteReportReson: ApiBaseUrl + '/deleteReportReson',

  getSettingData: ApiBaseUrl + '/getSettingData',
  updateSettingApp: ApiBaseUrl + '/updateSettingApp',
  updateAdmob: ApiBaseUrl + '/updateAdmob',
  getAdmob: ApiBaseUrl + '/getAdmob',

  fetchAllRedeems: ApiBaseUrl + '/fetchAllRedeems',
  completeRedeem: ApiBaseUrl + '/completeRedeem',
  rejectRedeem: ApiBaseUrl + '/rejectRedeem',

  addPageData: ApiBaseUrl + '/addPageData',
  getPageData: ApiBaseUrl + '/getPageData',
  editAgoraToken: ApiBaseUrl + '/editAgoraToken',

  fetchDashboardCount: ApiBaseUrl + '/fetchDashboardCount',
}
