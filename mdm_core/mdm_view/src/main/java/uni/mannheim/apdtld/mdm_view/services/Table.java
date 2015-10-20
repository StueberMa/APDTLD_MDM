package uni.mannheim.apdtld.mdm_view.services;

import java.util.HashMap;
import java.util.HashSet;

public class Table {
	
	private String name;
	private HashMap<String, String> attibuteTypeMap = new HashMap<String, String>();
	private HashSet<Table> dependencies = new HashSet<Table>();
	
	public Table(String name) {
		this.name = name;
	}
	
	public void addDependency(Table table) {
		this.dependencies.add(table);
	}
	
	public void addAttribute(String name, String type) {
		this.attibuteTypeMap.put(name, type);
	}
	
	public String getName() {
		return this.name;
	}

	public HashMap<String, String> getAttributeNamesAndTypes() {
		return this.attibuteTypeMap;
	}
}
