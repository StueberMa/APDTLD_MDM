sap.ui.controller("uni.mannheim.mdm.controller.Overview", {
	
	/**
	 * Method onCampaignOverview
	 */
	onCampaignOverview : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("marketing.CampaignOverview", false);
	},
	
	/**
	 * Method onCustomerOverview
	 */
	onCustomerOverview : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("masterdata.CustomerOverview", false);
	},
	
	/**
	 * Method onDataImportOverview
	 */
	onDataImportOverview : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("import.Overview", false);
	},
	
	/**
	 * Method onFileUpload
	 */
	onFileUpload : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("import.Uploader", false);
	},
	
	/**
	 * Method onLeadOverview
	 */
	onLeadOverview : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("marketing.LeadOverview", false);
	},
	
	/**
	 * Method onMarketingOverview
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
	 * Method onProductOverview
	 */
	onProductOverview : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("masterdata.ProductOverview", false);
	}
});