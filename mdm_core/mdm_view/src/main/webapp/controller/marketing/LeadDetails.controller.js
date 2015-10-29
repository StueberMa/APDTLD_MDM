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
		
		if(oEvent.mParameters.type != "added")
			return;
		
		// validate token
		this.validateToken(oEvent, "CampaignIdInput", "CampaignId");
	},
	
	/**
	 * Method onCustomerValidation
	 */
	onCustomerValidation : function(oEvent) {
		
		if(oEvent.mParameters.type != "added")
			return;
		
		// validate token
		this.validateToken(oEvent, "CustomerIdInput", "CustomerId");
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
	 * Method onProductValidation
	 */
	onProductValidation : function(oEvent) {
		
		if(oEvent.mParameters.type != "added")
			return;
		
		// validate token
		this.validateToken(oEvent, "ProductIdInput", "ProductId");
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
			
			this.getView().byId("CampaignIdInput").removeAllTokens();
			this.getView().byId("CustomerIdInput").removeAllTokens();
			this.getView().byId("ProductIdInput").removeAllTokens();
			
		// edit
		} else if (oEvent.getParameter("name") === "marketing.LeadDetails") {
			this._id = oEvent.getParameter("arguments").id;
			this.getView().bindElement("/Leads(" + this._id + ")", {expand: "ProductDetails,CustomerDetails,CampaignDetails"});
			
			
			if(this._mode != "CREATE") {
				var msgArea = this.getView().byId("messageArea");
				msgArea.removeAllContent();
				
				this.setValueSuggestions();
			}
			
			this._mode = "EDIT";
			
			var button = this.getView().byId("deleteButton");
			button.setVisible(true);
			
		// leave
		} else {
			
			// skip if edit
			if ( this._mode !== "CREATE")
				return;
			
			var context = this.getView().getBindingContext();
			this._model.deleteCreatedEntry(context);
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
		var campaignId = this._model.getProperty("/Leads(" + this._id + ")/CampaignDetails/Id");
		var campaignName = this._model.getProperty("/Leads(" + this._id + ")/CampaignDetails/Name");
		
		var token = new sap.m.Token({key: campaignId, text: campaignName});
		this.getView().byId("CampaignIdInput").addToken(token);
		
		// customer
		var customerId = this._model.getProperty("/Leads(" + this._id + ")/CustomerDetails/Id");
		var customerFirstName = this._model.getProperty("/Leads(" + this._id + ")/CustomerDetails/FirstName");
		var customerLastName = this._model.getProperty("/Leads(" + this._id + ")/CustomerDetails/LastName");
		
		token = new sap.m.Token({key: customerId, text: customerFirstName + " " + customerLastName});
		this.getView().byId("CustomerIdInput").addToken(token);
		
		// product
		var productId = this._model.getProperty("/Leads(" + this._id + ")/ProductDetails/Id");
		var productName = this._model.getProperty("/Leads(" + this._id + ")/ProductDetails/Name");
		
		token = new sap.m.Token({key: productId, text: productName});
		this.getView().byId("ProductIdInput").addToken(token); 
	},
	
	/**
	 * Method validateToken
	 */
	validateToken : function(oEvent, fieldId, attribute) {
		
		// ensure 1:1 relationship
		var field = this.getView().byId(fieldId);
		if(field.getTokens().length > 1) {
			field.removeToken(field.getTokens()[0]);
		}
		
		// set id
		var id = parseInt(oEvent.mParameters.token.mProperties.key);
		this._model.setProperty(attribute, id, this.getView().getBindingContext());
	}
	
});