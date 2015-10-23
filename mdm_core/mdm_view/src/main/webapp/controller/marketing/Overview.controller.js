sap.ui.controller("uni.mannheim.mdm.controller.marketing.Overview", {
	
	/**
	 * Method onLeadOverview
	 */
	onLeadOverview : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("marketing.LeadOverview", false);
	},
	
});