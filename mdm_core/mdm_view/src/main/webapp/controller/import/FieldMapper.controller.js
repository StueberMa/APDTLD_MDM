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
		var oList = this.getView().byId("list");
		var aListItems = oList.getItems();
		var oModel = this.getView().getModel();
		aListItems.forEach(function(oListItem, index){
			var oHbox3 = oListItem.getContent()[2];
			var oHbox3_1 = oHbox3.getItems()[0];
			var oVbox = oHbox3_1.getItems()[1];
			var oSelect = oVbox.getItems()[0];
			
			var object = oModel.getObject("/Customer");
			oSelect.setSelectedKey(object.items[index].fType);
		});
	},
});