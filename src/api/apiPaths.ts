export const apiPaths = {
  // AUTH
  validateJwt: "Account/Auth/validateJWT",

  // FINANCIAL.TS:
  account: "/Account",
  userWallet: "Account/UserWallets",
  voucher: "Account/Voucher",
  cancelVoucher: "Account/cancelVoucher",
  increaseCredit: "Account/UserWallets/requestIncrease",
  transctions: "Account/WalletTransactions",
  requestWithdraw: "Account/UserWallets/requestWithdrawal",
  claimOfflinePayment: "Account/claimOfflinePayment",

  // USER.TS:
  changePassByUuid: "Account/changePassByUUID",
  changePassByOldPass: "Account/changePass",
  approveEmail: "Account/approveEmail",
  createForgotPasswordLink: "Account/createForgotPasswordLink",
  signUp: "Account/signup",
  logIn: "Account/login",
  loginByMobileOnly: "Account/loginByMobileOnly",
  loginByOAuth: "Account/loginByOAuth",
  ResendApprovalCode: "Account/resendApprovalCode",
  approveMobile: "Account/approveMobile",
  activeSessions: "Account/ActiveSessions",
  roles: "Account/Roles",
  service: "Account/Service",
  user: "Account/User",
  deleteAccount: "Account/User",
  updateUserEmail: "Account/User/email",
  updateUserExtraInfo: "Account/User/extraInfo",
  updateUserMobile: "Account/User/mobile",
  updateUserPersonalInfo: "Account/User/personalInfo",
  userPhoto: "Account/User/photo",
  userProfile: "Account/User/profile",
  updateUsersPhoto: "Account/User/photo",
  deletePhoto: "Account/User/deletePhoto",
  updateUserFinancialInfo: "Account/User/financialInfo", // ether & iban
  userWallets: "Account/UserWallets",
  userWalletsDefault: "Account/UserWallets/defaultWallet",
  userWalletsTransfer: "Account/UserWallets/transfer",

  // API.TS:
  apiUrl: process.env.VUE_APP_BASE_API_URL!,

  // ADVERT.TS:
  advert: "Advert",
  advertAddToBasket: "Advert/addToBasket",
  advertNewBanner: "Advert/newBanner",
  advertNewText: "Advert/newText",
  advertRetrieveUrl: "Advert/retrieveURL",
  advertAccountUserAssets: "Advert/AccountUserAssets",
  advertAccountAssetusage: "Advert/AccountAssetUsage",
  advertAccountCoupons: "Advert/AccountCoupons",
  advertAccountProducts: "Advert/AccountProducts",
  advertAccountSaleables: "Advert/AccountSaleables",
  advertAccountLocations: "Advert/AccountLocations",
  advertLocations: "Advert/Locations",

  // BASKET
  removeBasketItem: "Advert/removeBasketItem",
  updateBasketItem: "Advert/updateBasketItem",
  finalizeBasket: "Account/finalizeBasket",
  paymentGateways: "Account/PaymentGateways/availableGatewayTypes",
  payForBasket: "Account/payForBasket",

  // Currency:
  getCurrency: "Account/Currency",
  setCurrencyAsDefault: "Account/Currency/setAsDefault",

  // PAYMENT:
  accountOfflinePayments: "Account/offlinePayments",
  accountOnlinePayments: "Account/OnlinePayments",
  accountPaymentsGateways: "Account/PaymentGateways",
  approveOnlinePayment: "Account/approveOnlinePayment",

  // TICKETS:
  ticketingNewFeedback: "Ticketing/newFeedback",
  ticketingNewMessage: "Ticketing/newMessage",
  ticketingTickets: "Ticketing/Tickets",
  ticketingDepartments: "Ticketing/Departments",
  ticketingUnits: "Ticketing/Units"
}
