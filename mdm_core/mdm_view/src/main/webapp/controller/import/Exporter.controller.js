sap.ui.controller("uni.mannheim.mdm.controller.import.Exporter", {

	file:"",
	remainingFiles:[],
	
	onInit: function (evt) {
		this.initModel();
	},
	
	initModel: function(event) {
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData("/mdm_view/export");
		this.getView().setModel(oModel);
		
	},
	
	onEntitySelect: function(evt) {
		var selected = evt.getParameter("selected");
		var entityCheckbox = sap.ui.getCore().byId(evt.getParameter("id"));
		var tables = this.getView().getModel().getObject("/database_tables/");
		console.log(this.getView().getModel());
		tables.forEach(function(table){
			if(table.name != entityCheckbox.getText()) {
				return;
			}
			for(var i=0; i<4; i++) {
				table["attributes_"+i].forEach(function(attribute){
					attribute.selected = selected;
				});
		}
		});
		this.getView().getModel().refresh();
	},
	
	onAttributeSelect: function(evt) {
		var selected = evt.getParameter("selected");
		var attributeCheckbox = sap.ui.getCore().byId(evt.getParameter("id"));
		var entityCheckbox = attributeCheckbox.getParent().getParent().getParent().getParent().getParent().getItems()[0].getItems()[0];
		var tables = this.getView().getModel().getObject("/database_tables/");
		
		tables.forEach(function(table){
			if(table.name != entityCheckbox.getText()) {
				return;
			}
			var selectedCount=0;
			for(var i=0; i<4; i++) {
				table["attributes_"+i].forEach(function(attribute){
					if(attribute.name == attributeCheckbox.getText()) {
						attribute.selected = selected;
					}
					attribute.selected?selectedCount++:null;
				});
			}
			entityCheckbox.setSelected(selectedCount>0);
		});
		this.getView().getModel().refresh();
	}
	
});