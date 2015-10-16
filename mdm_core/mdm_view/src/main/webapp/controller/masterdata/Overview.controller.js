sap.ui.controller("uni.mannheim.mdm.controller.masterdata.Overview", {
	
	onCustomerOverview:function(){
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("masterdata.CustomerOverview", false);
	},

	onBack : function () {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("Overview", false);
	}
});