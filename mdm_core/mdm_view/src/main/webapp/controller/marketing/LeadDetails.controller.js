sap.ui.controller("uni.mannheim.mdm.controller.marketing.LeadDetails", {

	/**
	 * Method onInit
	 */
	onInit : function() {
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.attachRouteMatched(this.onRequest, this);
	},

	/**
	 * Method onExit
	 */
	onExit : function() {
		var oRouter = this.getOwnerComponent().getRouter();
		oRouter.detachRouteMatched(this.onRequest, this);
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
			router.navTo("marketing.LeadOverview", false);
		}
	},
	
	/**
	 * Method onCustomerValidation
	 */
	onCustomerValidation : function(oEvent) {
		
		if(oEvent.mParameters.type != "added")
			return;
		
		// ensure 1:1 relationship
		var field = this.getView().byId("CustomerIdInput");
		if(field.getTokens().length > 1) {
			field.removeToken(field.getTokens()[0]);
		}
		
		// set id
		var id = parseInt(oEvent.mParameters.token.mProperties.key);
		this.getView().getModel().setProperty("CustomerId", id, this.getView().getBindingContext());
	},

	/**
	 * Method onDialogCanceled
	 */
	onDialogCanceled : function(oEvent) {
		this._dialog.destroy();
	},
	
	/**
	 * Method onDialogConfirmed
	 */
	onDialogConfirmed : function(oEvent) {
		this._dialog.destroy();
		
		var model = this.getView().getModel();
		model.remove("/Leads(" + this._id + ")", {success: jQuery.proxy(this.onDeleteSuccess, this), error: jQuery.proxy(this.onDeleteError, this)});
	},
	
	/**
	 * Method onDelete
	 */
	onDelete : function() {
		
		this._dialog = sap.ui.xmlfragment("uni.mannheim.mdm.fragment.ConfirmationDialog", this);
		
		var model = new sap.ui.model.json.JSONModel();
		model.setData( {
			title: "Delete",
			text : "Do you really want to delete the lead?",
			type: "Message",
			state : "Warning"
		});
		this._dialog.setModel(model, "dialog");
		
		this._dialog.open();
	},
	
	/**
	 * Method onDeleteError
	 */
	onDeleteError : function(oError) {
		
		// set data model
		var model = new sap.ui.model.json.JSONModel();
		model.setData( {
			text : "Lead could not be deleted",
			type : "Error"
		});
		this.getView().setModel(model, "msg");
		
		var msgArea = this.getView().byId("messageArea");
		msgArea.removeAllContent();
		msgArea.addContent(sap.ui.xmlfragment("uni.mannheim.mdm.fragment.Message"));
	},

	
	
	/**
	 * Method onDeleteSuccess
	 */
	onDeleteSuccess : function(oData) {
		
		// set data model
		var model = new sap.ui.model.json.JSONModel();
		model.setData( {
			text : "Lead successfully deleted",
			type : "Success"
		});
		this.getView().setModel(model, "msg");
		
		var msgArea = this.getView().byId("messageArea");
		msgArea.removeAllContent();
		msgArea.addContent(sap.ui.xmlfragment("uni.mannheim.mdm.fragment.Message"));
		
		// nav. to edit for create
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("marketing.LeadOverview", false);
	},
	
	/**
	 * Method onRequest
	 */
	onRequest : function(oEvent) {
		
		// create
		if (oEvent.getParameter("name") === "marketing.LeadCreate") {
			var context = this.getView().getModel().createEntry("/Leads", {});
			this.getView().unbindElement();
			this.getView().setBindingContext(context);
			this._mode = "CREATE";
			
			var button = this.getView().byId("deleteButton");
			button.setVisible(false);
			
			this.getView().byId("CustomerIdInput").removeAllTokens();
			
		// edit
		} else if (oEvent.getParameter("name") === "marketing.LeadDetails") {
			this._id = oEvent.getParameter("arguments").id;
			this.getView().bindElement("/Leads(" + this._id + ")");
			this._mode = "EDIT";
			
			var button = this.getView().byId("deleteButton");
			button.setVisible(true);
			
			var model = this.getView().getModel();
			
			// customer
			var customerId = model.getProperty("/Leads(" + this._id + ")/CustomerDetails/Id");
			var customerFirstName = model.getProperty("/Leads(" + this._id + ")/CustomerDetails/FirstName");
			var customerLastName = model.getProperty("/Leads(" + this._id + ")/CustomerDetails/LastName");;
			
			var token = new sap.m.Token({key: customerId, text: customerFirstName + " " + customerLastName});
			this.getView().byId("CustomerIdInput").addToken(token);
			
		// leave
		} else {
			
			// skip if edit
			if ( this._mode !== "CREATE")
				return;
			
			var context = this.getView().getBindingContext();
			this.getView().getModel().deleteCreatedEntry(context);
			this._mode = undefined;
		}
	},

	/**
	 * Method onSave
	 */
	onSave : function() {
		var model = this.getView().getModel();
		model.submitChanges({success : jQuery.proxy(this.onSaveSuccess, this), error: jQuery.proxy(this.onSaveError, this)});
	},
	
	/**
	 * Method onSaveError
	 */
	onSaveError : function(oError) {
		
		// set data model
		var model = new sap.ui.model.json.JSONModel();
		model.setData( {
			text : "Lead could not be saved",
			type : "Error"
		});
		this.getView().setModel(model, "msg");
		
		var msgArea = this.getView().byId("messageArea");
		msgArea.removeAllContent();
		msgArea.addContent(sap.ui.xmlfragment("uni.mannheim.mdm.fragment.Message"));
	},
	
	/**
	 * Method onSaveSuccess
	 */
	onSaveSuccess : function(oData) {
		
		var model = new sap.ui.model.json.JSONModel();
		var error = false;
		
		// analyze response for error
		if(typeof oData.__batchResponses[0].__changeResponses == "undefined") {
			error = true;
			model.setData( {
				text : "Lead could not be saved",
				type : "Error"
			});
		} else {
			model.setData( {
				text : "Lead successfully saved",
				type : "Success"
			});
		}
		this.getView().setModel(model, "msg");
		
		var msgArea = this.getView().byId("messageArea");
		msgArea.removeAllContent();
		msgArea.addContent(sap.ui.xmlfragment("uni.mannheim.mdm.fragment.Message"));
		
		// nav. to edit for create
		if(this._mode === "CREATE" && !error) {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("marketing.LeadDetails", {id: oData.__batchResponses[0].__changeResponses[0].data.Id}, true);
		}
	}
});