//sap.ui.controller("uni.mannheim.mdm.controller.analysis.CustomersPerCountry", {
	
	sap.ui.define(['sap/ui/vbm/AnalyticMap'],
			function(AnalyticMap) {
			"use strict";

			//AnalyticMap.GeoJSONURL  =  "test-resources/sap/ui/vbm/demokit/media/analyticmap/continent.json";
			AnalyticMap.GeoJSONURL  =  "src/main/webapp/resources/analyticmap/L0.json";

			sap.ui.controller("uni.mannheim.mdm.controller.analysis.CustomersPerCountry", {
			
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


		}, /* bExport= */ true);	

//});