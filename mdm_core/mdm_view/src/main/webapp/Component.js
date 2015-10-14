jQuery.sap.declare("uni.mannheim.mdm.Component");

sap.ui.core.UIComponent.extend("uni.mannheim.mdm.Component", {
	metadata : {
		routing : {
			config : {
				viewType : "XML",
				viewPath : "uni.mannheim.mdm.view",
				targetControl : "main",
				targetAggregation : "pages",
				clearTarget : false
			},
			routes : [ {
				pattern : "",
				name : "Overview",
				view : "Overview"
			}, {
				pattern : "masterdata/overview",
				name : "masterdata.Overview",
				view : "masterdata.Overview",
			}, {
				pattern : "masterdata/customer/details",
				name : "masterdata.CustomerDetails",
				view : "masterdata.CustomerDetails",
				viewType : "JS"
			}, {
				pattern : "masterdata/customer/overview",
				name : "masterdata.CustomerOverview",
				view : "masterdata.CustomerOverview",
				viewType : "JS"
			}, {
				pattern : "import/overview",
				name : "import.Overview",
				view : "import.Overview"
			},
			{
				pattern : "import/ManualImporter",
				name : "import.ManualImporter",
				view : "import.ManualImporter"
			}]
		}
	}
});

uni.mannheim.mdm.Component.prototype.init = function() {
	jQuery.sap.require("sap.ui.core.routing.History");
	jQuery.sap.require("sap.m.routing.RouteMatchedHandler");

	sap.ui.core.UIComponent.prototype.init.apply(this);

	var router = this.getRouter();
	this.routeHandler = new sap.m.routing.RouteMatchedHandler(router);
	router.initialize();
};

uni.mannheim.mdm.Component.prototype.destroy = function() {

	if (this.routeHandler) {
		this.routeHandler.destroy();
	}

	sap.ui.core.UIComponent.destroy.apply(this, arguments);
};

uni.mannheim.mdm.Component.prototype.createContent = function() {
	this.view = sap.ui.view({
		id : "app",
		viewName : "uni.mannheim.mdm.view.App",
		type : sap.ui.core.mvc.ViewType.XML
	});

	return this.view;
};