sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/vbm/AnalyticMap"
	],
	
	function(Controller, AnalyticMap) {
		"use strict";
		
		AnalyticMap.GeoJSONURL  =  "./resources/geo/countries.json";
	
		return Controller.extend("uni.mannheim.mdm.controller.analysis.CustomersPerCountry", {
		
			/**
			 * Method onInit
			 */
			onInit : function() {
				var model = new sap.ui.model.json.JSONModel("./services/analysis/customer/perCountry");
				this.getView().setModel(model, "perCountry")
			}
		});
	}, true);