sap.ui.controller("uni.mannheim.mdm.controller.analysis.Overview", {
	
	/**
	 * Method onCustomerPerCountry
	 */
	onCustomerPerCountry : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("analysis.CustomersPerCountry", false);
	}

});