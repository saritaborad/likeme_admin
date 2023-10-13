export const ApiBaseUrl = process.env.REACT_APP_API_URL
export const ImgUrl = process.env.REACT_APP_BACKEND_URL
export const API_PATH = {
  login: ApiBaseUrl + '/login',
  register: ApiBaseUrl + '/register',
  getUserByToken: ApiBaseUrl + '/verify_token',

  // image review
  fetchAllImageReview: ApiBaseUrl + '/fetchAllImageReview',
  acceptImageReview: ApiBaseUrl + '/acceptImageReview',
  rejectImageReview: ApiBaseUrl + '/rejectImageReview',

  // video review
  fetchAllVideoReview: ApiBaseUrl + '/fetchAllVideoReview',
  acceptVideoReview: ApiBaseUrl + '/acceptVideoReview',
  rejectVideoReview: ApiBaseUrl + '/rejectVideoReview',

  // user
  fetchAllUser: ApiBaseUrl + '/fetchAllUser',
  userblock: ApiBaseUrl + '/userblock',
  AddCoin: ApiBaseUrl + '/AddCoin',

  // host
  fetchHosts: ApiBaseUrl + '/fetchHosts',
  featureUpdate: ApiBaseUrl + '/featureUpdate',
  blockUnblockHost: ApiBaseUrl + '/blockUnblockHost',
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

  // host apps
  fetchHostApplications: ApiBaseUrl + '/fetchHostApplications',

  // agent
  fetchAllagent: ApiBaseUrl + '/fetchAllagent',
  fetchAgentById: ApiBaseUrl + '/fetchAgentById',
  deleteAgent: ApiBaseUrl + '/deleteAgent',
  addAgent: ApiBaseUrl + '/addAgent',
  editAgent: ApiBaseUrl + '/editAgent',
  fetchAllHostHistory: ApiBaseUrl + '/fetchAllHostHistory',
  getAgentHosts: ApiBaseUrl + '/getAgentHosts',
  getHostAgents: ApiBaseUrl + '/getHostAgents',
  fetchAllStreamHistory: ApiBaseUrl + '/fetchAllStreamHistory',
  fetchStreamHistoryDayWise: ApiBaseUrl + '/fetchStreamHistoryDayWise',
  fetchHostSummary: ApiBaseUrl + '/fetchHostSummary',

  uploadImg: ImgUrl + 'upload/img',
  uploadVideo: ImgUrl + 'upload/video',

  // gift
  fetchAllgifts: ApiBaseUrl + '/fetchAllgifts',
  addGifts: ApiBaseUrl + '/addGifts',
  editGift: ApiBaseUrl + '/editGift',
  deleteGift: ApiBaseUrl + '/deleteGift',

  // country
  fetchAllCountry: ApiBaseUrl + '/fetchAllCountry',
  addCountry: ApiBaseUrl + '/addCountry',
  updateCountry: ApiBaseUrl + '/updateCountry',
  deleteCountry: ApiBaseUrl + '/deleteCountry',

  // notification
  fetchAllNotification: ApiBaseUrl + '/fetchAllNotification',
  updateNotification: ApiBaseUrl + '/updateNotification',
  deleteNotificationyById: ApiBaseUrl + '/deleteNotificationyById',
  sendNotification: ApiBaseUrl + '/sendNotification',
  notiSortPurchased: ApiBaseUrl + '/notiSortPurchased',

  // reports
  fetchReports: ApiBaseUrl + '/fetchReports',
  deleteReport: ApiBaseUrl + '/deleteReport',
  hostblock: ApiBaseUrl + '/hostblock',

  // payment gateway
  fetchAllPayment: ApiBaseUrl + '/fetchAllPayment',
  addPayment: ApiBaseUrl + '/addPayment',
  updatePayment: ApiBaseUrl + '/updatePayment',
  deletePaymentById: ApiBaseUrl + '/deletePaymentById',

  // coin plan
  fetchAllCoinPlans: ApiBaseUrl + '/fetchAllCoinPlans',
  addSubcription: ApiBaseUrl + '/addSubcription',
  deleteSubcriptionById: ApiBaseUrl + '/deleteSubcriptionById',
  updateSubcription: ApiBaseUrl + '/updateSubcription',
  default_flag: ApiBaseUrl + '/default_flag',

  // user purchase
  fetchAllPurchaseHistory: ApiBaseUrl + '/fetchAllPurchaseHistory',
  fetchAllSpendHistory: ApiBaseUrl + '/fetchAllSpendHistory',
  getPackageName: ApiBaseUrl + '/getPackageName',
  fetchAllSortPurchased: ApiBaseUrl + '/fetchAllSortPurchased',

  // notification credential
  getNotificationCredential: ApiBaseUrl + '/getNotificationCredential',
  updateNotificationCredential: ApiBaseUrl + '/updateNotificationCredential',
  deleteNotificationCredential: ApiBaseUrl + '/deleteNotificationCredential',
  addNotificationCredential: ApiBaseUrl + '/addNotificationCredential',

  // notifiction content
  addNotificationAdmin: ApiBaseUrl + '/addNotificationAdmin',
  fetchNotificationAdmin: ApiBaseUrl + '/fetchNotificationAdmin',
  updateNotificationAdmin: ApiBaseUrl + '/updateNotificationAdmin',
  deleteNotificationAdmin: ApiBaseUrl + '/deleteNotificationAdmin',

  // message
  fetchAllMessages: ApiBaseUrl + '/fetchAllMessages',
  addMessage: ApiBaseUrl + '/addMessage',
  deleteMessageById: ApiBaseUrl + '/deleteMessageById',

  // report
  fetchAllReportReson: ApiBaseUrl + '/fetchAllReportReson',
  addReportReson: ApiBaseUrl + '/addReportReson',
  updateReportReson: ApiBaseUrl + '/updateReportReson',
  deleteReportReson: ApiBaseUrl + '/deleteReportReson',

  //  setting
  getSettingData: ApiBaseUrl + '/getSettingData',
  updateSettingApp: ApiBaseUrl + '/updateSettingApp',
  updateAdmob: ApiBaseUrl + '/updateAdmob',
  getAdmob: ApiBaseUrl + '/getAdmob',

  // redeem
  fetchAllRedeems: ApiBaseUrl + '/fetchAllRedeems',
  completeRedeem: ApiBaseUrl + '/completeRedeem',
  rejectRedeem: ApiBaseUrl + '/rejectRedeem',

  //  pages
  addPageData: ApiBaseUrl + '/addPageData',
  getPageData: ApiBaseUrl + '/getPageData',
  editAgoraToken: ApiBaseUrl + '/editAgoraToken',

  //  dashboard
  fetchDashboardCount: ApiBaseUrl + '/fetchDashboardCount',
  fetchAgentDashboard: ApiBaseUrl + '/fetchAgentDashboard',
}
