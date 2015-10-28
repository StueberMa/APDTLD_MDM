package uni.mannheim.apdtld.mdm_view.services;

import java.util.HashMap;
import java.util.HashSet;

public class Table {
	
	private String name;
	private HashMap<String, AttributeTupel> attibuteInfoMap = new HashMap<String, AttributeTupel>();
	private HashSet<Table> dependencies = new HashSet<Table>();
	
	public Table(String name) {
		this.name = name;
	}
	
	public void addDependency(Table table) {
		this.dependencies.add(table);
	}
	
	public void addAttribute(String name, String type, String sample) {
		this.attibuteInfoMap.put(name, new AttributeTupel(name, type, sample));
	}
	
	public String getName() {
		return this.name;
	}

	public HashMap<String, AttributeTupel> getAttributeInfo() {
		return this.attibuteInfoMap;
	}
}
