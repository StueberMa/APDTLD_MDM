sap.ui.controller("uni.mannheim.mdm.controller.Overview", {

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
	 * Method onMarketingOverview
	 */
	onMarketingOverview : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("marketing.Overview", false);
	}
});