sap.ui.controller("uni.mannheim.mdm.controller.import.FieldMapper", {

	oPersonalizationDialog: null,
	file:"",
	remainingFiles:[],
	
	onInit : function (evt) {
		// set explored app's demo model on this sample
		
		var oModel = new sap.ui.model.json.JSONModel();
		var parts = window.location.href.split('/');
		var files = parts[parts.length-1].split(';');
		this.file = decodeURIComponent(files[0]);
		files.splice(0,1);
		this.remainingFiles = files;
		oModel.loadData("/mdm_view/fileanalyser?file=" + files[0]);
		this.getView().setModel(oModel);
		
		this.oPersonalizationDialog = sap.ui.xmlfragment("uni.mannheim.mdm.controller.import.FieldMapperAdd", this);
		this.getView().addDependent(this.oPersonalizationDialog);
	},
	
	/*updateSelects: function(evt) {
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
	},*/
	
	onDBNameChange: function(evt) {
		var oHbox0 = evt.getSource().getParent().getParent().getParent();
		var oHbox0_1 = oHbox0.getItems()[1];
		var oVbox0 = oHbox0_1.getItems()[0];
		var oDBNameSelect = oVbox0.getItems()[0];
		var oVbox1 = oHbox0_1.getItems()[1];
		var oDBTypeLabel = oVbox1.getItems()[0];
		var oModel = this.getView().getModel();
		if(oDBNameSelect.getSelectedItem()==null) {
			oDBTypeLabel.setText("-");
			return;
		}
		var selectedText = oDBNameSelect.getSelectedItem().getText();
		console.log(selectedText);
		oModel.getObject("/attributes_database").forEach(function(attribute) {
			if(attribute.name == selectedText) {
				oDBTypeLabel.setText(attribute.type);
				return;
			}
		});
	},
	
	onDelete: function(evt){
		var index = evt.getSource().getId().split('-');
		index = index[index.length-1];
		var mappingsArray = this.getView().getModel().getObject('/mappings');
		mappingsArray.splice(index,1);
		this.getView().getModel().refresh();
	},
	
	onAdd: function(evt) {
		// toggle compact style
		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.oPersonalizationDialog);
		this.oPersonalizationDialog.open();
	},
	
	handleCloseOk: function(evt) {
		var mappingsArray = this.getView().getModel().getObject('/mappings');
		var newMapping = {
				fName: sap.ui.getCore().byId("popoverFileName").getSelectedItem().getText(),
				fType: sap.ui.getCore().byId("popoverFileType").getSelectedItem().getText(),
				fSample: sap.ui.getCore().byId("popoverFileSample").getText(),
				dbName: sap.ui.getCore().byId("popoverDbName").getSelectedItem().getText(),
				dbType: sap.ui.getCore().byId("popoverDbType").getText(),
				dbSample: sap.ui.getCore().byId("popoverDbSample").getText()
		};
		mappingsArray.push(newMapping);
		this.getView().getModel().refresh();
		this.oPersonalizationDialog.close();
		this.resetPopover();
	},
	
	handleCloseCancel: function() {
		this.oPersonalizationDialog.close();
		this.resetPopover();
	},
	
	onPopoverFileNameChange: function(evt) {
		var selectedText = evt.getSource().getSelectedItem().getText();
		var aFileAttributes = this.getView().getModel().getObject('/attributes_file');
		aFileAttributes.forEach(function(attribute) {
			if(attribute.name == selectedText) {
				sap.ui.getCore().byId("popoverFileType").setSelectedKey(attribute.type);
				sap.ui.getCore().byId("popoverFileSample").setText(attribute.sample);
				return;
			}
		});
	},
	
	onPopoverDBNameChange: function(evt) {
		var selectedText = evt.getSource().getSelectedItem().getText();
		var aAttributesDB =  this.getView().getModel().getObject('/attributes_database');
		aAttributesDB.forEach(function(attribute) {
			if(attribute.name == selectedText) {
				sap.ui.getCore().byId("popoverDbType").setText(attribute.type);
				sap.ui.getCore().byId("popoverDbSample").setText(attribute.sample);
				return;
			}
		});
	},
	
	resetPopover: function() {
		sap.ui.getCore().byId("popoverFileName").setSelectedKey('');
		sap.ui.getCore().byId("popoverFileType").setSelectedKey('Text'),
		sap.ui.getCore().byId("popoverFileSample").setText(''),
		sap.ui.getCore().byId("popoverDbName").setSelectedKey(''),
		sap.ui.getCore().byId("popoverDbType").setText(''),
		sap.ui.getCore().byId("popoverDbSample").setText('')
	},
	
	onAnalyseRows: function() {
		var jsonModel = this.getView().getModel().getJSON();
		$.ajax({
			type: "POST",
			contentType: "application/json",
			url: '/mdm_view/fileanalyser',
			dataType: "json",
			async: false,
			data: jsonModel,
			success: $.proxy(function(data, textStatus, jqXHR) {
				sap.m.MessageToast.show("All data for file " + this.file + " was successfully imported.");
				setTimeout($.proxy(function() {
					console.log(this.remainingFiles);
					if(this.remainingFiles.length>0) {
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.loadData("/mdm_view/fileanalyser?file=" + this.remainingFiles[0]);
						this.file = decodeURIComponent(this.remainingFiles[0]);
						this.remainingFiles.splice(0,1);
					} else {
						this.getOwnerComponent().getRouter().navTo("masterdata.Overview");
					}
				}, this), 2000);
			}, this),
			error: function(data, textStatus, jqXHR) {
				alert("no!");
			}
		});
		
	}
	
});