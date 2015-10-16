sap.ui.controller("uni.mannheim.mdm.controller.masterdata.CustomerOverview", {
	
	/**
	 * Method onNavTargetsObtained
	 */
	onNavTargetsObtained: function(oEvent){
		console.log("onNavTargetsObtained");
	},
	
	/**
	 * Method onNavigate
	 */
	onNavigate: function(oEvent){
		console.log("onNavigate");
	},
	
	/**
	 * Method onBack
	 */
	onBack : function () {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("masterdata.Overview", false);
	},
	
	/**
	 * Method onNewCustomer
	 */
	onNewCustomer : function () {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("masterdata.CustomerDetails", false);
	}
});