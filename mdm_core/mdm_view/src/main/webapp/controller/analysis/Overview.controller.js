sap.ui.controller("uni.mannheim.mdm.controller.analysis.Overview", {
	
	/**
	 * Method onInit
	 */
	onInit : function() {
		
		// router
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.attachRouteMatched(this.onRequest, this);
	},
	
	/**
	 * Method onCustomerPerCountry
	 */
	onCustomerPerCountry : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("analysis.CustomersPerCountry", false);
	},
	
	/**
	 * Method onRequest
	 */
	onRequest : function(oEvent) {
		
		if (oEvent.getParameter("name") === "analysis.Overview") {
			
			// count objects
			var jsonModel = new sap.ui.model.json.JSONModel("./services/analysis/customer/overview")
			this.getView().setModel(jsonModel, "custOverview");
		}
	}

});