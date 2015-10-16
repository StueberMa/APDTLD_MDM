sap.ui.controller("uni.mannheim.mdm.controller.masterdata.CustomerOverview", {
	
	/**
	 * Method onNewCustomer
	 */
	onNewCustomer : function () {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("masterdata.CustomerDetails", false);
	}
});