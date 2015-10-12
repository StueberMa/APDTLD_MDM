sap.ui.define([
		'jquery.sap.global',
		'sap/m/MessageToast',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel'
	], function(jQuery, MessageToast, Controller, JSONModel) {
	"use strict";

	var ControllerController = Controller.extend("uni.mannheim.mdm.components.container.Container", {
		
		onInit: function() {
			var oData = {logo: jQuery.sap.getModulePath("sap.ui.core", '/') + "mimes/logo/sap_50x26.png"};
			var oModel = new JSONModel();
			oModel.setData(oData);
			this.getView().setModel(oModel);
		},

		onLogout: function(oEvent) {
			MessageToast.show("Logoff Button Pressed");
		},

		onUserItem: function(oEvent) {
			MessageToast.show("User Button Pressed");
		}
	});

	return ControllerController;

});