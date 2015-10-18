sap.ui.controller("uni.mannheim.mdm.controller.masterdata.CustomerDetails", {

	/**
	 * Method controllMode
	 */
	controllMode : function(oEvent) {
		
		// create
		if (oEvent.getParameter("name") === "masterdata.CustomerCreate") {
			var context = this.getView().getModel().createEntry("/Customers", {});
			this.getView().unbindElement();
			this.getView().setBindingContext(context);
			
		// edit
		} else if (oEvent.getParameter("name") === "masterdata.CustomerDetails") {
			var id = oEvent.getParameter("arguments").id;
			this.getView().bindElement("/Customers(" + id + ")");
			
		// leave
		} else {
			var context = this.getView().getBindingContext();

			if (context === "undefined")
				return;
			
			this.getView().getModel().deleteCreatedEntry(context);
		}
	},

	/**
	 * Method onExit
	 */
	onExit : function() {
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.detachRouteMatched(this.controllMode, this);
	},

	/**
	 * Method onInit.
	 */
	onInit : function() {
		
		// create || edit || leave
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.attachRouteMatched(this.controllMode, this);
	},

	/**
	 * Method addNewCustomer.
	 */
	onSave : function() {
		var model = this.getView().getModel();
		model.submitChanges(this.successMsg, this.errorMsg, {});
	},

	/**
	 * Method onCancel
	 */
	onCancel : function() {
		var oHistory = sap.ui.core.routing.History.getInstance();
		var sPreviousHash = oHistory.getPreviousHash();

		// history: go to prev. page
		if (sPreviousHash !== undefined) {
			window.history.go(-1);
		} else {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("masterdata.CustomerOverview", false);
		}
	},

	/**
	 * Method successMsg.
	 */
	successMsg : function() {

		var dialog = new sap.m.Dialog({
			title : 'Success',
			type : 'Message',
			state : 'Success',
				content: new sap.m.Text({
					text: 'Customer successfully saved'
				}),
			beginButton: new sap.m.Button({
				text: 'OK',
				press: function () {
					var oHistory = sap.ui.core.routing.History.getInstance();
					var sPreviousHash = oHistory.getPreviousHash();

					// history: go to prev. page
					if (sPreviousHash !== undefined) {
						window.history.go(-1);
					}
					
					dialog.close();
				}
			}),
			afterClose: function() {
				dialog.destroy();
			}
		});
		
		dialog.open();
	},

	/**
	 * Method errorMsg.
	 */
	errorMsg : function() {
		
		var dialog = new sap.m.Dialog({
			title : 'Internal Error',
			type : 'Message',
			state : 'Error',
				content: new sap.m.Text({
					text: 'Not able to save customer'
				}),
			beginButton: new sap.m.Button({
				text: 'OK',
				press: function () {
					var oHistory = sap.ui.core.routing.History.getInstance();
					var sPreviousHash = oHistory.getPreviousHash();

					// history: go to prev. page
					if (sPreviousHash !== undefined) {
						window.history.go(-1);
					}
					
					dialog.close();
				}
			}),
			afterClose: function() {
				dialog.destroy();
			}
		});
		
		dialog.open();
	}
});