sap.ui.controller("uni.mannheim.mdm.controller.App", {

	/**
	 * Method onInit
	 */
	onInit : function() {
		
		// model
		this._model = this.getOwnerComponent().getModel();
		this._model.setDefaultBindingMode("TwoWay");
		
		// routing
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.attachRouteMatched(this.controllNavButton, this);
	},
	
	/**
	 * Method onExit
	 */
	onExit : function() {
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.detachRouteMatched(this.controllNavButton, this);
	},

	/**
	 * Method onBack
	 */
	onBack : function() {
		var oHistory = sap.ui.core.routing.History.getInstance();
		var sPreviousHash = oHistory.getPreviousHash();

		// history: go to prev. page
		if (sPreviousHash !== undefined) {
			window.history.go(-1);
		} else {
			var router = this.getOwnerComponent().getRouter();
			router.navTo("Overview", false);
		}
	},

	/**
	 * Method onOverview
	 */
	onOverview : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("Overview", false);
	},
	
	/**
	 * Method onAnalysisOverview
	 */
	onAnalysisOverview : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("analysis.Overview", false);
	},
	
	/**
	 * Method onMarketingDataOverview
	 */
	onMarketingOverview : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("marketing.Overview", false);
	},

	/**
	 * Method onMasterDataOverview
	 */
	onMasterDataOverview : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("masterdata.Overview", false);
	},

	/**
	 * Method onDataImportOverview
	 */
	onDataImportOverview : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("import.Overview", false);
	},

	/**
	 * Method controllNavButton
	 */
	controllNavButton : function(oEvent) {
		var navButton = this.getView().byId("navBack");
		
		if (oEvent.getParameter("name") === "Overview") {
			navButton.setVisible(false);
        } else {
        	navButton.setVisible(true);
        }
	}
});