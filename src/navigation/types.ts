export type RootStackParamList = {
    Splash: undefined;
    Auth: undefined;
    Menu: undefined;
    Profile: undefined;
    Cart: undefined;
    Checkout: undefined;
    OrdersList: undefined;
    OrderDetail: { orderId: string };
    MenuItemDetail: { itemId: string };
    Notifications: undefined;
    Security: undefined;
    ReportProblem: undefined;
    HelpCenter: undefined;
    OrderFeedback: { orderId: string };
};
