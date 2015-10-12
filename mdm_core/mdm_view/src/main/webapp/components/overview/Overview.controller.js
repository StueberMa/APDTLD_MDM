sap.ui.define([
		'jquery.sap.global',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel'
	], function(jQuery, Controller, JSONModel) {
	"use strict";

	var PageController = Controller.extend("uni.mannheim.mdm.components.overview.Overview", {

		onInit : function (evt) {
			var sPath = jQuery.sap.getModulePath("uni.mannheim.mdm.components.overview", "/data.json");
			var oModel = new JSONModel(sPath);
			this.getView().setModel(oModel);
		},
		
		onClick : function (evt) {
             sap.m.MessageToast.show("Generic tile is pressed.");
     }
	});

	return PageController;
});