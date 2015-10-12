sap.ui.define([ 'sap/ui/core/UIComponent' ], function(UIComponent) {
	"use strict";

	var Component = UIComponent.extend(
			"uni.mannheim.mdm.components.overview.Component", {
				metadata : {
					rootView : "uni.mannheim.mdm.components.overview.Overview",
					dependencies : {
						libs : [ "sap.suite.ui.commons" ]
					},
					config : {
						sample : {
							stretch : true,
							files : [
							        "Overview.view.xml",
									"Overview.controller.js"
							]
						}
					}
				}
			});

	return Component;
});
