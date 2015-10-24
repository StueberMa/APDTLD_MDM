sap.ui.controller("uni.mannheim.mdm.controller.import.FieldMapper", {

	onInit : function (evt) {
		// set explored app's demo model on this sample
		
		var oModel = new sap.ui.model.json.JSONModel();	
		oModel.loadData("/mdm_view/fileanalyser?file=Mappe1.csv");
		console.log(oModel.getJSON());
		this.getView().setModel(oModel);
		oModel.attachRequestCompleted($.proxy(this.updateSelects, this));
	},

	updateSelects: function(evt) {
		var _this = this;
		var oList = this.getView().byId("mappingList");
		var aListItems = oList.getItems();
		var oModel = this.getView().getModel();
		aListItems.forEach(function(oListItem, index){
			var oHbox0 = oListItem.getContent()[0];
			var oHbox0_0 = oHbox0.getItems()[0];
			var oVbox1 = oHbox0_0.getItems()[1];
			var oFTypeSelect = oVbox1.getItems()[0];
			var oHbox0_1 = oHbox0.getItems()[1];
			var oVbox0 = oHbox0_1.getItems()[0];
			var oDBNameSelect = oVbox0.getItems()[0];
			
			var oMappings = oModel.getObject("/mappings");
			oFTypeSelect.setSelectedKey(oMappings[index].fType);
			oDBNameSelect.setSelectedKey(oMappings[index].dbName);
			console.log(oDBNameSelect);
			oDBNameSelect.attachChange(oListItem, $.proxy(_this.onDBNameChange, _this));
		});
	},
	
	onDBNameChange: function(evt, oListItem) {
		var oHbox0 = oListItem.getContent()[0];
		var oHbox0_1 = oHbox0.getItems()[1];
		var oVbox0 = oHbox0_1.getItems()[0];
		var oDBNameSelect = oVbox0.getItems()[0];
		var oVbox1 = oHbox0_1.getItems()[1];
		var oDBTypeLabel = oVbox1.getItems()[0];
		var oModel = this.getView().getModel();
		var selectedText = oDBNameSelect.getSelectedItem().getText();
		console.log(selectedText);
		oModel.getObject("/attributes").forEach(function(attribute) {
			if(attribute.name == selectedText) {
				oDBTypeLabel.setText(attribute.type);
				return;
			}
		});
	},
});