sap.ui.controller("uni.mannheim.mdm.controller.marketing.Overview", {
	
	/**
	 * Method onInit
	 */
	onInit : function() {
		
		// router
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.attachRouteMatched(this.onRequest, this);
	},
	
	/**
	 * Method onExit
	 */
	onExit : function() {
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.detachRouteMatched(this.onRequest, this);
	},
	
	/**
	 * Method onCampaignOverview
	 */
	onCampaignOverview : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("marketing.CampaignOverview", false);
	},
	
	/**
	 * Method onLeadOverview
	 */
	onLeadOverview : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("marketing.LeadOverview", false);
	},
	
	/**
	 * Method onRequest
	 */
	onRequest : function(oEvent) {
		
		if (oEvent.getParameter("name") === "marketing.Overview") {
			
			// count objects
			var jsonModel = new sap.ui.model.json.JSONModel("./services/info/active")
			this.getView().setModel(jsonModel, "marketing");
		}
	}
	
});