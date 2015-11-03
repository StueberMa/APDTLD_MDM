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
			},
			
			/**
			 * Method formatCountry
			 */
			formatCountry : function(status) {	
				
				if(status == "AT")
					return "Austria";
					
				if(status == "BL")
					return "Belgium";
				
				if(status == "CN")
					return "China";
				
				if(status == "FR")
					return "France";
				
				if(status == "DE")
					return "Germany";
				
				if(status == "GB")
					return "Great Britain";
				
				if(status == "IT")
					return "Italy";
				
				if(status == "NL")
					return "Netherland";
				
				if(status == "US")
					return "United State";
			}
			
		});
	}, true);