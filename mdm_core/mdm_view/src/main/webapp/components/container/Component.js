sap.ui.define(['sap/ui/core/UIComponent'], function(UIComponent) {
	"use strict";

	var Component = UIComponent.extend("uni.mannheim.mdm.components.container.Component", {
		metadata : {
			rootView : "uni.mannheim.mdm.components.container.Container",
			dependencies : {
				libs : [
					"sap.ui.unified",
					"sap.ui.layout",
					"sap.m"
				]
			},
			config : {
				sample : {
					files : [
						"Container.view.xml",
						"Container.controller.js"
					]
				}
			}
		}
	});

	return Component;
});