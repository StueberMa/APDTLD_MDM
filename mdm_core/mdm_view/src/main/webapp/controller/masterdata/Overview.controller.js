sap.ui.controller("uni.mannheim.mdm.controller.masterdata.Overview", {
	
	/**
	 * Method onInit
	 */
	onInit : function() {
		
		// count objects
		var model = this.getOwnerComponent().getModel();
		var customerCount = model.bindList("/Customers").getLength();
		var productCount = model.bindList("/Products").getLength();
		
		// set model
		var jsonModel = new sap.ui.model.json.JSONModel();
		jsonModel.setData( {
			customers: customerCount,
			products : productCount
		});
		this.getView().setModel(jsonModel, "masterdata");
	},
	
	/**
	 * Method onCustomerOverview
	 */
	onCustomerOverview : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("masterdata.CustomerOverview", false);
	},

	/**
	 * Method onProductOverview
	 */
	onProductOverview : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("masterdata.ProductOverview", false);
	}
	
});