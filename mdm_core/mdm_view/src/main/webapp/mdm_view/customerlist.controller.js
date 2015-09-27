sap.ui.controller("mdm_view.customerlist", {

	/**
	 * Method onInit.
	 */
	onInit : function() {
		var sOrigin = window.location.protocol + "//"
				+ window.location.hostname
				+ (window.location.port ? ":" + window.location.port : "");

		var customerListOdataServiceUrl = sOrigin
				+ "/mdm_view/customer.svc";

		var odataModel = new sap.ui.model.odata.ODataModel(
				customerListOdataServiceUrl);

		odataModel.setCountSupported(false);
		this.getView().setModel(odataModel);
	},
	
	/**
	 * Method addNewCustomer.
	 */
	addNewCustomer : function(sFirstName, sLastName, oTable) {
		var customers = {};

		customers.FirstName = sFirstName;
		customers.LastName = sLastName;

		this.getView().getModel().create("/Customers", customers, null,
				this.successMsg, this.errorMsg);
	},
	
	/**
	 * Method successMsg.
	 */
	successMsg : function() {
		sap.ui.commons.MessageBox
				.alert("Customer entity has been successfully created");
	},
	
	/**
	 * Method errorMsg.
	 */
	errorMsg : function() {
		sap.ui.commons.MessageBox
				.alert("Error occured when creating customer entity");
	}
});