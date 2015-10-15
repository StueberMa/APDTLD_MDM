sap.ui.controller("uni.mannheim.mdm.controller.masterdata.CustomerOverview", {

	/**
	 * Method onInit
	 */
	onInit : function() {
		var sOrigin = window.location.protocol + "//"
				+ window.location.hostname
				+ (window.location.port ? ":" + window.location.port : "");

		var customerListOdataServiceUrl = sOrigin
				+ "/mdm_view/services/customer.svc";

		var odataModel = new sap.ui.model.odata.ODataModel(
				customerListOdataServiceUrl);

		odataModel.setCountSupported(false);
		this.getView().setModel(odataModel);
	},
	
	/**
	 * Method onEditCustomer
	 */
	onEditCustomer : function() {
		
	},
	
	/**
	 * Method onDisplayCustomer
	 */
	onDisplayCustomer : function() {
		
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