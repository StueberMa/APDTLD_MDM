sap.ui.controller("uni.mannheim.mdm.controller.masterdata.Overview", {
	
	onCustomerOverview:function(){
		
	},

	onBack : function () {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("Overview", false);
	}
});