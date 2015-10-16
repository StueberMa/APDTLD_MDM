jQuery.sap.declare("uni.mannheim.mdm.Component");

sap.ui.core.UIComponent.extend("uni.mannheim.mdm.Component", {
	metadata : {
		manifest : "json"
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