sap.ui.jsview("components.customer_details.customerDetails", {

	/**
	 * Method getControllerName.
	 * 
	 * @returns {String}
	 */
	getControllerName : function() {
		return "components.customer_details.customerDetails";
	},

	/**
	 * Method createContent
	 */
	createContent : function(oController) {
		
		var oCustomerDetailsForm = new sap.ui.layout.form.Form("F1",{
			title: new sap.ui.core.Title({text: "Customer Details", tooltip: "Customer details"}),
			editable: false,
			layout: new sap.ui.layout.form.GridLayout(),
			formContainers: [
			 	// general details form
				new sap.ui.layout.form.FormContainer("F1C1",{
					title: "General data",
					formElements: [
						new sap.ui.layout.form.FormElement({
							fields: [new sap.ui.commons.Image({
										src: "resources/images/user_pic.png",
										width: "150px",
										layoutData: new sap.ui.layout.form.GridElementData({hCells: "4", vCells: 5}) 
								})
							],
							layoutData: new sap.ui.layout.form.GridElementData()
						}),
						
						// birth date
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
									text: "Title",
									layoutData: new sap.ui.layout.form.GridElementData()
							}),
							fields: [new sap.ui.commons.DropdownBox({
										id: 'titleFieldId',
										items: [new sap.ui.core.ListItem({text: "Mr."}),
										        new sap.ui.core.ListItem({text: "Mrs."})
												],
										value: "{customerModel>Title}",
										layoutData: new sap.ui.layout.form.GridElementData({hCells: "2"}),
										editable: "{controllerModel>/enabled}"
							})],
							layoutData: new sap.ui.layout.form.GridElementData()
						}),
						
						// first name and last name
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
									text:"Name",
									layoutData: new sap.ui.layout.form.GridElementData()
								}),
							fields: [new sap.ui.commons.TextField({
										id: 'firstNameFieldId',
										value: "{customerModel>FirstName}",
										layoutData: new sap.ui.layout.form.GridElementData(),
										editable: "{controllerModel>/enabled}",
										placeholder: "First name"
									}),
									new sap.ui.commons.TextField({
										id: 'lastNameFieldId',
										value: "{customerModel>LastName}",
										layoutData: new sap.ui.layout.form.GridElementData(),
										editable: "{controllerModel>/enabled}",
										placeholder: "Last name"
									})
							],
							layoutData: new sap.ui.layout.form.GridElementData()
						}),
						
						// birth date
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
									text: "Date of Birth",
									layoutData: new sap.ui.layout.form.GridElementData()
							}),
							fields: [new sap.ui.commons.DatePicker({
										id: 'birthDateFieldId',
										value: "{customerModel>BirthDate}",
										layoutData: new sap.ui.layout.form.GridElementData({hCells: "3"}),
										type: new sap.ui.model.odata.type.DateTime(),
										editable: "{controllerModel>/enabled}",
										placeholder: "Birth date"
									})],
							layoutData: new sap.ui.layout.form.GridElementData()
						}),
						
						// gender
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
									text:"Gender",
									layoutData: new sap.ui.layout.form.GridElementData()
							}),
							fields: [new sap.ui.commons.RadioButtonGroup({
								id: 'genderFieldId',
								items: [new sap.ui.core.Item({text: "male"}),
								        new sap.ui.core.Item({text: "female"})],
								value: "{customerModel>Gender}",
								editable: "{controllerModel>/enabled}"
							})]
						})
						],
						layoutData: new sap.ui.layout.form.GridContainerData()
				}),
				
				// address details form
				new sap.ui.layout.form.FormContainer("F1C2",{
					title: new sap.ui.core.Title({text: "Address details", tooltip: "Address details"}),
					formElements: [
					    // street name + number
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text: "Street / Number",
								layoutData: new sap.ui.layout.form.GridElementData()
							}),
							fields: [new sap.ui.commons.TextField({
										id: 'addressStreetFieldId',
										layoutData: new sap.ui.layout.form.GridElementData(),
										value: "{customerModel>Address/Street}",
										editable: "{controllerModel>/enabled}",
										placeholder: "Street"
									}),
									new sap.ui.commons.TextField({
										id: 'addressHouseNoFieldId',
										layoutData: new sap.ui.layout.form.GridElementData(),
										value: "{customerModel>Address/HouseNo}",
										editable: "{controllerModel>/enabled}",
										placeholder: "No"
									})
							]
						}),
						
						// zip code + city
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text: "Zip Code / City", 
								layoutData: new sap.ui.layout.form.GridElementData()
							}), 
							fields: [new sap.ui.commons.TextField({
										id: 'addressZipCodeFieldId',
										layoutData: new sap.ui.layout.form.GridElementData(),
										value: "{customerModel>Address/ZipCode}",
										editable: "{controllerModel>/enabled}",
										placeholder: "Zip code"
									}),
							         new sap.ui.commons.TextField({
							        	 id: 'addressCityFieldId',
							        	 layoutData: new sap.ui.layout.form.GridElementData(),
							        	 value: "{customerModel>Address/City}",
							        	 editable: "{controllerModel>/enabled}",
							        	 placeholder: "City"
							        })
							],
							layoutData: new sap.ui.layout.form.GridElementData()
						}),
						
						// country
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
											text: "Country", 
											layoutData: new sap.ui.layout.form.GridElementData()
										}),
							fields: [new sap.ui.commons.TextField({
										id: 'addressCountryFieldId',
										layoutData: new sap.ui.layout.form.GridElementData(),
										value: "{customerModel>Address/Country}",
										editable: "{controllerModel>/enabled}",
										placeholder: "Country"
									})],
							layoutData: new sap.ui.layout.form.GridElementData()
						})
						],
					layoutData: new sap.ui.layout.form.GridContainerData({halfGrid: true})
				}),
				
				// contact details form
				new sap.ui.layout.form.FormContainer("F1C3",{
					title: "Contact details",
					expandable: false,
					formElements: [
					    // phone number
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text: "Phone", 
								layoutData: new sap.ui.layout.form.GridElementData({hcells:"2"})
							}),
							fields: [
					         	new sap.ui.commons.TextField({
					         		id: 'contactDetailsPhoneFieldId',
									layoutData: new sap.ui.layout.form.GridElementData({hcells:"3"}),
									value: "{customerModel>ContactDetails/Phone}",
									editable: "{controllerModel>/enabled}",
									placeholder: "Phone number"
								})
							],
							layoutData: new sap.ui.layout.form.GridElementData({hcells:"5"})
						}),
					    
						// mobile number
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text: "Mobile", 
								layoutData: new sap.ui.layout.form.GridElementData({hcells:"2"}),
								value: "{customerModel>ContactDetails/Mobile}"
							}),
							fields: [new sap.ui.commons.TextField({
								id: 'contactDetailsMobileFieldId',
								layoutData: new sap.ui.layout.form.GridElementData(),
								editable: "{controllerModel>/enabled}",
								placeholder: "Mobile number"
							})],
							layoutData: new sap.ui.layout.form.GridElementData()
						}),
						
						// email address
						new sap.ui.layout.form.FormElement({
							label: new sap.ui.commons.Label({
								text: "E-Mail Address", 
								layoutData: new sap.ui.layout.form.GridElementData({hcells:"2"})
							}),
							fields: [new sap.ui.commons.TextField({ 
											id: 'contactDetailsEmailFieldId',
											layoutData: new sap.ui.layout.form.GridElementData(),
											value: "{customerModel>ContactDetails/Email}",
											editable: "{controllerModel>/enabled}",
											placeholder: "E-Mail address"
									})],
							layoutData: new sap.ui.layout.form.GridElementData()
						})
					],
					layoutData: new sap.ui.layout.form.GridContainerData({halfGrid: true})
				}),
				
				// save form data button
				new sap.ui.layout.form.FormContainer("F1C4",{
					formElements: [
						new sap.ui.layout.form.FormElement({
							fields: [new sap.ui.commons.TextView(),
							         
							         new sap.ui.commons.Button({
											id : 'saveCustomerButtonId',
											text : "Save",
											press : function() { oController.addNewCustomer() },
											layoutData: new sap.ui.layout.form.GridElementData({hCells: "2"})
									}),
									new sap.ui.commons.Button({text: "Back",
																tooltip: "Go Back",
																press: function() {alert("Back");},
																layoutData: new sap.ui.layout.form.GridElementData({hCells: "2"})}),
									new sap.ui.commons.Button({text: "Close",
																tooltip: "Close this window",
																press: function() {alert("Close");},
																layoutData: new sap.ui.layout.form.GridElementData({hCells: "2"})})
									],
							layoutData: new sap.ui.layout.form.GridElementData()
						}),
					],
					layoutData: new sap.ui.layout.form.GridContainerData()
				})
			]
		});
		
		oCustomerDetailsForm.addStyleClass("mdmCustomerDetails");		

		return oCustomerDetailsForm;
	}
});
