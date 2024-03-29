sap.ui.controller("uni.mannheim.mdm.controller.masterdata.Overview", {
	
	/**
	 * Method onInit
	 */
	onInit : function() {
		
		// router
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.attachRouteMatched(this.onRequest, this);
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
	},
	
	/**
	 * Method onRequest
	 */
	onRequest : function(oEvent) {
		
		if (oEvent.getParameter("name") === "masterdata.Overview") {
			
			// count objects
			var jsonModel = new sap.ui.model.json.JSONModel("./services/info/count")
			this.getView().setModel(jsonModel, "masterdata");
		}
	}
});