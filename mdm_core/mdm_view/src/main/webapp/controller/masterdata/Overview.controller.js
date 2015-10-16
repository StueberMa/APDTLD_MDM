sap.ui.controller("uni.mannheim.mdm.controller.masterdata.Overview", {

	/**
	 * Method onCustomerOverview
	 */
	onCustomerOverview : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("masterdata.CustomerOverview", false);
	}
});