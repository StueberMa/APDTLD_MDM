sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/vbm/AnalyticMap"
	],
	
	function(Controller, AnalyticMap) {
		"use strict";
		
		AnalyticMap.GeoJSONURL  =  "./resources/geo/countries.json";
	
		return Controller.extend("uni.mannheim.mdm.controller.analysis.CustomersPerCountry", {
		
			onRegionClick: function (e)
			{
				sap.m.MessageToast.show( "onRegionClick " + e.getParameter( "code" ) );
			},
	
			onRegionContextMenu: function ( e )
			{
				sap.m.MessageToast.show( "onRegionContextMenu " + e.getParameter( "code" ) );
			},
		
			onAddItem: function (evt)
			{
				var item = new sap.ui.vbm.Region({ code: 'SA', color: 'rgba(198,225,125,1.0)', tooltip: 'South America'});
				this.byId("vbi").insertRegion(item, 0);
			
				this.byId("AddButton").setEnabled(false);
				this.byId("RemoveAllButton").setEnabled(true);
			},
		
			onRemoveAllItems: function (evt)
			{	
				this.byId("vbi").removeAllRegions();
	
				this.byId("AddButton").setEnabled(true);
				this.byId("RemoveAllButton").setEnabled(false);
			},
		
			onZoomIn : function() 
			{
				this.byId("vbi").zoomToRegions( ["SA"] );		
				this.byId("ZoomOut").setEnabled(true);
				this.byId("ZoomIn").setEnabled(false);
			}
		});
	}, true);