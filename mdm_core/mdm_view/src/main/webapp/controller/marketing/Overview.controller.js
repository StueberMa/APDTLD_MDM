sap.ui.controller("uni.mannheim.mdm.controller.marketing.Overview", {
	
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
	
});