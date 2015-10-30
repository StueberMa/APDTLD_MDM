sap.ui.controller("uni.mannheim.mdm.controller.marketing.LeadDetails", {

	/**
	 * Method onInit
	 */
	onInit : function() {
		
		// model
		this._model = this.getOwnerComponent().getModel();
		
		// router
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
	 * Method onCampaignValidation
	 */
	onCampaignValidation : function(oEvent) {
		
		// ensure added or removed
		if(oEvent.mParameters.type != "added" && oEvent.mParameters.type != "removed")
			return;
		
		// get id
		var id = oEvent.mParameters.token.mProperties.key;
		
		// field is actually initial
		if(id == this._id) {
			this.resetMultiInput("CampaignIdHelper");
			return;
		}
		
		if(oEvent.mParameters.type == "added")
			this.validateToken(id, "CampaignIdHelper", "CampaignId");
	},
	
	/**
	 * Method onCustomerValidation
	 */
	onCustomerValidation : function(oEvent) {
		
		// ensure added or removed
		if(oEvent.mParameters.type != "added" && oEvent.mParameters.type != "removed")
			return;
		
		// get id
		var id = oEvent.mParameters.token.mProperties.key;
		
		// field is actually initial
		if(id == this._id) {
			this.resetMultiInput("CustomerIdHelper");
			return;
		}
		
		if(oEvent.mParameters.type == "added")
			this.validateToken(id, "CustomerIdHelper", "CustomerId");
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
		model.remove("/Leads('" + this._id + "')", {success: jQuery.proxy(this.onDeleteSuccess, this), error: jQuery.proxy(this.onDeleteError, this)});
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
	 * Method onProductValidation
	 */
	onProductValidation : function(oEvent) {
		
		// ensure added or removed
		if(oEvent.mParameters.type != "added" && oEvent.mParameters.type != "removed")
			return;
		
		// get id
		var id = oEvent.mParameters.token.mProperties.key;
		
		// field is actually initial
		if(id == this._id) {
			this.resetMultiInput("ProductIdHelper");
			return;
		}
		
		if(oEvent.mParameters.type == "added")
			this.validateToken(id, "ProductIdHelper", "ProductId");
	},
	
	/**
	 * Method onRequest
	 */
	onRequest : function(oEvent) {
		
		// create
		if (oEvent.getParameter("name") === "marketing.LeadCreate") {
			var context = this._model.createEntry("/Leads");
			this.getView().unbindElement();
			this.getView().setBindingContext(context);
			this._mode = "CREATE";
			
			var button = this.getView().byId("deleteButton");
			button.setVisible(false);
			
			var msgArea = this.getView().byId("messageArea");
			msgArea.removeAllContent();
			
			this.getView().byId("CampaignIdHelper").removeAllTokens();
			this.getView().byId("CustomerIdHelper").removeAllTokens();
			this.getView().byId("ProductIdHelper").removeAllTokens();
			
			return;
		}
			
		// edit
		if (oEvent.getParameter("name") === "marketing.LeadDetails") {
			this._id = oEvent.getParameter("arguments").id;
			this.getView().bindElement("/Leads('" + this._id + "')");
			
			
			if(this._mode != "CREATE") {
				var msgArea = this.getView().byId("messageArea");
				msgArea.removeAllContent();
				
				this.setValueSuggestions();
			}
			
			this._mode = "EDIT";
			
			var button = this.getView().byId("deleteButton");
			button.setVisible(true);
			
			return;
		}
		
		// leave	
		if(this._mode == "CREATE") {
			var context = this.getView().getBindingContext();
			this._model.deleteCreatedEntry(context);
			this._mode = undefined;
		}
			
		if(this._mode == "EDIT") {
			this._model.resetChanges();
			this._mode = undefined;
		}
	},

	/**
	 * Method onSave
	 */
	onSave : function() {
		this._model.submitChanges({success : jQuery.proxy(this.onSaveSuccess, this), error: jQuery.proxy(this.onSaveError, this)});
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
	},
	
	/**
	 * Method setValueSuggestions
	 */
	setValueSuggestions : function() {
		
		// campaign
		var token = sap.ui.xmlfragment("uni.mannheim.mdm.fragment.CampaignSuggestion");
		token.bindElement("/Leads('" + this._id + "')/CampaignDetails");
		this.getView().byId("CampaignIdHelper").addToken(token);
		
		// customer
		token = sap.ui.xmlfragment("uni.mannheim.mdm.fragment.CustomerSuggestion");
		token.bindElement("/Leads('" + this._id + "')/CustomerDetails");
		this.getView().byId("CustomerIdHelper").addToken(token);
		
		// product
		token = sap.ui.xmlfragment("uni.mannheim.mdm.fragment.ProductSuggestion");
		token.bindElement("/Leads('" + this._id + "')/ProductDetails");
		this.getView().byId("ProductIdHelper").addToken(token); 
	},
	
	/**
	 * Method resetMultiInput
	 */
	resetMultiInput : function(fieldId) {
		var field = this.getView().byId(fieldId);
		field.removeAllTokens();
	},
	
	/**
	 * Method validateToken
	 */
	validateToken : function(id, fieldId, attribute) {
		
		// ensure 1:1 relationship
		var field = this.getView().byId(fieldId);
		if(field.getTokens().length > 1) {
			field.removeToken(field.getTokens()[0]);
		}
		
		// set id
		this._model.setProperty(attribute, id, this.getView().getBindingContext());
	}
	
});