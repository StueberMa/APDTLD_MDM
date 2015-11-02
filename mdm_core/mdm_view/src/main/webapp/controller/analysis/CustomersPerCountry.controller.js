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
				model.attachRequestCompleted(this.onDataLoaded, this);
			},
			
			onDataLoaded : function(oEvent) {
				
				var data = oEvent.getSource().oData;
				var map = this.getView().byId("customerMap");
				
				// add regions
				data.forEach(function(entry) {
					map.addRegion(sap.ui.vbm.Region({color: "rgba(5,71,102, " + entry[1] + ")", code: entry[0]}));
				});
			}
			
		});
	}, true);