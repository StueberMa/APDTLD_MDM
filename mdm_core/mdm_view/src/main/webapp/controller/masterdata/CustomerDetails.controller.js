sap.ui.controller("uni.mannheim.mdm.controller.masterdata.CustomerDetails", {
	
	/**
	 * Method onInit.
	 */
	onInit : function() {
		// Definition of a model that contains central variables for controlling the UI
		var controllerModel = new sap.ui.model.json.JSONModel();
		controllerModel.setData({
		    		enabled: true
		});

		this.getView().setModel(controllerModel, "controllerModel");
			
		var sOrigin = window.location.protocol + "//"
		+ window.location.hostname
		+ (window.location.port ? ":" + window.location.port : "");
		
		// static definition of the customer ID that should be retrieved
		// TODO: retrieve id from url parameters
		id = 1;
		
		// create customer model and bind the specific customer to the user form
		var customerListOdataServiceUrl = sOrigin + "/mdm_view/services/customer.svc";
		var odataModel = new sap.ui.model.odata.ODataModel(customerListOdataServiceUrl);

		this.getView().setModel(odataModel, "customerModel");
		this.getView().bindElement("customerModel>/Customers(" + id + ")");
		this.getView().byId("birthDateFieldId").bindProperty("value", {
			path:'customerModel>BirthDate',
			type: new sap.ui.model.type.Date({source: {pattern: "yyyy-MM-ddTKK:mm:ss"}}),
		});
		
		console.log(this.getView().getElementBinding("customerModel"));
		
		
		

		// make sure to store the current view element
		_this = this;
		// make sure that the customer is available
		// TODO: find a more efficient method than reading the data from the server manually -> first request already returns 404 (how to access it?!)
		odataModel.read('/Customers(' + id + ')/', {
			success: function(oData, response) {
				// very good!
			},
			error: function(oError) {
				// change to input mode since no user information is available
				var controllerModel = new sap.ui.model.json.JSONModel();
				controllerModel.setData({
				    		enabled: true
				});
				_this.getView().setModel(controllerModel, "controllerModel");
				_this.getView().unbindObject("customerModel");
				
				// return error message as indicator that something has gone wrong
				sap.ui.commons.MessageBox.alert('The customer with ID ' + id + ' does not exist!');
			}

		})
		
		//		odataModel.setDefaultBindingMode("TwoWay");
	},
	
	// TODO: include an implementation to retrieve customer ID from path
	getCurrentCustomerId: function() {
		return 1;
	},
	
	// TODO: make it possible to switch between change and save mode
	setIsEditable: function(isEditable) {
		form = sap.ui.getCore().byId("F1");
		form.isEditable(true);
	},
	
	
	dateFromString : function(sDate) {
		// Try to create date directly, otherwise assume dd/mm/yyyy
		var oDate = new Date(sDate);
		return oDate === "Invalid Date" ? new Date(sDate.split("/").reverse()) : oDate;

	},
	/**
	 * Method addNewCustomer.
	 */
	onSave : function() {
		var customer = {};
		//TODO: Add birthDate conversion
		customer.FirstName = this.getView().byId("firstNameFieldId").getValue();
		customer.LastName = this.getView().byId("lastNameFieldId").getValue();
		customer.Title= this.getView().byId("titleFieldId").getSelectedKey();
		customer.BirthDate = this.getView().byId("birthDateFieldId").getDateValue();
		customer.Gender = this.getView().byId("genderFieldId").getSelectedIndex();
		customer.Address = {};
		customer.Address.Street = this.getView().byId("addressStreetFieldId").getValue();
		customer.Address.HouseNo = this.getView().byId("addressHouseNoFieldId").getValue();
		customer.Address.ZipCode = this.getView().byId("addressZipCodeFieldId").getValue();
		customer.Address.City = this.getView().byId("addressCityFieldId").getValue();
		customer.Address.Country = this.getView().byId("addressCountryFieldId").getValue();
		customer.ContactDetails = {};
		customer.ContactDetails.Phone = this.getView().byId("contactDetailsPhoneFieldId").getValue();
		customer.ContactDetails.Mobile = this.getView().byId("contactDetailsMobileFieldId").getValue();
		customer.ContactDetails.Email = this.getView().byId("contactDetailsEmailFieldId").getValue();
		
		this.getView().getModel("customerModel");
			
		this.getView().getModel("customerModel").create("/Customers", customer, { success: this.successMsg,	error: this.errorMsg });
	},
	
	onCancel : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("masterdata.CustomerOverview", false);
	},
	
	onBack : function () {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("masterdata.CustomerOverview", false);
	},
	
	/**
	 * Method successMsg.
	 */
	successMsg : function() {
		sap.ui.commons.MessageBox.alert("Customer entity has been successfully created");
	},
	
	/**
	 * Method errorMsg.
	 */
	errorMsg : function() {
		sap.ui.commons.MessageBox.alert("Error occured when creating customer entity");
	}
});